# 🚀 Backend Deployment Guide - Authentication & Visits Update

## ✅ Changes Made to Backend

### 1. **Added NPM Packages**
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-useragent` - User agent parsing

### 2. **Added MongoDB Schemas**
- **User Schema**: For user authentication (fullName, mobile, password, roleId)
- **Visit Schema**: For visit tracking (IP, device, location, browser, OS, etc.)

### 3. **Added Authentication Routes**
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Authenticate and get JWT token
- `GET /api/v1/auth/profile` - Get user profile (requires auth)

### 4. **Added Visits Routes**
- `POST /api/v1/visits` - Record a new visit (public)
- `GET /api/v1/visits` - Get visits with filters (requires auth)
- `GET /api/v1/visits/statistics` - Get visit analytics (requires auth)

### 5. **Added Environment Variables**
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)

---

## 🔧 How to Deploy to Railway

### **Option 1: Automatic Deployment via Git (Recommended)**

Railway automatically deploys when you push to your connected Git repository.

**Steps:**
1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Add authentication and visits API endpoints"
   git push origin main
   ```

2. **Add environment variable in Railway dashboard:**
   - Go to: https://railway.app
   - Select your `nxsnotifier` project
   - Go to **Variables** tab
   - Add new variable:
     - Name: `JWT_SECRET`
     - Value: `nxs-notifier-production-secret-key-2025`
   - Add another variable:
     - Name: `JWT_EXPIRES_IN`
     - Value: `7d`
   - Click **Save**

3. **Railway will automatically redeploy** with the new code and environment variables

4. **Wait for deployment** (usually takes 2-3 minutes)

5. **Verify deployment:**
   ```bash
   curl https://nxsnotifier.up.railway.app/api/health
   ```

---

### **Option 2: Manual Railway CLI Deployment**

If you have Railway CLI installed:

```bash
cd backend
railway up
```

---

## ✅ Verification Steps

After deployment, test the new endpoints:

### 1. **Test Signup:**
```bash
curl -X POST https://nxsnotifier.up.railway.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","mobile":"1234567890","password":"test123"}'
```

### 2. **Test Login:**
```bash
curl -X POST https://nxsnotifier.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0568863388","password":"600660"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. **Test Profile (with token from login):**
```bash
curl https://nxsnotifier.up.railway.app/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Important Notes

1. **First User Creation**: Since the user with mobile `0568863388` doesn't exist yet, you need to:
   - Either create it via signup in the app
   - Or use a different mobile number
   - Or create the user manually in MongoDB

2. **JWT Secret**: Make sure to add `JWT_SECRET` to Railway environment variables before deployment

3. **Database**: The new User and Visit collections will be automatically created in your MongoDB database

---

## 🔴 If You Get Authentication Errors

If the mobile number `0568863388` doesn't exist in the database:

1. **Option A**: Create the user via signup screen in the app
2. **Option B**: Use Railway's deployment logs to verify the server started correctly
3. **Option C**: Check MongoDB to see if users collection exists

---

## 🚀 Quick Deploy Command

From the project root:
```bash
git add .
git commit -m "Add auth and visits API endpoints"
git push origin main
```

Then add JWT_SECRET in Railway dashboard and wait for auto-deployment.

---

*Created: October 12, 2025*

