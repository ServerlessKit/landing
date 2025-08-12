#!/bin/bash

# ServerlessKit Landing Page Deployment Script
# This script helps deploy the landing page to various hosting platforms

set -e

echo "🚀 ServerlessKit Landing Page Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required files exist
check_files() {
    print_info "Checking required files..."
    
    if [ ! -f "index.html" ]; then
        print_error "index.html not found!"
        exit 1
    fi
    
    if [ ! -f "google-apps-script.js" ]; then
        print_error "google-apps-script.js not found!"
        exit 1
    fi
    
    if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
        print_error "DEPLOYMENT_GUIDE.md not found!"
        exit 1
    fi
    
    print_status "All required files found"
}

# Validate HTML
validate_html() {
    print_info "Validating HTML structure..."

    # Check for basic HTML structure
    local html_valid=true

    if ! grep -q "<!DOCTYPE html>" index.html; then
        print_error "Missing DOCTYPE declaration"
        html_valid=false
    fi

    if ! grep -q "<html" index.html; then
        print_error "Missing <html> tag"
        html_valid=false
    fi

    if ! grep -q "</html>" index.html; then
        print_error "Missing </html> tag"
        html_valid=false
    fi

    if ! grep -q "<head>" index.html; then
        print_error "Missing <head> tag"
        html_valid=false
    fi

    if ! grep -q "</head>" index.html; then
        print_error "Missing </head> tag"
        html_valid=false
    fi

    if ! grep -q "<body" index.html; then
        print_error "Missing <body> tag"
        html_valid=false
    fi

    if ! grep -q "</body>" index.html; then
        print_error "Missing </body> tag"
        html_valid=false
    fi

    if [ "$html_valid" = true ]; then
        print_status "HTML structure is valid"
    else
        print_error "HTML structure validation failed"
        exit 1
    fi

    # Check for waitlist form
    if grep -q "id=\"waitlistForm\"" index.html; then
        print_status "Waitlist form found"
    else
        print_error "Waitlist form not found in HTML"
        exit 1
    fi
}

# Check Google Sheets integration
check_google_sheets() {
    print_info "Checking Google Sheets integration..."
    
    if grep -q "YOUR_SCRIPT_ID_HERE" index.html; then
        print_warning "Google Apps Script URL needs to be updated in index.html"
        print_info "Please follow the deployment guide to set up Google Sheets integration"
    else
        print_status "Google Sheets URL appears to be configured"
    fi
}

# Display deployment options
show_deployment_options() {
    echo ""
    print_info "Deployment Options:"
    echo ""
    echo "1. 🌐 Netlify (Recommended)"
    echo "   - Connect your GitHub repository to Netlify"
    echo "   - Automatic deployments on git push"
    echo "   - Free SSL certificate"
    echo "   - Custom domain support"
    echo ""
    echo "2. ⚡ Vercel"
    echo "   - Import GitHub repository to Vercel"
    echo "   - Serverless edge network"
    echo "   - Automatic HTTPS"
    echo ""
    echo "3. 🔥 Firebase Hosting"
    echo "   - Run: npm install -g firebase-tools"
    echo "   - Run: firebase init hosting"
    echo "   - Run: firebase deploy"
    echo ""
    echo "4. 📁 Static File Hosting"
    echo "   - Upload index.html to any web server"
    echo "   - Ensure HTTPS is enabled"
    echo ""
}

# Generate deployment checklist
generate_checklist() {
    print_info "Generating deployment checklist..."
    
    cat > deployment-checklist.md << EOF
# ServerlessKit Landing Page Deployment Checklist

## Pre-deployment
- [ ] All files are present (index.html, google-apps-script.js, DEPLOYMENT_GUIDE.md)
- [ ] HTML structure is valid
- [ ] Google Apps Script is deployed and URL is updated in index.html
- [ ] Form fields are properly configured
- [ ] Meta tags are set for SEO

## Google Sheets Setup
- [ ] Google Sheet is accessible: https://docs.google.com/spreadsheets/d/1QVv649pyPqJFEujihbTffreUPW2sX6HEn7HjShWu8I0/edit
- [ ] Google Apps Script is deployed as web app
- [ ] Script permissions are set to "Anyone"
- [ ] Web app URL is updated in index.html (line ~566)

## Hosting Platform
- [ ] Choose hosting platform (Netlify/Vercel/Firebase/Other)
- [ ] Repository is connected to hosting platform
- [ ] Build settings are configured (if needed)
- [ ] Custom domain is configured: serverlesskit.com

## DNS Configuration (Cloudflare)
- [ ] DNS records point to hosting platform
- [ ] SSL/TLS is set to "Full (strict)"
- [ ] Always Use HTTPS is enabled
- [ ] WWW subdomain redirects properly

## Testing
- [ ] Site loads at https://serverlesskit.com
- [ ] Form submission works
- [ ] Data appears in Google Sheets
- [ ] Email confirmations are sent
- [ ] Mobile responsiveness works
- [ ] All links work properly

## Post-deployment
- [ ] Test form on multiple browsers
- [ ] Monitor Google Sheets for submissions
- [ ] Check email delivery
- [ ] Set up analytics (optional)
- [ ] Monitor site performance

## Troubleshooting
If issues occur:
1. Check browser console for JavaScript errors
2. Verify Google Apps Script logs
3. Test DNS resolution
4. Check SSL certificate status
5. Review hosting platform logs

---
Generated on: $(date)
EOF

    print_status "Deployment checklist created: deployment-checklist.md"
}

# Main execution
main() {
    check_files
    validate_html
    check_google_sheets
    generate_checklist
    show_deployment_options
    
    echo ""
    print_status "Pre-deployment checks completed!"
    print_info "Next steps:"
    echo "1. Follow the DEPLOYMENT_GUIDE.md for detailed instructions"
    echo "2. Set up Google Apps Script using google-apps-script.js"
    echo "3. Choose a hosting platform and deploy"
    echo "4. Configure DNS with Cloudflare"
    echo "5. Test the complete flow"
    echo ""
    print_status "Ready for deployment! 🚀"
}

# Run main function
main
