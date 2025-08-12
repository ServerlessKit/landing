# ServerlessKit Landing Page Deployment Guide

This guide covers the complete deployment process for the ServerlessKit landing page with Google Sheets integration and domain setup.

## 🎯 Overview

The landing page includes:
- ✅ Functional waitlist signup form
- ✅ Google Sheets integration for data collection
- ✅ Mobile-responsive design
- ✅ Form validation and user feedback
- ✅ Email confirmation system

## 📋 Prerequisites

- Google account for Sheets integration
- Cloudflare account for DNS management
- GitHub repository access
- Domain: serverlesskit.com

## 🔧 Phase 1: Google Sheets Setup

### Step 1: Prepare the Google Sheet

1. Open the Google Sheets document: https://docs.google.com/spreadsheets/d/1QVv649pyPqJFEujihbTffreUPW2sX6HEn7HjShWu8I0/edit?usp=sharing

2. Ensure you have edit access to the sheet

3. The script will automatically create a "Waitlist Signups" sheet with proper headers

### Step 2: Deploy Google Apps Script

1. Go to [script.google.com](https://script.google.com)

2. Click "New Project"

3. Replace the default code with the content from `google-apps-script.js`

4. Save the project (Ctrl+S) and name it "ServerlessKit Waitlist Handler"

5. Click "Deploy" → "New deployment"

6. Choose type: "Web app"

7. Set configuration:
   - Execute as: "Me"
   - Who has access: "Anyone"

8. Click "Deploy"

9. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/AKfycby.../exec`)

### Step 3: Update the Landing Page

1. Open `index.html`

2. Find the line with `GOOGLE_SHEETS_URL` (around line 552)

3. Replace the placeholder URL with your actual Google Apps Script Web App URL

4. Save the file

## 🚀 Phase 2: GitHub Pages Deployment

### Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/ServerlessKit/landing

2. Navigate to **Settings** → **Pages**

3. Set source to **"Deploy from a branch"**

4. Choose branch: **`main`** and folder: **`/ (root)`**

5. Click **Save**

6. GitHub will provide a URL like: `https://serverlesskit.github.io/landing`

7. Wait 2-3 minutes for the initial deployment to complete

## 🌐 Phase 3: Cloudflare DNS Configuration

### Configure DNS for GitHub Pages

1. Log in to your Cloudflare dashboard using API token: `zRJm792OVAWMY4gKIqYxp1LzN9bpvYfLabu3q6Xl`

2. Select your domain: `serverlesskit.com`

3. Go to **"DNS"** → **"Records"**

4. Add/Update DNS records for GitHub Pages:

   **Main domain:**
   ```
   Type: CNAME
   Name: @
   Content: serverlesskit.github.io
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

   **WWW subdomain:**
   ```
   Type: CNAME
   Name: www
   Content: serverlesskit.com
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

5. **Important**: Create a `CNAME` file in your repository root with your custom domain

### SSL Certificate

Cloudflare automatically provides SSL certificates when using proxied DNS records (orange cloud).

## 🔒 Security & Performance

### Cloudflare Settings

1. **SSL/TLS**: Set to "Full (strict)"

2. **Security Level**: Medium

3. **Browser Cache TTL**: 4 hours

4. **Always Use HTTPS**: On

5. **Auto Minify**: Enable HTML, CSS, JS

6. **Brotli Compression**: On

## 📊 Testing Checklist

### Form Functionality
- [ ] Form submits successfully
- [ ] Data appears in Google Sheets
- [ ] Email validation works
- [ ] Success message displays
- [ ] Error handling works
- [ ] Mobile responsiveness

### Domain & SSL
- [ ] https://serverlesskit.com loads correctly
- [ ] https://www.serverlesskit.com redirects properly
- [ ] SSL certificate is valid
- [ ] Page loads quickly (<3 seconds)

### Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 🚨 Troubleshooting

### Common Issues

**Form not submitting:**
- Check Google Apps Script URL in index.html
- Verify Apps Script deployment permissions
- Check browser console for errors

**DNS not resolving:**
- Wait 24-48 hours for DNS propagation
- Use DNS checker tools to verify records
- Ensure Cloudflare proxy is enabled

**SSL errors:**
- Verify Cloudflare SSL/TLS setting is "Full (strict)"
- Check that origin server supports HTTPS

## 📈 Analytics Setup (Optional)

### Google Analytics 4

Add this code before the closing `</head>` tag:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual Google Analytics measurement ID.

## 🎉 Go Live

Once all steps are completed:

1. Test the form submission end-to-end
2. Verify data appears in Google Sheets
3. Check email confirmations are sent
4. Test on multiple devices and browsers
5. Monitor for any errors in the first 24 hours

## 📞 Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Verify Google Apps Script logs
3. Test DNS resolution with online tools
4. Contact support with specific error messages

---

**Deployment completed!** 🚀 Your ServerlessKit landing page is now live with full waitlist functionality.
