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

## 🚀 Phase 2: Domain Deployment

### Option A: GitHub Pages (Recommended for simplicity)

1. Go to your GitHub repository settings

2. Navigate to "Pages" section

3. Set source to "Deploy from a branch"

4. Choose branch: `main` and folder: `/ (root)`

5. Save settings

6. GitHub will provide a URL like: `https://serverlesskit.github.io/landing`

### Option B: Custom Hosting (Netlify/Vercel)

#### Netlify:
1. Connect your GitHub repository to Netlify
2. Set build command: (none needed for static site)
3. Set publish directory: `/`
4. Deploy

#### Vercel:
1. Import your GitHub repository to Vercel
2. Framework preset: "Other"
3. Build command: (leave empty)
4. Output directory: `./`
5. Deploy

## 🌐 Phase 3: DNS Configuration

### Using Cloudflare (Recommended)

1. Log in to your Cloudflare dashboard

2. Select your domain: `serverlesskit.com`

3. Go to "DNS" → "Records"

4. Add/Update DNS records:

   **For GitHub Pages:**
   ```
   Type: CNAME
   Name: @
   Content: serverlesskit.github.io
   Proxy status: Proxied (orange cloud)
   ```

   **For Netlify:**
   ```
   Type: CNAME
   Name: @
   Content: your-site-name.netlify.app
   Proxy status: Proxied (orange cloud)
   ```

   **For Vercel:**
   ```
   Type: CNAME
   Name: @
   Content: your-project.vercel.app
   Proxy status: Proxied (orange cloud)
   ```

5. Add www subdomain:
   ```
   Type: CNAME
   Name: www
   Content: serverlesskit.com
   Proxy status: Proxied (orange cloud)
   ```

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
