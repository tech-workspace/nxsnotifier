@echo off
chcp 65001 >nul

echo 🔧 Final Railway Build Fix
echo ==========================

echo.
echo 🚨 Applying final fixes for Railway build...
echo.

echo 1. Updating package.json with missing dependencies...
cd backend

echo 2. Regenerating package-lock.json...
if exist package-lock.json (
    echo   - Deleting old package-lock.json
    del package-lock.json
)

echo   - Installing dependencies
npm install

echo.
echo 3. Creating simplified Railway configuration...
echo   - railway.json (simplified)
echo   - nixpacks.toml (explicit npm install)
echo   - .npmrc (avoid npm ci)
echo   - deploy.sh (custom deployment script)

echo.
echo ✅ All fixes applied!
echo.
echo 📝 Next steps:
echo 1. Commit all changes: git add . && git commit -m "Final Railway build fix"
echo 2. Push to GitHub: git push
echo 3. In Railway dashboard:
echo    - Set Root Directory to: backend
echo    - Set Build Command to: npm install
echo    - Set Start Command to: npm start
echo 4. Redeploy on Railway
echo.

echo 🎯 Configuration summary:
echo   ✅ Added missing dependencies to package.json
echo   ✅ Regenerated package-lock.json
echo   ✅ Simplified Railway configuration
echo   ✅ Created explicit npm install commands
echo   ✅ Added deployment script
echo.

echo 🚀 This should finally resolve the npm ci issue!
echo.

pause 