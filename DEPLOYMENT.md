# 🚀 Deployment Guide

## Quick Deploy to GitHub Pages

### Option 1: Using GitHub Web Interface (Easiest)

1. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it: `georgeair.github.io` (or `portfolio`)
   - Make it public
   - Don't initialize with README (we already have one)

2. **Upload files**:
   - Click "uploading an existing file"
   - Drag and drop all files from your portfolio folder
   - Commit changes

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

4. **Done!** Your site will be live at:
   - `https://georgeair.github.io/` (if repo name is georgeair.github.io)
   - `https://georgeair.github.io/portfolio/` (if repo name is portfolio)

### Option 2: Using Git Command Line

```bash
# Navigate to your portfolio folder
cd "/Users/georgeair/Library/CloudStorage/OneDrive-GrafischLyceumRotterdam/leerjaar 2/portfolio 1/portfolio"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready portfolio"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/GeorgeP010/georgeair.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Alternative Deployment Options

### Netlify (Recommended for beginners)

1. Go to https://app.netlify.com/drop
2. Drag your portfolio folder
3. Done! You get a free URL like `your-site.netlify.app`
4. Optional: Add custom domain

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in your portfolio folder
3. Follow prompts
4. Done!

### Cloudflare Pages

1. Go to https://pages.cloudflare.com/
2. Connect your GitHub repository
3. Deploy automatically on every push

## Before Deploying - Checklist

- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Check all images load correctly
- [ ] Verify all links work
- [ ] Test dark mode toggle
- [ ] Check physics animation works (or fallback shows)
- [ ] Verify contact form/email links work
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check console for errors
- [ ] Verify meta tags are correct
- [ ] Test accessibility with screen reader

## Post-Deployment

### Update URLs

After deploying, update these in your files:

**index.html** (lines 17-24):
```html
<meta property="og:url" content="https://YOUR-ACTUAL-URL.com/">
<meta property="og:image" content="https://YOUR-ACTUAL-URL.com/foto.jpg">
<meta property="twitter:url" content="https://YOUR-ACTUAL-URL.com/">
<meta property="twitter:image" content="https://YOUR-ACTUAL-URL.com/foto.jpg">
```

**index.html** (line 29):
```html
<link rel="canonical" href="https://YOUR-ACTUAL-URL.com/">
```

### Add Analytics (Optional but Recommended)

1. **Google Analytics 4**:
   - Create account at https://analytics.google.com/
   - Get tracking ID
   - Add before `</head>` in index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

2. **Hotjar** (for heatmaps):
   - Sign up at https://www.hotjar.com/
   - Add tracking code

### Performance Optimization

After deployment, run these checks:

1. **Google PageSpeed Insights**:
   - https://pagespeed.web.dev/
   - Aim for 90+ on all metrics

2. **GTmetrix**:
   - https://gtmetrix.com/
   - Check loading times

3. **WebPageTest**:
   - https://www.webpagetest.org/
   - Test from different locations

### SEO

1. **Submit to Google Search Console**:
   - https://search.google.com/search-console
   - Verify ownership
   - Submit sitemap (create one at https://www.xml-sitemaps.com/)

2. **Submit to Bing Webmaster Tools**:
   - https://www.bing.com/webmasters

## Troubleshooting

### Images not loading
- Check file paths are relative (not absolute)
- Ensure image files are in the same directory
- Check file extensions match (case-sensitive on servers)

### Physics animation not working
- Check browser console for errors
- Verify Matter.js CDN is accessible
- Fallback should show static tags if physics fails

### Dark mode not persisting
- Check localStorage is enabled in browser
- Verify JavaScript is running

### Mobile layout broken
- Test responsive breakpoints
- Check viewport meta tag is present
- Verify CSS media queries

## Need Help?

- GitHub Pages Docs: https://docs.github.com/en/pages
- Netlify Docs: https://docs.netlify.com/
- Contact: gpelealuw@gmail.com

---

**Good luck with your deployment! 🚀**
