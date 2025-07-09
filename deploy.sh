#!/bin/bash

# PWA Template Generator Deployment Script
# This script builds and deploys the PWA Template Generator to Firebase

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting PWA Template Generator deployment...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "web-app" ]; then
    echo -e "${RED}❌ Error: This script must be run from the pwa-template-generator root directory${NC}"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Error: Firebase CLI is not installed. Please install it first:${NC}"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo -e "${RED}❌ Error: You're not logged in to Firebase. Please run:${NC}"
    echo "firebase login"
    exit 1
fi

echo -e "${YELLOW}📦 Building the project...${NC}"

# Navigate to web-app directory and build
cd web-app
if ! npm run build; then
    echo -e "${RED}❌ Build failed! Please fix the errors and try again.${NC}"
    exit 1
fi

# Return to root directory
cd ..

echo -e "${GREEN}✅ Build completed successfully!${NC}"

echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"

# Deploy to Firebase
if firebase deploy --only hosting; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${BLUE}🌐 Your PWA Template Generator is live at:${NC}"
    echo -e "${GREEN}https://pwa-template-generator.web.app${NC}"
    echo ""
    echo -e "${BLUE}📊 Firebase Console:${NC}"
    echo -e "${GREEN}https://console.firebase.google.com/project/pwa-template-generator/overview${NC}"
else
    echo -e "${RED}❌ Deployment failed! Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
