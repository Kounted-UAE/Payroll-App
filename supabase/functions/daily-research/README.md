# Daily Research Edge Function

This Supabase Edge Function automatically generates daily research articles about UAE accounting, payroll, and compliance trends using OpenAI's GPT-4o model and emails them to you.

## Features

- **Automated Research**: Runs daily at 09:00 UTC via cron schedule
- **OpenAI Integration**: Uses GPT-4o for intelligent content generation
- **Email Delivery**: Sends formatted emails with MDX attachments via Resend
- **Storage Backup**: Automatically saves articles to Supabase Storage
- **Error Handling**: Comprehensive logging and error reporting
- **HTML Preview**: Converts MDX to readable HTML for email preview

## Setup Instructions

### 1. Environment Variables

Set these environment variables in your Supabase project dashboard:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (defaults to 'my@email.com')
RESEARCH_EMAIL_RECIPIENT=your_email@example.com
```

### 2. Deploy the Function

```bash
# Deploy to Supabase
supabase functions deploy daily-research

# Or deploy all functions
supabase functions deploy
```

### 3. Test the Function

```bash
# Test manually (no JWT required)
supabase functions invoke daily-research --no-verify-jwt

# Check logs
supabase functions logs daily-research
```

### 4. Storage Setup

The function will automatically create a `research-articles` storage bucket if it doesn't exist. You can also create it manually:

```bash
# Create storage bucket manually (optional)
supabase storage create research-articles
```

## Configuration

### Cron Schedule

The function runs daily at 09:00 UTC. To change the schedule, edit `supabase/config.toml`:

```toml
[functions.daily-research]
schedule = "0 9 * * *"  # Cron format: minute hour day month weekday
```

Common schedules:
- `"0 9 * * *"` - Daily at 09:00 UTC
- `"0 9 * * 1-5"` - Weekdays only at 09:00 UTC
- `"0 */6 * * *"` - Every 6 hours
- `"0 9 1 * *"` - First day of each month at 09:00 UTC

### Email Customization

To customize the email sender, update the `from` field in the function:

```typescript
from: 'Your Company <research@yourdomain.com>'
```

## Output Format

The function generates MDX articles with this structure:

```mdx
import imageOfTheDay from '@images/insight/2025-01-15-image.jpg'

export const article = {
  date: '2025-01-15',
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

* Summary of important regulatory and market news

## Actionable Insights

* Business opportunities and insights

<TopTip>
  Pro tip or resource link for business operators
</TopTip>
```

## Troubleshooting

### Common Issues

1. **Function fails to deploy**
   - Check that all environment variables are set
   - Verify Supabase CLI is installed and logged in

2. **Email not received**
   - Check Resend API key is valid
   - Verify email recipient is correct
   - Check spam folder

3. **Storage upload fails**
   - Ensure service role key has storage permissions
   - Check storage bucket exists and is accessible

4. **OpenAI API errors**
   - Verify API key is valid and has credits
   - Check rate limits

### Debugging

View function logs:
```bash
supabase functions logs daily-research --follow
```

Test function manually:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/daily-research \
  -H "Authorization: Bearer your_anon_key"
```

### Error Codes

- `400`: Missing environment variables
- `500`: OpenAI API error or email sending failure
- `503`: Supabase service unavailable

## Security Notes

- All API keys are stored as environment variables
- Function uses service role key only for storage operations
- CORS headers are properly configured
- No sensitive data is logged

## Cost Considerations

- OpenAI API calls: ~$0.01-0.05 per article
- Resend emails: Free tier includes 3,000 emails/month
- Supabase Storage: Free tier includes 1GB
- Edge Function execution: Free tier includes 500,000 invocations/month

## Support

For issues or questions:
1. Check the logs: `supabase functions logs daily-research`
2. Test manually: `supabase functions invoke daily-research --no-verify-jwt`
3. Verify environment variables in Supabase dashboard 