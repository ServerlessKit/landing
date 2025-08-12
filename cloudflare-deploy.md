# ServerlessKit - Cloudflare Direct Deployment

Since GitHub Pages isn't available for this repository, we'll use Cloudflare Workers to serve the static site directly from GitHub.

## 🚀 Quick Deployment to serverlesskit.com

### Option 1: Cloudflare Workers (Recommended)

1. **Create Cloudflare Worker**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Click "Create Application" → "Create Worker"
   - Name: `serverlesskit-landing`

2. **Worker Script**
   ```javascript
   export default {
     async fetch(request, env, ctx) {
       const url = new URL(request.url);
       
       // Serve index.html for all requests
       const githubUrl = 'https://raw.githubusercontent.com/ServerlessKit/landing/main/index.html';
       
       try {
         const response = await fetch(githubUrl);
         const html = await response.text();
         
         return new Response(html, {
           headers: {
             'Content-Type': 'text/html;charset=UTF-8',
             'Cache-Control': 'public, max-age=300',
             'X-Frame-Options': 'DENY',
             'X-Content-Type-Options': 'nosniff',
             'X-XSS-Protection': '1; mode=block',
           },
         });
       } catch (error) {
         return new Response('Site temporarily unavailable', { status: 503 });
       }
     },
   };
   ```

3. **Deploy Worker**
   - Click "Save and Deploy"
   - Note the worker URL (e.g., `serverlesskit-landing.your-subdomain.workers.dev`)

4. **Add Custom Domain**
   - Go to Worker settings → Triggers
   - Click "Add Custom Domain"
   - Enter: `serverlesskit.com`
   - Cloudflare will automatically configure DNS

### Option 2: Cloudflare Pages (Alternative)

1. **Connect Repository**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select GitHub and authorize
   - Choose `ServerlessKit/landing` repository

2. **Build Settings**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

3. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete

4. **Custom Domain**
   - Go to Pages project → Custom domains
   - Add `serverlesskit.com`

## 🌐 DNS Configuration

### Cloudflare DNS Records

1. **For Workers:**
   ```
   Type: CNAME
   Name: @
   Content: serverlesskit-landing.your-subdomain.workers.dev
   Proxy: Proxied (orange cloud)
   ```

2. **For Pages:**
   ```
   Type: CNAME
   Name: @
   Content: your-pages-url.pages.dev
   Proxy: Proxied (orange cloud)
   ```

3. **WWW Redirect:**
   ```
   Type: CNAME
   Name: www
   Content: serverlesskit.com
   Proxy: Proxied (orange cloud)
   ```

## ⚡ Instant Deployment (Workers)

For immediate deployment, use this one-liner Worker script:

```javascript
export default {
  async fetch() {
    const html = await fetch('https://raw.githubusercontent.com/ServerlessKit/landing/main/index.html');
    return new Response(await html.text(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
```

## ✅ Verification

After deployment:
1. Visit https://serverlesskit.com
2. Test the waitlist form
3. Verify Google Sheets integration
4. Check mobile responsiveness

## 🔧 Updates

Any changes pushed to the GitHub repository will be automatically reflected on the live site within 5 minutes (due to GitHub's CDN caching).

---

**Result: serverlesskit.com will be live with full functionality!** 🚀
