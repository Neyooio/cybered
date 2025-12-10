# Deployment Guide - CyberEd Connection Fixes

## Files Changed

### Frontend Changes
1. ✅ `frontend/src/js/config.js` - Clears old cached URLs automatically
2. ✅ `frontend/src/js/register-form.js` - Uses centralized config
3. ✅ `frontend/src/html/register-form.html` - Loads config.js properly
4. ✅ `frontend/src/html/cybered.html` - Loads config.js properly

### Backend Changes
5. ✅ `backend/src/server.js` - Added CORS support for all Render.com and GitHub Pages domains

### New Files
6. ✅ `emergency-fix.js` - Browser console script for immediate fix
7. ✅ `FIXES_APPLIED.md` - Documentation of all changes

---

## How to Deploy

### Option 1: Deploy to Netlify (Frontend)

1. **Commit and push changes to GitHub:**
   ```powershell
   git add .
   git commit -m "Fix API connection issues - clear cached URLs and update CORS"
   git push origin main
   ```

2. **Netlify will auto-deploy** (if you have auto-deploy enabled)
   - Or manually trigger a deploy from Netlify dashboard

### Option 2: Deploy to Render (Backend)

1. **Commit and push backend changes:**
   ```powershell
   git add backend/src/server.js
   git commit -m "Add CORS support for Render and GitHub Pages domains"
   git push origin main
   ```

2. **Render will auto-deploy** (if you have auto-deploy enabled)
   - Or manually trigger a deploy from Render dashboard

---

## Immediate Fix for Users (No Deploy Needed)

If you want to test the fix **right now** without deploying:

1. Visit your deployed registration page
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Copy and paste this one-liner:

```javascript
localStorage.clear(); sessionStorage.clear(); window.location.reload();
```

5. Press **Enter**

The page will reload with cleared cache and should now connect properly!

---

## After Deployment

### Test the fixes:

1. **Visit your deployed site** (Netlify URL)
2. **Open Developer Console** (F12)
3. **Check for these messages:**
   ```
   [Config] API_BASE_URL set to: https://cybered-backend.onrender.com
   [Config] Current hostname: [your-site].netlify.app
   [Config] Cleared old cached URLs from localStorage
   ```

4. **Try to login** - it should work now!

### If Backend is Sleeping (Render Free Tier):

1. Visit `https://cybered-backend.onrender.com/api/health`
2. Wait 30-60 seconds for it to wake up
3. You should see a JSON response with `"ok": true`
4. Then try logging in again

---

## What Changed

### Problem
- Cached wrong URL (`cybered-421g.onrender.com`)
- Wrong port number in production URLs (`:4000`)
- Missing CORS permissions for Render.com domains

### Solution
- Automatically clear old cached URLs on page load
- Use correct URL without port: `https://cybered-backend.onrender.com`
- Added CORS support for all Render/GitHub/Netlify domains
- Centralized API configuration in `config.js`

---

## Need Help?

If issues persist after deployment:

1. Check Render backend logs
2. Run the emergency-fix.js script in browser console
3. Clear browser cache completely (Ctrl+Shift+Delete)
4. Try in incognito/private browsing mode
