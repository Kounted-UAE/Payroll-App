import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Common validation schemas
export const commonSchemas = {
  uuid: z.string().uuid('Invalid UUID format'),
  email: z.string().email('Invalid email format').max(255),
  phone: z.string().regex(/^[\+]?[1-9][\d]{1,15}$/, 'Invalid phone format').optional(),
  name: z.string().min(1, 'Name is required').max(100).regex(/^[a-zA-Z\s\-'\.]+$/, 'Invalid name format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  url: z.string().url('Invalid URL format').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  amount: z.number().min(0, 'Amount must be positive').max(999999999, 'Amount too large'),
}

// Input sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      }
      return entities[char] || char
    })
}

export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

// SQL injection detection
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|'|"|`)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

// XSS detection
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/csv',
  ]
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }
  
  // Additional filename validation
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.jar']
  const fileName = file.name.toLowerCase()
  
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: 'Dangerous file extension detected' }
  }
  
  return { valid: true }
}

// Rate limiting middleware
export function createRateLimiter(options: {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
}) {
  return function rateLimitMiddleware(req: NextRequest): NextResponse | null {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip || 'anonymous'
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Clean up old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
    
    // Get or create rate limit data
    let limitData = rateLimitStore.get(key)
    if (!limitData || limitData.resetTime < now) {
      limitData = { count: 0, resetTime: now + options.windowMs }
      rateLimitStore.set(key, limitData)
    }
    
    limitData.count++
    
    if (limitData.count > options.maxRequests) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((limitData.resetTime - now) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limitData.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, options.maxRequests - limitData.count).toString(),
          },
        }
      )
    }
    
    return null // Continue processing
  }
}

// Input validation middleware factory
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async function validationMiddleware(
    req: NextRequest
  ): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
    try {
      // Parse request body
      let body: any
      try {
        body = await req.json()
      } catch (error) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          ),
        }
      }

      // Sanitize input
      const sanitizedBody = sanitizeObject(body)

      // Check for injection attempts
      const bodyString = JSON.stringify(sanitizedBody)
      if (detectSQLInjection(bodyString)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Potential SQL injection detected' },
            { status: 400 }
          ),
        }
      }

      if (detectXSS(bodyString)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Potential XSS detected' },
            { status: 400 }
          ),
        }
      }

      // Validate against schema
      const result = schema.safeParse(sanitizedBody)
      
      if (!result.success) {
        const errorMessages = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        
        return {
          success: false,
          response: NextResponse.json(
            { 
              error: 'Validation failed',
              details: errorMessages,
            },
            { status: 400 }
          ),
        }
      }

      return { success: true, data: result.data }

    } catch (error) {
      console.error('Validation middleware error:', error)
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Internal validation error' },
          { status: 500 }
        ),
      }
    }
  }
}

// Authentication middleware
export async function requireAuth(req: NextRequest): Promise<{ 
  success: true; 
  userId: string; 
} | { 
  success: false; 
  response: NextResponse 
}> {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        ),
      }
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Validate token format (basic check)
    if (!token || token.length < 10) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid token format' },
          { status: 401 }
        ),
      }
    }

    // For Supabase auth, we'll need to verify the JWT
    // This is a simplified version - in production, properly verify the JWT
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid JWT format' },
          { status: 401 }
        ),
      }
    }

    // Extract user ID from token (simplified - use proper JWT verification in production)
    try {
      const payload = JSON.parse(atob(tokenParts[1]))
      const userId = payload.sub
      
      if (!userId) {
        throw new Error('No user ID in token')
      }

      return { success: true, userId }
    } catch (error) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid token payload' },
          { status: 401 }
        ),
      }
    }

  } catch (error) {
    console.error('Auth middleware error:', error)
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      ),
    }
  }
}

// CSRF protection middleware
export function createCSRFMiddleware() {
  return function csrfMiddleware(req: NextRequest): NextResponse | null {
    // Only check CSRF for state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return null
    }

    const csrfToken = req.headers.get('x-csrf-token')
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')

    // Verify origin matches host
    if (origin && host) {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json(
          { error: 'CSRF: Origin mismatch' },
          { status: 403 }
        )
      }
    }

    // In production, implement proper CSRF token validation
    // For now, we'll check that a token is present
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 }
      )
    }

    return null // Continue processing
  }
}

// Combine multiple middleware functions
export function combineMiddleware(
  ...middlewares: Array<(req: NextRequest) => NextResponse | null | Promise<NextResponse | null>>
) {
  return async function combinedMiddleware(req: NextRequest): Promise<NextResponse | null> {
    for (const middleware of middlewares) {
      const result = await middleware(req)
      if (result) {
        return result // Early return if middleware returns a response
      }
    }
    return null // All middleware passed
  }
}

// Security headers middleware
export function securityHeadersMiddleware(): (req: NextRequest) => NextResponse | null {
  return function(req: NextRequest) {
    // Security headers are handled in next.config.mjs
    // This middleware can add additional request-specific headers
    return null
  }
}

// Request logging middleware for audit trails
export function auditLogMiddleware(req: NextRequest): NextResponse | null {
  // Log security-relevant requests
  const sensitiveEndpoints = [
    '/api/gdpr/',
    '/api/auth/',
    '/api/users/',
    '/api/admin/',
  ]
  
  const isSensitive = sensitiveEndpoints.some(endpoint => 
    req.nextUrl.pathname.startsWith(endpoint)
  )
  
  if (isSensitive) {
    console.log('AUDIT:', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.nextUrl.pathname,
      ip: req.ip || 'unknown',
      userAgent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
    })
  }
  
  return null // Continue processing
}