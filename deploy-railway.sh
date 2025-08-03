#!/bin/bash

echo "🚂 Railway Backend Deployment Helper"
echo "===================================="

echo ""
echo "📋 Prerequisites Check:"
echo "1. Railway account created"
echo "2. GitHub repository connected"
echo "3. MongoDB Atlas database ready"
echo ""

echo "🚀 Deployment Steps:"
echo ""
echo "Step 1: Go to https://railway.app"
echo "Step 2: Create new project"
echo "Step 3: Connect your GitHub repository"
echo "Step 4: Set root directory to: backend"
echo "Step 5: Add environment variables"
echo ""

echo "📝 Environment Variables to Add:"
echo ""
echo "MONGODB_URI=mongodb+srv://techworkspacews:UVAum12nXIp9vmz4@cluster0.r8v89oz.mongodb.net/nxs"
echo "NODE_ENV=production"
echo "PORT=5000"
echo "CORS_ORIGIN=https://nxsnotifier.vercel.app"
echo "TRUST_PROXY=true"
echo ""

echo "🔧 Configuration Files Ready:"
echo "✅ backend/railway.json"
echo "✅ backend/railway.env"
echo "✅ backend/package.json"
echo "✅ backend/server.js"
echo ""

echo "📖 Full guide: RAILWAY_DEPLOYMENT.md"
echo ""

echo "🎯 After deployment:"
echo "1. Get your Railway URL"
echo "2. Update app/config/api.js with the URL"
echo "3. Test the API endpoints"
echo ""

read -p "Press Enter to continue..." 