# Daily Research Function Setup Guide

This guide will help you set up the automated daily research function that generates MDX articles about UAE accounting, payroll, and compliance trends.

## 🚀 Quick Start

1. **Deploy the function:**
   ```bash
   ./scripts/deploy-research-function.sh
   ```

2. **Set environment variables** in your Supabase dashboard:
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `RESEARCH_EMAIL_RECIPIENT` (optional)

3. **Test the function:**
   ```bash
   ./scripts/test-research-function.sh
   ```

4. **Monitor logs:**
   ```bash
   supabase functions logs daily-research --follow
   ```

## 📋 Prerequisites

### Required Accounts
- **Supabase Account**: [supabase.com](https://supabase.com)
- **OpenAI Account**: [openai.com](https://openai.com) (for API access)
- **Resend Account**: [resend.com](https://resend.com) (for email delivery)

### Required Tools
- **Supabase CLI**: `npm install -g supabase`
- **Node.js**: Version 16 or higher

## 🔧 Detailed Setup

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Find your project ID in the Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`

### Step 4: Deploy the Function

```bash
./scripts/deploy-research-function.sh
```

### Step 5: Configure Environment Variables

In your Supabase dashboard, go to **Settings > Edge Functions** and add these environment variables:

#### Required Variables
```bash
OPENAI_API_KEY=sk-your-openai-api-key
RESEND_API_KEY=re-your-resend-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Optional Variables
```bash
RESEARCH_EMAIL_RECIPIENT=your-email@example.com
```

### Step 6: Test the Function

```bash
./scripts/test-research-function.sh
```

## 📧 Email Configuration

### Resend Setup

1. **Create a Resend account** at [resend.com](https://resend.com)
2. **Get your API key** from the dashboard
3. **Verify your domain** (optional but recommended)
4. **Set the sender email** in the function code:

```typescript
from: 'Advontier Research <research@yourdomain.com>'
```

### Email Format

The function sends emails with:
- **HTML preview** of the MDX content
- **MDX file attachment** for download
- **Storage link** to view the file in Supabase
- **Professional styling** with your branding

## 🗄️ Storage Configuration

The function automatically creates a `research-articles` storage bucket. You can also create it manually:

```bash
supabase storage create research-articles
```

### Storage Permissions

The bucket is set to private by default. To make files publicly accessible:

```bash
supabase storage update research-articles --public
```

## ⏰ Scheduling

The function runs daily at 09:00 UTC. To change the schedule, edit `supabase/config.toml`:

```toml
[functions.daily-research]
schedule = "0 9 * * *"  # Daily at 09:00 UTC
```

### Common Schedules

| Schedule | Description |
|----------|-------------|
| `"0 9 * * *"` | Daily at 09:00 UTC |
| `"0 9 * * 1-5"` | Weekdays only at 09:00 UTC |
| `"0 */6 * * *"` | Every 6 hours |
| `"0 9 1 * *"` | First day of each month |
| `"0 9,18 * * *"` | Twice daily at 09:00 and 18:00 UTC |

## 🔍 Monitoring & Debugging

### View Function Logs

```bash
# Real-time logs
supabase functions logs daily-research --follow

# Recent logs
supabase functions logs daily-research

# Logs for specific time range
supabase functions logs daily-research --since 1h
```

### Test Function Manually

```bash
# Test without JWT verification
supabase functions invoke daily-research --no-verify-jwt

# Test with specific payload
supabase functions invoke daily-research --no-verify-jwt --body '{"test": true}'
```

### Check Function Status

```bash
# List all functions
supabase functions list

# Get function details
supabase functions describe daily-research
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Function Deployment Fails

**Symptoms:** `supabase functions deploy` fails

**Solutions:**
- Check Supabase CLI is installed: `supabase --version`
- Verify you're logged in: `supabase status`
- Ensure project is linked: `supabase link --project-ref YOUR_ID`

#### 2. Environment Variables Missing

**Symptoms:** Function returns 400 error with "Missing required environment variable"

**Solutions:**
- Check all variables are set in Supabase dashboard
- Verify variable names are correct (case-sensitive)
- Redeploy function after setting variables

#### 3. Email Not Received

**Symptoms:** Function succeeds but no email arrives

**Solutions:**
- Check spam folder
- Verify Resend API key is valid
- Check email recipient is correct
- Test Resend API directly

#### 4. OpenAI API Errors

**Symptoms:** Function fails with OpenAI error

**Solutions:**
- Verify OpenAI API key is valid
- Check API credits/usage limits
- Ensure API key has GPT-4o access

#### 5. Storage Upload Fails

**Symptoms:** Function succeeds but file not saved to storage

**Solutions:**
- Check service role key has storage permissions
- Verify storage bucket exists
- Check storage quotas

### Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check environment variables |
| 401 | Unauthorized | Verify API keys |
| 403 | Forbidden | Check permissions |
| 500 | Internal Error | Check function logs |
| 503 | Service Unavailable | Retry later |

## 💰 Cost Considerations

### Estimated Monthly Costs

| Service | Free Tier | Cost Per Article | Monthly Cost (30 articles) |
|---------|-----------|------------------|----------------------------|
| OpenAI | $5 credit | ~$0.02-0.05 | $0.60-1.50 |
| Resend | 3,000 emails | $0.0001 per email | $0.003 |
| Supabase Storage | 1GB | $0.021 per GB | $0.63 |
| Edge Functions | 500K invocations | $0.000002 per invocation | $0.00006 |

**Total estimated cost: ~$1.25-2.15/month**

### Cost Optimization

- **Reduce frequency**: Change schedule to weekly instead of daily
- **Use GPT-3.5**: Switch to `gpt-3.5-turbo` for lower costs
- **Batch processing**: Generate multiple articles at once
- **Storage cleanup**: Delete old articles periodically

## 🔒 Security Best Practices

### API Key Management

- ✅ Store keys as environment variables
- ✅ Use service role key only for storage operations
- ✅ Rotate keys regularly
- ❌ Never commit keys to version control

### Function Security

- ✅ CORS headers properly configured
- ✅ Input validation implemented
- ✅ Error messages don't expose sensitive data
- ✅ Rate limiting via Supabase

### Data Privacy

- ✅ No sensitive data logged
- ✅ Storage bucket is private by default
- ✅ Email content is encrypted in transit
- ✅ Function runs in isolated environment

## 📈 Scaling Considerations

### Performance

- **Function timeout**: 60 seconds (configurable)
- **Memory limit**: 150MB (configurable)
- **Concurrent executions**: Limited by Supabase plan

### Reliability

- **Automatic retries**: Supabase handles function failures
- **Dead letter queue**: Failed executions are logged
- **Monitoring**: Real-time logs and metrics

### Backup Strategy

- **Storage backup**: Articles saved to Supabase Storage
- **Email backup**: Articles sent via email
- **Manual backup**: Download articles periodically

## 🎯 Customization

### Modify Research Prompt

Edit the `researchPrompt` in `supabase/functions/daily-research/index.ts`:

```typescript
const researchPrompt = `
Your custom research prompt here...
Focus on specific topics, industries, or regions.
`
```

### Custom Email Template

Modify the email HTML in the function:

```typescript
html: `
  <div style="your-custom-styles">
    ${htmlPreview}
  </div>
`
```

### Add Multiple Recipients

```typescript
to: ['email1@example.com', 'email2@example.com'],
```

### Custom Storage Path

```typescript
const fileName = `custom-path/${dateString}-article.mdx`
```

## 📞 Support

### Getting Help

1. **Check logs first**: `supabase functions logs daily-research`
2. **Test manually**: `./scripts/test-research-function.sh`
3. **Verify setup**: Follow this guide step by step
4. **Check Supabase docs**: [supabase.com/docs](https://supabase.com/docs)

### Useful Commands

```bash
# Check Supabase status
supabase status

# List all functions
supabase functions list

# Get function URL
supabase functions list | grep daily-research

# View real-time logs
supabase functions logs daily-research --follow

# Test function
supabase functions invoke daily-research --no-verify-jwt
```

### Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Resend API Docs](https://resend.com/docs)
- [Cron Expression Generator](https://crontab.guru/)

---

**🎉 Congratulations!** Your daily research function is now set up and ready to generate valuable insights for your business. 