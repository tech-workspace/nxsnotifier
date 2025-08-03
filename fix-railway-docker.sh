#!/bin/bash

echo "🔧 Railway Docker Build Fix"
echo "=========================="

echo ""
echo "🚨 Fixing Railway build with Docker approach..."
echo ""

echo "1. Creating Dockerfile..."
cd backend

cat > Dockerfile << 'EOF'
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
EOF

echo "2. Creating .dockerignore..."
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.production
railway.env
railway.toml
railway.json
nixpacks.toml
build.sh
fix-*.bat
fix-*.sh
EOF

echo "3. Updating railway.json for Docker build..."
cat > railway.json << 'EOF'
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
EOF

echo ""
echo "✅ Docker build configuration created!"
echo ""
echo "📝 Next steps:"
echo "1. Commit all changes: git add . && git commit -m 'Add Docker build for Railway'"
echo "2. Push to GitHub: git push"
echo "3. In Railway dashboard:"
echo "   - Set Builder to: DOCKERFILE"
echo "   - Set Dockerfile Path to: Dockerfile"
echo "4. Redeploy on Railway"
echo ""

echo "🎯 Files created:"
echo "   ✅ backend/Dockerfile - Docker build configuration"
echo "   ✅ backend/.dockerignore - Docker ignore file"
echo "   ✅ backend/railway.json - Updated for Docker build"
echo ""

echo "🚀 This should resolve the npm ci issue by using Docker!"
echo ""

read -p "Press Enter to continue..." 