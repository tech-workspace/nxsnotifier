@echo off
chcp 65001 >nul

echo 🔧 Railway Docker Build Fix
echo ===========================

echo.
echo 🚨 Fixing Railway build with Docker approach...
echo.

echo 1. Creating Dockerfile...
cd backend

echo # Use Node.js 18 Alpine image > Dockerfile
echo FROM node:18-alpine >> Dockerfile
echo. >> Dockerfile
echo # Set working directory >> Dockerfile
echo WORKDIR /app >> Dockerfile
echo. >> Dockerfile
echo # Copy package files first for better caching >> Dockerfile
echo COPY package*.json ./ >> Dockerfile
echo. >> Dockerfile
echo # Install dependencies using npm install (not npm ci) >> Dockerfile
echo RUN npm install >> Dockerfile
echo. >> Dockerfile
echo # Copy the rest of the application >> Dockerfile
echo COPY . . >> Dockerfile
echo. >> Dockerfile
echo # Expose port >> Dockerfile
echo EXPOSE 5000 >> Dockerfile
echo. >> Dockerfile
echo # Health check >> Dockerfile
echo HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \ >> Dockerfile
echo   CMD curl -f http://localhost:5000/api/health ^|^| exit 1 >> Dockerfile
echo. >> Dockerfile
echo # Start the application >> Dockerfile
echo CMD ["npm", "start"] >> Dockerfile

echo 2. Creating .dockerignore...
echo node_modules > .dockerignore
echo npm-debug.log >> .dockerignore
echo .git >> .dockerignore
echo .gitignore >> .dockerignore
echo README.md >> .dockerignore
echo .env >> .dockerignore
echo .env.local >> .dockerignore
echo .env.production >> .dockerignore
echo railway.env >> .dockerignore
echo railway.toml >> .dockerignore
echo railway.json >> .dockerignore
echo nixpacks.toml >> .dockerignore
echo build.sh >> .dockerignore
echo fix-*.bat >> .dockerignore
echo fix-*.sh >> .dockerignore

echo 3. Updating railway.json for Docker build...
echo { > railway.json
echo   "$schema": "https://railway.app/railway.schema.json", >> railway.json
echo   "build": { >> railway.json
echo     "builder": "DOCKERFILE", >> railway.json
echo     "dockerfilePath": "Dockerfile" >> railway.json
echo   }, >> railway.json
echo   "deploy": { >> railway.json
echo     "startCommand": "npm start", >> railway.json
echo     "healthcheckPath": "/api/health", >> railway.json
echo     "healthcheckTimeout": 100, >> railway.json
echo     "restartPolicyType": "ON_FAILURE", >> railway.json
echo     "restartPolicyMaxRetries": 10 >> railway.json
echo   } >> railway.json
echo } >> railway.json

echo.
echo ✅ Docker build configuration created!
echo.
echo 📝 Next steps:
echo 1. Commit all changes: git add . && git commit -m "Add Docker build for Railway"
echo 2. Push to GitHub: git push
echo 3. In Railway dashboard:
echo    - Set Builder to: DOCKERFILE
echo    - Set Dockerfile Path to: Dockerfile
echo 4. Redeploy on Railway
echo.

echo 🎯 Files created:
echo   ✅ backend/Dockerfile - Docker build configuration
echo   ✅ backend/.dockerignore - Docker ignore file
echo   ✅ backend/railway.json - Updated for Docker build
echo.

echo 🚀 This should resolve the npm ci issue by using Docker!
echo.

pause 