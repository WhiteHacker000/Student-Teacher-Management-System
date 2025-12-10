# 🚀 Quick Deployment Setup - Render + Railway

## ✅ Your Deployment URLs:
- **Backend:** https://student-backend-nte8.onrender.com
- **Frontend:** https://student-frontend-hn3u.onrender.com
- **Database:** Railway MySQL (switchback.proxy.rlwy.net:39418)

---

## 🔧 STEP 1: Configure Backend (5 minutes)

### Go to Backend Settings:
👉 https://dashboard.render.com/web/student-backend-nte8

### Add Environment Variables:

Click **"Environment"** in left sidebar → Click **"Add Environment Variable"**

Add these **one by one** (or use "Add from .env"):

```
DATABASE_TYPE = mysql
MYSQL_HOST = switchback.proxy.rlwy.net
MYSQL_PORT = 39418
MYSQL_USER = root
MYSQL_PASSWORD = GruqnInrnWLqWnBpOFUfVvjLvZFHwEQp
MYSQL_DATABASE = railway
MYSQL_SSL = false
JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_REFRESH_SECRET = f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
PORT = 3001
NODE_ENV = production
CORS_ORIGIN = https://student-frontend-hn3u.onrender.com
JWT_EXPIRES_IN = 7d
JWT_REFRESH_EXPIRES_IN = 30d
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
LOGIN_RATE_LIMIT_MAX = 5
```

**⚠️ Important:** Click **"Save Changes"** at bottom!

Render will automatically redeploy (takes ~2-3 minutes).

---

## 🎨 STEP 2: Configure Frontend (2 minutes)

### Go to Frontend Settings:
👉 https://dashboard.render.com/static/student-frontend-hn3u

### Add Environment Variable:

Click **"Environment"** → Click **"Add Environment Variable"**

```
VITE_API_URL = https://student-backend-nte8.onrender.com
```

**⚠️ Important:** Click **"Save Changes"**!

Render will automatically redeploy.

---

## 🧪 STEP 3: Test Your Deployment (1 minute)

### Test Backend Connection:

**Option 1: Browser**
Open: https://student-backend-nte8.onrender.com/api/health

**Option 2: Terminal**
```bash
curl https://student-backend-nte8.onrender.com/api/health
```

**✅ Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "MYSQL",
  "dbStatus": "connected",
  "environment": "production"
}
```

**🔴 If you see `"dbStatus": "connected"` = SUCCESS!**

---

### Test Frontend:

1. Open: https://student-frontend-hn3u.onrender.com
2. Try to register a new user
3. Try to login
4. Check if dashboard loads

---

## 📊 Verify Database:

Check if users are being saved in Railway:

```bash
mysql -h switchback.proxy.rlwy.net -P 39418 -u root -pGruqnInrnWLqWnBpOFUfVvjLvZFHwEQp railway -e "SELECT id, name, email, role FROM users;"
```

---

## 🐛 Troubleshooting

### Backend shows error after adding env vars:

**Check Render Logs:**
1. Go to backend dashboard
2. Click **"Logs"** tab
3. Look for connection errors

**Common Issues:**
- Railway MySQL sleeping (wake it up by accessing Railway dashboard)
- Typo in MYSQL_PASSWORD
- Missing environment variables

### Frontend not connecting to backend:

**Check Browser Console:**
1. Open frontend URL
2. Press F12 (DevTools)
3. Go to Console tab
4. Look for API errors

**Common Issues:**
- VITE_API_URL not set correctly
- CORS error (check CORS_ORIGIN in backend)
- Backend not running

### CORS Error:

Make sure backend has:
```
CORS_ORIGIN = https://student-frontend-hn3u.onrender.com
```

**No `http://`, no trailing `/`**

---

## 🎯 Current Status Checklist

Check off as you complete:

- [ ] Backend environment variables added on Render
- [ ] Backend redeployed successfully
- [ ] Backend health check returns `"dbStatus": "connected"`
- [ ] Frontend environment variable added on Render
- [ ] Frontend redeployed successfully
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard displays correctly
- [ ] User data saved in Railway MySQL

---

## 🔗 Quick Links

| Service | Dashboard | Public URL | Status |
|---------|-----------|------------|--------|
| Backend | [Open](https://dashboard.render.com/web/student-backend-nte8) | [Test](https://student-backend-nte8.onrender.com/api/health) | ⏳ Pending |
| Frontend | [Open](https://dashboard.render.com/static/student-frontend-hn3u) | [Open](https://student-frontend-hn3u.onrender.com) | ⏳ Pending |
| Database | [Open](https://railway.app) | switchback.proxy.rlwy.net:39418 | 🟢 Online |

---

## 📱 Share Your App!

Once everything works, share this URL:
**https://student-frontend-hn3u.onrender.com**

---

## 🎉 Next Steps After Deployment:

1. **Test all features** (courses, assignments, attendance)
2. **Create demo accounts** (teacher & student)
3. **Check mobile responsiveness**
4. **Monitor Render logs** for errors
5. **Add custom domain** (optional)

---

**Need help?** Check Render logs or Railway database status first!
