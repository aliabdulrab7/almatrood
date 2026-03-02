# GitHub Pages Deployment Guide
## سليمان المطرود للاستشارات القانونية — Sulaiman Al Matrood Legal Consultations

> Complete setup: GitHub Pages + Custom Domain + SEO

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create GitHub Account](#2-create-github-account)
3. [Create the Repository](#3-create-the-repository)
4. [Upload Your Files](#4-upload-your-files)
5. [Enable GitHub Pages](#5-enable-github-pages)
6. [Connect Your Custom Domain](#6-connect-your-custom-domain)
7. [Force HTTPS](#7-force-https)
8. [Verify Everything Works](#8-verify-everything-works)
9. [SEO Setup](#9-seo-setup)
10. [Google Search Console](#10-google-search-console)
11. [How to Update the Website](#11-how-to-update-the-website)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Before you start, make sure you have:

- [ ] All 8 website files ready in one folder:
  ```
  index.html
  services.html
  why-us.html
  process.html
  consultant.html
  contact.html
  global-enhancements.css
  global-enhancements.js
  ```
- [ ] Your custom domain name (e.g. `almatroodlaw.sa` or `almatrood.com`)
- [ ] Access to your domain's DNS settings (via your domain registrar)
- [ ] A modern browser (Chrome or Firefox recommended)

---

## 2. Create GitHub Account

> Skip this step if you already have a GitHub account.

1. Go to **[github.com](https://github.com)**
2. Click **Sign up**
3. Enter your email, create a password, and choose a username
   - Recommended username: `almatroodlaw` or your firm name
4. Complete email verification
5. Choose the **Free** plan

---

## 3. Create the Repository

A "repository" (repo) is a folder on GitHub that holds your website files.

1. After logging in, click the **`+`** icon in the top-right corner
2. Select **New repository**
3. Fill in the form:

   | Field | Value |
   |-------|-------|
   | **Repository name** | `almatroodlaw` *(or any name you want)* |
   | **Description** | `Al Matrood Law Firm Website` |
   | **Visibility** | ✅ **Public** *(required for free GitHub Pages)* |
   | **Initialize with README** | ✅ Check this |

4. Click **Create repository**

> **Why Public?** GitHub Pages is free only for public repositories. Your HTML/CSS code being visible is not a security issue — it's just the front-end design.

---

## 4. Upload Your Files

### Method A — Drag & Drop (Easiest, no setup required)

1. Open your new repository on GitHub
2. Click **Add file** → **Upload files**
3. Drag and drop **all 8 files** at once into the upload area:
   ```
   index.html
   services.html
   why-us.html
   process.html
   consultant.html
   contact.html
   global-enhancements.css
   global-enhancements.js
   ```
4. Scroll down to **Commit changes**
5. In the commit message box, type: `Initial website upload`
6. Click **Commit changes**

GitHub will now show all your files in the repository.

### Method B — GitHub Desktop App (Recommended for future updates)

1. Download **[GitHub Desktop](https://desktop.github.com)**
2. Sign in with your GitHub account
3. Click **Clone a Repository** → find your repo → choose a local folder
4. Copy your 8 website files into that local folder
5. In GitHub Desktop, you'll see the files listed under "Changes"
6. Add a summary: `Initial website upload`
7. Click **Commit to main**
8. Click **Push origin**

---

## 5. Enable GitHub Pages

1. In your repository, click the **Settings** tab (top menu)
2. In the left sidebar, scroll down and click **Pages**
3. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

GitHub will show a message:
```
Your site is live at https://YOUR-USERNAME.github.io/REPO-NAME/
```

5. Wait **2–5 minutes**, then open that URL in your browser

✅ Your website is now live on the internet.

---

## 6. Connect Your Custom Domain

This makes your site accessible at `www.almatroodlaw.sa` instead of the long GitHub URL.

### Step A — Add CNAME file to GitHub

1. In your repository, click **Add file** → **Create new file**
2. Name the file exactly: `CNAME` *(no extension, all caps)*
3. In the file content, type your domain — exactly one line, no spaces:
   ```
   www.almatroodlaw.sa
   ```
   *(Replace with your actual domain)*
4. Click **Commit new file**

### Step B — Update DNS at Your Domain Registrar

Log in to wherever you bought your domain and add these DNS records:

#### Option 1 — Using `www` subdomain (recommended)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `www` | `YOUR-USERNAME.github.io` | 3600 |

Then add a redirect from the root domain (`almatroodlaw.sa`) to `www`:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `185.199.108.153` | 3600 |
| `A` | `@` | `185.199.109.153` | 3600 |
| `A` | `@` | `185.199.110.153` | 3600 |
| `A` | `@` | `185.199.111.153` | 3600 |

#### Option 2 — Using root domain only (`almatroodlaw.sa`)

If you want the root domain (without www), use all 4 `A` records above and put your bare domain in the CNAME file:
```
almatroodlaw.sa
```

> **DNS propagation** takes between 10 minutes and 48 hours. Be patient.

### Step C — Configure in GitHub Pages Settings

1. Go back to **Settings** → **Pages**
2. Under **Custom domain**, type your domain:
   ```
   www.almatroodlaw.sa
   ```
3. Click **Save**
4. GitHub will run a DNS check. Once it passes, you'll see a green checkmark ✅

---

## 7. Force HTTPS

After your custom domain is verified:

1. Go to **Settings** → **Pages**
2. Check the box: **Enforce HTTPS**

This ensures all visitors get the secure `https://` version automatically.
GitHub provides a **free SSL certificate** (via Let's Encrypt) — no cost.

---

## 8. Verify Everything Works

Test these URLs in your browser:

- [ ] `https://www.almatroodlaw.sa` → loads home page
- [ ] `https://www.almatroodlaw.sa/services.html` → loads services page
- [ ] `https://www.almatroodlaw.sa/contact.html` → loads contact page
- [ ] Page loads over **HTTPS** (padlock icon in browser address bar)
- [ ] Arabic text displays correctly
- [ ] English language toggle works
- [ ] Mobile view works (test on your phone)
- [ ] Floating WhatsApp/phone buttons appear
- [ ] Footer is not hidden behind sticky bar on mobile

---

## 9. SEO Setup

### A — Google Site Verification

1. Go to **[Google Search Console](https://search.google.com/search-console)**
2. Click **Add property** → enter your domain
3. Choose **HTML tag** verification method
4. Copy the meta tag, it looks like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXX">
   ```
5. Open each `.html` file in your code editor
6. Paste the tag inside `<head>` on every page
7. Commit and push the changes (wait 2 min)
8. Click **Verify** in Search Console

### B — Create a Sitemap

Create a new file called `sitemap.xml` with this content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>https://www.almatroodlaw.sa/</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="https://www.almatroodlaw.sa/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.almatroodlaw.sa/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://www.almatroodlaw.sa/services.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.almatroodlaw.sa/why-us.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.almatroodlaw.sa/process.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://www.almatroodlaw.sa/consultant.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.almatroodlaw.sa/contact.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>
```

Upload `sitemap.xml` to your repository root.

### C — Create robots.txt

Create a file called `robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.almatroodlaw.sa/sitemap.xml
```

Upload it to your repository root.

### D — Submit Sitemap to Google

1. In Google Search Console, click **Sitemaps** in the left menu
2. Enter: `sitemap.xml`
3. Click **Submit**

---

## 10. Google Search Console

After verification, use Search Console to:

| Feature | How to Access |
|---------|---------------|
| See how Google views your site | **URL Inspection** tool |
| Check for crawl errors | **Coverage** report |
| Monitor search keywords | **Performance** report |
| Request indexing for new pages | **URL Inspection** → Request Indexing |
| Check mobile usability | **Mobile Usability** report |

### Request Initial Indexing

1. Go to **URL Inspection**
2. Enter `https://www.almatroodlaw.sa/`
3. Click **Request Indexing**
4. Repeat for each page: `services.html`, `contact.html`, etc.

Google typically indexes a new site within **1–2 weeks**.

---

## 11. How to Update the Website

### Small changes (text, colors)

1. Edit the file locally on your computer
2. Go to your GitHub repository
3. Click on the file you want to update
4. Click the **pencil icon** (Edit)
5. Make your changes
6. Click **Commit changes**

Changes go live within **1–2 minutes**.

### Multiple file changes (recommended workflow)

**Using GitHub Desktop:**
1. Make changes to your local files
2. Open GitHub Desktop — it shows all changed files
3. Write a commit message (e.g. `Update contact phone number`)
4. Click **Commit to main**
5. Click **Push origin**

Done. Your live site updates automatically.

### Adding images

1. Create an `images/` folder in your repository
2. Upload image files there
3. Reference them in HTML:
   ```html
   <img src="images/logo.png" alt="Al Matrood Law Firm">
   ```

> **Image tip:** Compress images before uploading at [squoosh.app](https://squoosh.app) — smaller files = faster load times = better SEO.

---

## 12. Troubleshooting

### Site shows 404 error
- Make sure the file is named exactly `index.html` (lowercase)
- Check GitHub Pages is enabled: **Settings** → **Pages**
- Wait 5 more minutes and refresh

### Custom domain not working
- DNS changes can take up to **48 hours**
- Double-check the CNAME file has no spaces or extra lines
- Use [dnschecker.org](https://dnschecker.org) to verify your DNS records have propagated

### HTTPS padlock missing
- Wait for GitHub to issue your SSL certificate (up to 24h after adding custom domain)
- Make sure **Enforce HTTPS** is checked in Settings → Pages

### Arabic text displays incorrectly
- Verify `<meta charset="UTF-8">` is the first tag inside `<head>` on every page
- Make sure files were saved as UTF-8 encoding in your code editor

### Floating buttons not appearing
- Make sure `global-enhancements.js` was uploaded to the repository
- Open browser DevTools (F12) → Console tab — check for errors
- Confirm the `<script src="global-enhancements.js">` tag is at the bottom of each HTML file

### Changes not showing after update
- GitHub Pages caches files — do a hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Changes sometimes take up to **10 minutes** to propagate

---

## Quick Reference

| Task | Location |
|------|----------|
| Edit files | GitHub → click file → pencil icon |
| Upload new files | GitHub → Add file → Upload files |
| Check live URL | Settings → Pages |
| DNS records | Your domain registrar's control panel |
| Google indexing | search.google.com/search-console |
| Compress images | squoosh.app |
| Check DNS propagation | dnschecker.org |
| Test mobile view | Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M) |

---

## File Structure After Full Setup

```
your-repo/
├── index.html
├── services.html
├── why-us.html
├── process.html
├── consultant.html
├── contact.html
├── global-enhancements.css
├── global-enhancements.js
├── CNAME
├── sitemap.xml
├── robots.txt
└── images/          ← add this folder when you have images
    └── ...
```

---

*Guide prepared for سليمان المطرود للاستشارات القانونية — Sulaiman Al Matrood Legal Consultations*
