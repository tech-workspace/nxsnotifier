# 🚂 Railway Backend Deployment Guide

## 🎯 Overview
This guide will help you deploy your NXS Notifier backend to Railway.

## 📋 Prerequisites
- [Railway Account](https://railway.app/signup)
- GitHub repository with your code
- MongoDB Atlas database (already configured)

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Complete the verification process

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `nxsnotifier` repository
4. Click "Deploy Now"

### Step 3: Configure Environment Variables
1. In your Railway project dashboard, go to "Variables" tab
2. Add the following environment variables:

```env
MONGODB_URI=mongodb+srv://techworkspacews:UVAum12nXIp9vmz4@cluster0.r8v89oz.mongodb.net/nxs
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://nxsnotifier.vercel.app
TRUST_PROXY=true
```

### Step 4: Configure Service Settings

**Recommended Configuration:**
1. Go to "Settings" tab
2. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

**Alternative Configuration:**
If the above doesn't work, try these settings:
- **Root Directory**: `backend`
- **Build Command**: `chmod +x deploy.sh && ./deploy.sh`
- **Start Command**: `npm start`

### Step 5: Deploy
1. Railway will automatically detect the changes
2. Click "Deploy" to start the deployment
3. Monitor the build logs for any issues

## 🔧 Configuration Files

### Railway Configuration Files

#### `backend/railway.json` (Docker Build)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `backend/Dockerfile`
```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies using npm install (not npm ci)
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
```

#### `backend/nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs", "npm"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["echo 'No build step required for Node.js'"]

[start]
cmd = "npm start"
```

### Environment Variables (`backend/railway.env`)
```env
MONGODB_URI=mongodb+srv://techworkspacews:UVAum12nXIp9vmz4@cluster0.r8v89oz.mongodb.net/nxs
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://nxsnotifier.vercel.app
TRUST_PROXY=true
```

## 🌐 Get Your Railway URL

After successful deployment:
1. Go to your Railway project dashboard
2. Click on your service
3. Copy the generated URL (e.g., `https://your-app-name.railway.app`)
4. Your API will be available at: `https://your-app-name.railway.app/api`

## 🔄 Update Frontend Configuration

Once you have your Railway URL, update the frontend configuration:

```javascript
// In app/config/api.js
const PROD_API_URL = 'https://your-app-name.railway.app/api';
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- URL: `https://your-app-name.railway.app/api/health`
- Expected response:
```json
{
  "status": "OK",
  "message": "NXS Notifier API is running",
  "mongodb": "Connected",
  "mode": "Read-only with manual refresh",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Railway Dashboard
- Monitor logs in real-time
- Check deployment status
- View resource usage
- Set up alerts

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check if `backend/package.json` exists
   - Verify all dependencies are listed
   - Check build logs for specific errors

2. **Package Lock Issues (EUSAGE Error)**
   - Delete `package-lock.json` and run `npm install` locally
   - Ensure all dependencies are properly listed in `package.json`
   - Check for version conflicts in dependencies
   - Use `npm install` instead of `npm ci` if needed

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify MongoDB connection string

3. **Port Issues**
   - Railway automatically sets the PORT variable
   - Don't hardcode port numbers
   - Use `process.env.PORT || 5000`

4. **MongoDB Connection**
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Ensure database user has proper permissions

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check service status
railway status

# Redeploy if needed
railway up
```

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to Git
- Use Railway's environment variable system
- Rotate MongoDB passwords regularly

### CORS Configuration
- Update CORS_ORIGIN with your frontend domain
- Don't use `*` in production
- Add specific domains as needed

### Network Security
- MongoDB Atlas IP whitelist (if needed)
- Railway provides HTTPS by default
- Monitor for suspicious activity

## 📈 Scaling & Performance

### Railway Plans
- **Free Tier**: Limited resources, good for testing
- **Pro Plan**: More resources, better performance
- **Team Plan**: Collaboration features

### Performance Tips
- Use connection pooling for MongoDB
- Implement caching if needed
- Monitor response times
- Set up proper logging

## 🎉 Success!

Your backend is now deployed on Railway! 

### Next Steps
1. Test the API endpoints
2. Update frontend configuration
3. Deploy frontend to Vercel/Netlify
4. Build and submit mobile apps

### Support
- 📖 [Railway Documentation](https://docs.railway.app)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [GitHub Issues](https://github.com/railwayapp/railway/issues) 