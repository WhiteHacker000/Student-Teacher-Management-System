# Vercel Deployment Fix - Complete Guide

## ✅ Problem Solved

**Issue**: Login worked locally but returned 404 errors on Vercel deployment.

**Root Cause**: The `AuthContext.jsx` file was using hardcoded relative URLs (like `/api/auth/login`) instead of the full backend URL from environment variables.

**Solution**: Updated all fetch calls in `AuthContext.jsx` to use `API_BASE_URL` from the `VITE_API_URL` environment variable.

---

## 📝 Changes Made

### File Modified: `frontend/src/contexts/AuthContext.jsx`

**Added API base URL configuration:**
```javascript
// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
```

**Updated all fetch URLs:**
- ✅ `/api/auth/login` → `${API_BASE_URL}/api/auth/login`
- ✅ `/api/auth/register` → `${API_BASE_URL}/api/auth/register`
- ✅ `/api/auth/profile` → `${API_BASE_URL}/api/auth/profile`
- ✅ `/api/auth/account` → `${API_BASE_URL}/api/auth/account`

---

## 🚀 Deployment Configuration for Vercel

### 1. Build Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 2. Environment Variables

In your Vercel project settings, add this environment variable:

```
VITE_API_URL=https://student-teacher-management-system.onrender.com
```

**Steps to add:**
1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://student-teacher-management-system.onrender.com`
   - **Environment**: All (Production, Preview, Development)
4. Click **Save**

### 3. Redeploy

After setting the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. **IMPORTANT**: Check ✅ "Use existing Build Cache" to use the new environment variable

---

## ✨ Why This Works

### Local Development
```javascript
// .env file
VITE_API_URL=http://localhost:3001

// AuthContext.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
// API_BASE_URL = "http://localhost:3001"

// Login call becomes:
fetch(`${API_BASE_URL}/api/auth/login`)
// = fetch("http://localhost:3001/api/auth/login") ✅
```

### Vercel Production
```javascript
// Vercel environment variable
VITE_API_URL=https://student-teacher-management-system.onrender.com

// AuthContext.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
// API_BASE_URL = "https://student-teacher-management-system.onrender.com"

// Login call becomes:
fetch(`${API_BASE_URL}/api/auth/login`)
// = fetch("https://student-teacher-management-system.onrender.com/api/auth/login") ✅
```

### Before Fix (Why it Failed)
```javascript
// Hardcoded URL in AuthContext
fetch('/api/auth/login')
// = fetch("https://your-app.vercel.app/api/auth/login") ❌
// Vercel doesn't have this endpoint - 404 error!
```

---

## 🧪 Testing After Deployment

### 1. Check Build Logs
After redeployment, verify in Vercel build logs:
```
✓ Building production bundle...
✓ Environment variable VITE_API_URL detected
```

### 2. Test Login Functionality

Open your Vercel app and try to login. Check browser console:
```javascript
// Should show:
Network → api/auth/login
Status: 200 OK (or 401 if wrong credentials)

// NOT:
Status: 404 Not Found
```

### 3. Verify API Calls

Open browser DevTools → Network tab:
- Login request should go to: `https://student-teacher-management-system.onrender.com/api/auth/login`
- Not to: `https://your-app.vercel.app/api/auth/login`

---

## 🔍 Troubleshooting

### If you still get 404 errors:

1. **Check environment variable is set**
   ```bash
   # In Vercel project settings, verify:
   VITE_API_URL is present and not empty
   ```

2. **Clear build cache and redeploy**
   - Redeploy without "Use existing Build Cache" checked
   - This ensures new environment variables are used

3. **Check browser console**
   ```javascript
   // Add this temporarily to see what URL is being used:
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

4. **CORS issues?**
   - Make sure your backend allows requests from Vercel domain
   - Check `backend/server.js` CORS configuration

---

## 📋 Complete Checklist

- [x] Fixed `AuthContext.jsx` to use `API_BASE_URL`
- [ ] Set `VITE_API_URL` environment variable in Vercel
- [ ] Redeploy the application
- [ ] Test login functionality
- [ ] Verify all API calls work correctly

---

## 🎯 Summary

The fix ensures that:
- **Locally**: API calls go to `http://localhost:3001`
- **Vercel**: API calls go to your backend on Render
- **No hardcoded URLs**: Everything uses environment variables
- **Consistent behavior**: Works the same in all environments

Your app should now work perfectly on Vercel! 🎉
