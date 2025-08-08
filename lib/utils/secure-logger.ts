// Secure logging utility for production environments
// Replaces console.log with structured, secure logging

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  AUDIT = 4,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  ip?: string
  userAgent?: string
}

// Sensitive data patterns to redact
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /credential/i,
  /email/i,
  /phone/i,
  /iban/i,
  /emirates_id/i,
  /passport/i,
  /ssn/i,
  /credit_card/i,
  /bank_account/i,
]

// PII field names to redact
const PII_FIELDS = [
  'email',
  'phone',
  'iban',
  'emirates_id',
  'passport_number',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'secret',
  'private_key',
  'bank_account',
  'credit_card',
  'ssn',
  'national_id',
]

class SecureLogger {
  private isProduction: boolean
  private minLogLevel: LogLevel

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.minLogLevel = this.isProduction ? LogLevel.INFO : LogLevel.DEBUG
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.redactSensitiveString(data)
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item))
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {}
      
      for (const [key, value] of Object.entries(data)) {
        // Check if key contains sensitive information
        if (this.isSensitiveField(key)) {
          sanitized[key] = this.redactValue(value)
        } else {
          sanitized[key] = this.sanitizeData(value)
        }
      }
      
      return sanitized
    }

    return data
  }

  private isSensitiveField(fieldName: string): boolean {
    const lowerField = fieldName.toLowerCase()
    return PII_FIELDS.some(pattern => lowerField.includes(pattern)) ||
           SENSITIVE_PATTERNS.some(pattern => pattern.test(fieldName))
  }

  private redactValue(value: any): string {
    if (typeof value === 'string' && value.length > 4) {
      return `***${value.slice(-4)}`
    }
    return '[REDACTED]'
  }

  private redactSensitiveString(str: string): string {
    // Redact email addresses
    str = str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
    
    // Redact phone numbers
    str = str.replace(/[\+]?[1-9][\d]{1,14}/g, '[PHONE_REDACTED]')
    
    // Redact UUID patterns that might be sensitive IDs
    str = str.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi, '[ID_REDACTED]')
    
    return str
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    const contextStr = entry.context ? JSON.stringify(entry.context) : ''
    
    return `[${entry.timestamp}] ${levelName}: ${entry.message} ${contextStr}`.trim()
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLogLevel
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return
    }

    // Sanitize the entire log entry
    const sanitizedEntry = {
      ...entry,
      context: entry.context ? this.sanitizeData(entry.context) : undefined,
    }

    const formattedLog = this.formatLogEntry(sanitizedEntry)

    // In production, you might want to send logs to a service like Winston, DataDog, etc.
    if (this.isProduction) {
      // For now, still use console but with structured data
      // In a real production environment, replace this with your logging service
      switch (entry.level) {
        case LogLevel.ERROR:
        case LogLevel.AUDIT:
          console.error(formattedLog)
          break
        case LogLevel.WARN:
          console.warn(formattedLog)
          break
        default:
          console.log(formattedLog)
      }
    } else {
      // Development logging with more detail
      console.log(formattedLog)
    }

    // Send audit logs to a dedicated audit service in production
    if (entry.level === LogLevel.AUDIT && this.isProduction) {
      this.sendToAuditService(sanitizedEntry)
    }
  }

  private async sendToAuditService(entry: LogEntry): Promise<void> {
    try {
      // In production, implement actual audit service integration
      // For example: send to Supabase, external logging service, etc.
      console.log('AUDIT_SERVICE:', JSON.stringify(entry))
    } catch (error) {
      // Fallback logging - don't let audit logging break the application
      console.error('Failed to send audit log:', error)
    }
  }

  // Public logging methods
  debug(message: string, context?: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
      ...metadata,
    })
  }

  info(message: string, context?: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
      ...metadata,
    })
  }

  warn(message: string, context?: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
      ...metadata,
    })
  }

  error(message: string, context?: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      context,
      ...metadata,
    })
  }

  // Special audit logging for security events
  audit(message: string, context?: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.AUDIT,
      message,
      context,
      ...metadata,
    })
  }

  // Security event logging
  security(event: string, details: Record<string, any>, metadata?: Partial<LogEntry>): void {
    this.audit(`SECURITY_EVENT: ${event}`, details, metadata)
  }

  // Data access logging for GDPR compliance
  dataAccess(action: string, resourceType: string, resourceId: string, metadata?: Partial<LogEntry>): void {
    this.audit(`DATA_ACCESS: ${action}`, {
      action,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
    }, metadata)
  }

  // Performance logging
  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`PERFORMANCE: ${operation}`, {
      operation,
      duration_ms: duration,
      ...context,
    })
  }

  // API request logging
  apiRequest(method: string, path: string, statusCode: number, duration: number, metadata?: Partial<LogEntry>): void {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    this.writeLog({
      timestamp: new Date().toISOString(),
      level,
      message: `API_REQUEST: ${method} ${path} - ${statusCode}`,
      context: {
        method,
        path,
        statusCode,
        duration_ms: duration,
      },
      ...metadata,
    })
  }
}

// Create singleton instance
export const logger = new SecureLogger()

// Convenience functions for common logging patterns
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  audit: logger.audit.bind(logger),
  security: logger.security.bind(logger),
  dataAccess: logger.dataAccess.bind(logger),
  performance: logger.performance.bind(logger),
  apiRequest: logger.apiRequest.bind(logger),
}

// Replace console.log in production
if (process.env.NODE_ENV === 'production') {
  // Override console methods to use secure logger
  const originalConsole = { ...console }
  
  console.log = (...args) => {
    logger.info(args.join(' '))
  }
  
  console.warn = (...args) => {
    logger.warn(args.join(' '))
  }
  
  console.error = (...args) => {
    logger.error(args.join(' '))
  }
  
  // Provide access to original console for debugging if needed
  ;(global as any).__originalConsole = originalConsole
}

// Utility to create request-scoped logger
export function createRequestLogger(requestId: string, userId?: string, ip?: string, userAgent?: string) {
  const metadata = { requestId, userId, ip, userAgent }
  
  return {
    debug: (message: string, context?: Record<string, any>) => 
      logger.debug(message, context, metadata),
    info: (message: string, context?: Record<string, any>) => 
      logger.info(message, context, metadata),
    warn: (message: string, context?: Record<string, any>) => 
      logger.warn(message, context, metadata),
    error: (message: string, context?: Record<string, any>) => 
      logger.error(message, context, metadata),
    audit: (message: string, context?: Record<string, any>) => 
      logger.audit(message, context, metadata),
    security: (event: string, details: Record<string, any>) => 
      logger.security(event, details, metadata),
    dataAccess: (action: string, resourceType: string, resourceId: string) => 
      logger.dataAccess(action, resourceType, resourceId, metadata),
  }
}