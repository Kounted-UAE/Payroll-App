#!/bin/bash

# Test Daily Research Function Script
# This script tests the Supabase Edge Function for daily research

set -e

echo "🧪 Testing Daily Research Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Test the function
echo "🚀 Invoking daily-research function..."
echo "   This will generate a research article and send an email."
echo "   Press Ctrl+C to cancel if needed."
echo ""

# Wait for user confirmation
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Test cancelled"
    exit 1
fi

echo "📡 Invoking function..."
RESULT=$(supabase functions invoke daily-research --no-verify-jwt 2>&1)

# Check if the function executed successfully
if echo "$RESULT" | grep -q "success.*true"; then
    echo "✅ Function executed successfully!"
    echo ""
    echo "📧 Check your email for the research article"
    echo "📁 Check Supabase Storage for the backup file"
    echo ""
    echo "📊 Function response:"
    echo "$RESULT" | jq '.' 2>/dev/null || echo "$RESULT"
else
    echo "❌ Function execution failed!"
    echo ""
    echo "🔍 Error details:"
    echo "$RESULT"
    echo ""
    echo "💡 Troubleshooting tips:"
    echo "1. Check environment variables are set:"
    echo "   - OPENAI_API_KEY"
    echo "   - RESEND_API_KEY"
    echo "   - RESEARCH_EMAIL_RECIPIENT"
    echo ""
    echo "2. Check function logs:"
    echo "   supabase functions logs daily-research --follow"
    echo ""
    echo "3. Verify the function is deployed:"
    echo "   supabase functions list"
fi 