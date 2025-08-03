#!/bin/bash

echo "🚀 Railway Deployment Script"
echo "============================"

echo "📦 Installing dependencies..."
npm install --no-audit --no-fund

echo "✅ Installation completed!"
echo "🚀 Starting application..."
npm start 