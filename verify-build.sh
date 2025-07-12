#!/bin/bash

# 🔧 Build Verification Script
# Verifies that the PWA Template Generator builds successfully
# Usage: ./verify-build.sh

set -e  # Exit on any error

echo "🔧 PWA Template Generator Build Verification"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "web-app" ]; then
    print_error "Not in PWA Template Generator directory!"
    echo "Please run this script from your pwa-template-generator directory"
    exit 1
fi

print_status "Step 1: Installing dependencies..."
cd web-app
npm install
print_success "Dependencies installed"

print_status "Step 2: Running TypeScript type check..."
npm run type-check
if [ $? -eq 0 ]; then
    print_success "TypeScript type check passed"
else
    print_error "TypeScript type check failed!"
    exit 1
fi

print_status "Step 3: Building application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed!"
    exit 1
fi

print_status "Step 4: Verifying build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    print_success "Build output verified - dist/index.html exists"

    # Check build size
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo "📦 Build size: $BUILD_SIZE"

    # List key files
    echo "📁 Key build files:"
    ls -la dist/*.html dist/*.js dist/*.css 2>/dev/null | head -10

else
    print_error "Build output missing - dist/index.html not found"
    exit 1
fi

cd ..

echo ""
echo "=============================================="
print_success "BUILD VERIFICATION COMPLETE!"
echo "=============================================="
echo ""
echo "🎉 Your PWA Template Generator is ready to deploy!"
echo ""
echo "✅ TypeScript compilation: PASSED"
echo "✅ Build process: SUCCESSFUL"
echo "✅ Output verification: CONFIRMED"
echo ""
echo "🚀 To deploy to production, run:"
echo "   ./deploy-to-production.sh"
echo ""
