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
Generated on: Tue Aug 12 16:58:10 UTC 2025
