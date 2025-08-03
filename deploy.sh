#!/bin/bash

# NXS Notifier Production Deployment Script
# This script helps automate the deployment process

echo "🚀 NXS Notifier Production Deployment"
echo "====================================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if user is logged in to EAS
if ! eas whoami &> /dev/null; then
    echo "🔐 Please login to EAS:"
    eas login
fi

# Function to build for specific platform
build_platform() {
    local platform=$1
    echo "📱 Building for $platform..."
    
    if [ "$platform" = "android" ]; then
        npm run build:android
    elif [ "$platform" = "ios" ]; then
        npm run build:ios
    elif [ "$platform" = "preview" ]; then
        npm run build:preview
    fi
}

# Function to submit to store
submit_to_store() {
    local platform=$1
    echo "📤 Submitting to $platform store..."
    
    if [ "$platform" = "android" ]; then
        npm run submit:android
    elif [ "$platform" = "ios" ]; then
        npm run submit:ios
    fi
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1. Build Android APK/Bundle"
echo "2. Build iOS App"
echo "3. Build Preview (both platforms)"
echo "4. Submit to Google Play Store"
echo "5. Submit to Apple App Store"
echo "6. Full deployment (build + submit)"
echo "7. Exit"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        build_platform "android"
        ;;
    2)
        build_platform "ios"
        ;;
    3)
        build_platform "preview"
        ;;
    4)
        submit_to_store "android"
        ;;
    5)
        submit_to_store "ios"
        ;;
    6)
        echo "🔄 Full deployment process..."
        echo "Building for Android..."
        build_platform "android"
        echo "Building for iOS..."
        build_platform "ios"
        echo "Submitting to stores..."
        submit_to_store "android"
        submit_to_store "ios"
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo "📋 Check your EAS dashboard for build status: https://expo.dev" 