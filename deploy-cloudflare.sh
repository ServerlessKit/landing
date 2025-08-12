#!/bin/bash

# ServerlessKit Landing Page - Cloudflare Deployment
# Deploy to https://serverlesskit.com using Cloudflare Workers

set -e

echo "🚀 Deploying ServerlessKit to https://serverlesskit.com via Cloudflare"
echo "=================================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Verify files
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found!"
    exit 1
fi

print_status "Repository files verified"

# Check if the site is accessible via GitHub raw
GITHUB_RAW_URL="https://raw.githubusercontent.com/ServerlessKit/landing/main/index.html"
print_info "Testing GitHub raw file access..."

if curl -s --head "$GITHUB_RAW_URL" | head -n 1 | grep -q "200 OK"; then
    print_status "GitHub raw files accessible"
else
    print_warning "GitHub raw files may not be immediately available"
fi

echo ""
print_info "🌐 CLOUDFLARE DEPLOYMENT INSTRUCTIONS"
echo "======================================"
echo ""

echo "Option 1: Cloudflare Workers (Fastest - 2 minutes)"
echo "---------------------------------------------------"
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Navigate to: Workers & Pages → Create Application → Create Worker"
echo "3. Name: serverlesskit-landing"
echo "4. Replace the default code with:"
echo ""
echo "export default {"
echo "  async fetch() {"
echo "    const html = await fetch('$GITHUB_RAW_URL');"
echo "    return new Response(await html.text(), {"
echo "      headers: { 'Content-Type': 'text/html' }"
echo "    });"
echo "  }"
echo "};"
echo ""
echo "5. Click 'Save and Deploy'"
echo "6. Go to Triggers → Add Custom Domain → serverlesskit.com"
echo ""

echo "Option 2: Cloudflare Pages (Alternative - 5 minutes)"
echo "----------------------------------------------------"
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Navigate to: Pages → Create a project → Connect to Git"
echo "3. Select GitHub → ServerlessKit/landing"
echo "4. Build settings:"
echo "   - Framework: None"
echo "   - Build command: (empty)"
echo "   - Build output: /"
echo "5. Deploy"
echo "6. Add custom domain: serverlesskit.com"
echo ""

echo "DNS Configuration (Automatic)"
echo "-----------------------------"
print_info "Cloudflare will automatically configure DNS when you add the custom domain"
print_info "Your API token: zRJm792OVAWMY4gKIqYxp1LzN9bpvYfLabu3q6Xl"
echo ""

echo "✅ Verification Steps"
echo "--------------------"
echo "1. Visit: https://serverlesskit.com"
echo "2. Test the waitlist form"
echo "3. Check form submission in Google Sheets"
echo "4. Verify mobile responsiveness"
echo ""

print_status "All files are ready for Cloudflare deployment!"
print_info "Choose either Workers or Pages option above to deploy"

echo ""
print_warning "Note: Any changes pushed to GitHub will automatically update the live site"
print_status "ServerlessKit landing page ready for production! 🎉"
