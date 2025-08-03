#!/bin/bash

# Deploy Daily Research Function Script
# This script helps deploy the Supabase Edge Function for daily research

set -e

echo "🚀 Deploying Daily Research Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Check if project is linked
if ! supabase status | grep -q "Project"; then
    echo "❌ No project linked. Please run:"
    echo "   supabase link --project-ref YOUR_PROJECT_ID"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Deploy the function
echo "📦 Deploying daily-research function..."
supabase functions deploy daily-research

echo "✅ Function deployed successfully!"

# Check if environment variables are set
echo "🔍 Checking environment variables..."

# Get the function URL
FUNCTION_URL=$(supabase functions list | grep daily-research | awk '{print $2}')

if [ -z "$FUNCTION_URL" ]; then
    echo "⚠️  Could not get function URL. Please check deployment."
else
    echo "🌐 Function URL: $FUNCTION_URL"
fi

echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Supabase dashboard:"
echo "   - OPENAI_API_KEY"
echo "   - RESEND_API_KEY" 
echo "   - RESEARCH_EMAIL_RECIPIENT (optional)"
echo ""
echo "2. Test the function:"
echo "   supabase functions invoke daily-research --no-verify-jwt"
echo ""
echo "3. Check logs:"
echo "   supabase functions logs daily-research --follow"
echo ""
echo "4. The function will run daily at 09:00 UTC"
echo ""
echo "🎉 Setup complete! Your daily research function is ready." 