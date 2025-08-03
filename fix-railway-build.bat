@echo off
chcp 65001 >nul

echo 🔧 Railway Build Fix Script
echo ===========================

echo.
echo 🚨 Common Railway Build Issues:
echo.

echo 1. Package Lock Issues (EUSAGE Error)
echo    - Delete package-lock.json
echo    - Run npm install
echo    - Commit the new package-lock.json
echo.

echo 2. Missing Dependencies
echo    - Check package.json for all required dependencies
echo    - Ensure versions are compatible
echo    - Run npm install to regenerate lock file
echo.

echo 3. Environment Variables
echo    - Ensure all required variables are set in Railway
echo    - Check for typos in variable names
echo    - Verify MongoDB connection string
echo.

echo 🔧 Fixing package-lock.json...
cd backend
if exist package-lock.json (
    echo Deleting old package-lock.json...
    del package-lock.json
)

echo Installing dependencies...
npm install

echo.
echo ✅ Package-lock.json regenerated!
echo.
echo 📝 Next steps:
echo 1. Commit the new package-lock.json file
echo 2. Push to GitHub
echo 3. Redeploy on Railway
echo.

pause 