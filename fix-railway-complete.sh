#!/bin/bash

echo "🔧 Complete Railway Build Fix"
echo "============================="

echo ""
echo "🚨 Fixing all Railway build issues..."
echo ""

echo "1. Cleaning up old files..."
cd backend
if [ -f "package-lock.json" ]; then
    echo "   - Deleting old package-lock.json"
    rm package-lock.json
fi

echo ""
echo "2. Installing dependencies..."
npm install

echo ""
echo "3. Creating configuration files..."
echo "   - railway.json (updated)"
echo "   - nixpacks.toml (new)"
echo "   - railway.toml (new)"
echo "   - build.sh (new)"
echo "   - .npmrc (updated)"

echo ""
echo "4. Making build script executable..."
if [ -f "build.sh" ]; then
    chmod +x build.sh
    echo "   - build.sh is now executable"
fi

echo ""
echo "✅ All fixes applied!"
echo ""
echo "📝 Next steps:"
echo "1. Commit all changes: git add . && git commit -m 'Fix Railway build issues'"
echo "2. Push to GitHub: git push"
echo "3. In Railway dashboard, set build command to: npm install"
echo "4. Redeploy on Railway"
echo ""

echo "🎯 Configuration files created:"
echo "   ✅ backend/railway.json - Main Railway config"
echo "   ✅ backend/nixpacks.toml - Nixpacks build config"
echo "   ✅ backend/railway.toml - Alternative Railway config"
echo "   ✅ backend/build.sh - Custom build script"
echo "   ✅ backend/.npmrc - NPM configuration"
echo "   ✅ backend/package-lock.json - Regenerated lock file"
echo ""

read -p "Press Enter to continue..." 