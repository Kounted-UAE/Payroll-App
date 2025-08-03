import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@4.7.0'
import OpenAI from 'https://esm.sh/openai@5.11.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ResearchArticle {
  date: string
  title: string
  description: string
  author: {
    name: string
    role: string
    image: { src: string }
  }
}

interface ArticleMetadata {
  title: string
  description: string
}

// Helper function to convert MDX to basic HTML for email preview
function mdxToHtmlPreview(mdxContent: string): string {
  return mdxContent
    .replace(/^import.*$/gm, '') // Remove import statements
    .replace(/^export.*$/gm, '') // Remove export statements
    .replace(/^## (.*$)/gm, '<h2>$1</h2>') // Convert headers
    .replace(/^\* (.*$)/gm, '<li>$1</li>') // Convert list items
    .replace(/<TopTip>/g, '<div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1rem; margin: 1rem 0; border-radius: 0.375rem;">')
    .replace(/<\/TopTip>/g, '</div>')
    .trim()
}

// Helper function to create storage bucket if it doesn't exist
async function ensureStorageBucket(supabase: any) {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) throw error
    
    const bucketExists = buckets?.some((bucket: any) => bucket.name === 'research-articles')
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('research-articles', {
        public: false,
        allowedMimeTypes: ['text/markdown', 'text/plain'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (createError) {
        console.error('Failed to create storage bucket:', createError)
        return false
      }
      
      console.log('Storage bucket "research-articles" created successfully')
    }
    
    return true
  } catch (error) {
    console.error('Error ensuring storage bucket:', error)
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting daily research function...')

    // Validate required environment variables
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY', 
      'OPENAI_API_KEY',
      'RESEND_API_KEY'
    ]
    
    for (const envVar of requiredEnvVars) {
      if (!Deno.env.get(envVar)) {
        throw new Error(`Missing required environment variable: ${envVar}`)
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    })

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

    // Get today's date
    const today = new Date()
    const dateString = today.toISOString().split('T')[0] // YYYY-MM-DD format

    // Research prompt for OpenAI
    const researchPrompt = `
Summarize today's most relevant news, regulatory updates, and trends in the UAE accounting, payroll, and compliance space. Focus on actionable insights for Advontier and similar digital accounting platforms. Write the result as a .mdx article post, using the following format (including the import, article, and metadata blocks at the top):

import imageOfTheDay from '@images/insight/${dateString}-image.jpg'

export const article = {
date: '${dateString}',
title: 'Daily Industry Insight – Payroll & Compliance',
description: 'Digest of news and compliance trends for UAE accounting firms.',
author: {
name: 'Advontier AI Analyst',
role: 'Research Agent',
image: { src: imageOfTheDay },
},
}

export const metadata = {
title: article.title,
description: article.description,
}

## Key Updates

* Summarize the most important regulatory, market, or tech news here.

## Actionable Insights

* Provide 2–4 insights or opportunities for Advontier/Kounted or similar SaaS players.

<TopTip>
  End each article with a "pro tip" or resource link for business operators.
</TopTip>

Make sure the content is current, relevant to UAE accounting/payroll industry, and provides actionable business insights. Keep it professional but engaging. Focus on recent developments that would impact accounting firms, payroll providers, or compliance requirements in the UAE.
`

    console.log('Calling OpenAI API...')

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert research analyst specializing in UAE accounting, payroll, and compliance. Generate accurate, current, and actionable insights. Always respond with valid MDX format including the import and export statements."
        },
        {
          role: "user",
          content: researchPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const mdxContent = completion.choices[0]?.message?.content

    if (!mdxContent) {
      throw new Error('No content received from OpenAI')
    }

    console.log('MDX content generated successfully')

    // Ensure storage bucket exists
    const bucketReady = await ensureStorageBucket(supabase)
    
    // Save to Supabase Storage (backup)
    let storageUrl = null
    if (bucketReady) {
      try {
        const fileName = `research-articles/${dateString}-daily-insight.mdx`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('research-articles')
          .upload(fileName, mdxContent, {
            contentType: 'text/markdown',
            upsert: true
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
        } else {
          console.log('Article saved to storage:', fileName)
          
          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from('research-articles')
            .getPublicUrl(fileName)
          storageUrl = urlData.publicUrl
        }
      } catch (storageError) {
        console.error('Storage error:', storageError)
      }
    }

    // Send email via Resend
    const emailRecipient = Deno.env.get('RESEARCH_EMAIL_RECIPIENT') || 'my@email.com'
    
    console.log('Sending email to:', emailRecipient)

    // Convert MDX to HTML preview for email
    const htmlPreview = mdxToHtmlPreview(mdxContent)

    const emailResult = await resend.emails.send({
      from: 'Advontier Research <research@advontier.com>',
      to: [emailRecipient],
      subject: `Daily Industry Insight - ${dateString}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Daily Industry Insight - ${dateString}
          </h1>
          
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">
            Your daily research article is ready! Here's a preview of today's insights:
          </p>
          
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${htmlPreview}
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📎 Attachments</h3>
            <p style="color: #1e40af; margin-bottom: 10px;">
              • <strong>MDX File:</strong> ${dateString}-daily-insight.mdx (attached)
            </p>
            ${storageUrl ? `<p style="color: #1e40af; margin-bottom: 0;">
              • <strong>Storage Link:</strong> <a href="${storageUrl}" style="color: #3b82f6;">View in Supabase Storage</a>
            </p>` : ''}
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Note:</strong> This content is automatically generated and saved to your Supabase Storage bucket for backup.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Generated by Advontier AI Research System
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${dateString}-daily-insight.mdx`,
          content: Buffer.from(mdxContent).toString('base64'),
        },
      ],
    })

    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily research completed successfully',
        date: dateString,
        emailSent: true,
        storageSaved: bucketReady,
        storageUrl: storageUrl,
        contentLength: mdxContent.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    // Log detailed error for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      function: 'daily-research'
    }
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2))
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        function: 'daily-research'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}) 