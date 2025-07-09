#!/bin/bash

# 🚀 Enterprise PWA Template Generator - GitHub Repository Setup Script
# This script automates the creation and setup of the GitHub repository

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Repository configuration
REPO_NAME="pwa-template-generator"
REPO_DESCRIPTION="🚀 Enterprise PWA Template Generator - AI-powered, multi-framework PWA generator with TypeScript, modern build tools, and one-click deployment"
GITHUB_USERNAME=""

echo -e "${BLUE}🚀 Enterprise PWA Template Generator - GitHub Setup${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "web-app" ]; then
    print_error "This script must be run from the pwa-template-generator root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Get GitHub username
echo -e "${CYAN}📝 GitHub Configuration${NC}"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub username is required"
    exit 1
fi

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    USE_GH_CLI=true
    print_info "GitHub CLI detected - will use automated repository creation"
else
    USE_GH_CLI=false
    print_warning "GitHub CLI not found - will provide manual setup instructions"
fi

echo ""
echo -e "${CYAN}📋 Repository Details${NC}"
echo -e "Repository: ${GREEN}$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "Description: ${GREEN}$REPO_DESCRIPTION${NC}"
echo -e "Live Demo: ${GREEN}https://pwa-template-generator.web.app${NC}"
echo ""

read -p "Proceed with GitHub repository setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

echo ""
echo -e "${PURPLE}🔧 Starting GitHub Repository Setup...${NC}"
echo ""

# Step 1: Create GitHub repository
if [ "$USE_GH_CLI" = true ]; then
    print_info "Creating GitHub repository..."

    # Check if user is logged in to GitHub CLI
    if ! gh auth status &> /dev/null; then
        print_warning "Not logged in to GitHub CLI. Please log in first."
        echo "Run: gh auth login"
        exit 1
    fi

    # Create repository
    if gh repo create "$REPO_NAME" --public --description "$REPO_DESCRIPTION" --confirm; then
        print_status "GitHub repository created successfully"
    else
        print_error "Failed to create GitHub repository"
        exit 1
    fi
else
    print_warning "Manual repository creation required:"
    echo ""
    echo -e "${YELLOW}Please create the repository manually:${NC}"
    echo -e "1. Go to: ${BLUE}https://github.com/new${NC}"
    echo -e "2. Repository name: ${GREEN}$REPO_NAME${NC}"
    echo -e "3. Description: ${GREEN}$REPO_DESCRIPTION${NC}"
    echo -e "4. Make it ${GREEN}Public${NC}"
    echo -e "5. ${RED}DON'T${NC} add README, .gitignore, or license (we have them)"
    echo -e "6. Click ${GREEN}'Create repository'${NC}"
    echo ""
    read -p "Press Enter after creating the repository on GitHub..." -n 1 -r
    echo ""
fi

# Step 2: Set up remote origin
print_info "Setting up remote origin..."
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Remove origin if it exists
git remote remove origin 2>/dev/null || true

# Add new origin
if git remote add origin "$REPO_URL"; then
    print_status "Remote origin added: $REPO_URL"
else
    print_error "Failed to add remote origin"
    exit 1
fi

# Step 3: Create MIT License
print_info "Creating MIT License..."
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Mark Hays

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "📄 Add MIT License"
print_status "MIT License added and committed"

# Step 4: Update README with correct username
print_info "Updating README with your GitHub username..."
if command -v sed &> /dev/null; then
    # macOS/BSD sed
    sed -i '' "s/yourusername/$GITHUB_USERNAME/g" README.md 2>/dev/null || \
    # GNU/Linux sed
    sed -i "s/yourusername/$GITHUB_USERNAME/g" README.md

    git add README.md
    git commit -m "🔗 Update README with correct GitHub username"
    print_status "README updated with your GitHub username"
else
    print_warning "Please manually update README.md to replace 'yourusername' with '$GITHUB_USERNAME'"
fi

# Step 5: Create issue templates
print_info "Creating GitHub issue templates..."
mkdir -p .github/ISSUE_TEMPLATE

# Bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Bug Description
A clear description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
A clear description of what you expected to happen.

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 💻 Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 1.0.0]
- Node.js: [e.g. 18.0.0]

## 📋 Additional Context
Add any other context about the problem here.
EOF

# Feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 💡 Feature Description
A clear description of what you want to happen.

## 🎯 Problem Statement
What problem does this solve?

## 💭 Proposed Solution
A clear description of what you want to happen.

## 🔄 Alternatives Considered
A clear description of any alternative solutions you've considered.

## 📋 Additional Context
Add any other context or screenshots about the feature request here.
EOF

git add .github/
git commit -m "📝 Add GitHub issue templates for community contributions"
print_status "GitHub issue templates created"

# Step 6: Push to GitHub
print_info "Pushing code to GitHub..."
if git push -u origin main; then
    print_status "Code successfully pushed to GitHub"
else
    print_error "Failed to push code to GitHub"
    exit 1
fi

# Step 7: Create initial release tag
print_info "Creating initial release tag..."
git tag -a v1.0.0 -m "🎉 v1.0.0: Initial release - Enterprise PWA Generator

✨ Features:
- AI-powered PWA generation with business intelligence
- Multi-framework support (React, Vue, Angular, Next.js, Svelte)
- TypeScript + Vite + Modern build tools
- Enterprise-grade components and PWA features
- One-click deployment to multiple platforms

🚀 Live Demo: https://pwa-template-generator.web.app

🔧 Tech Stack:
- Frontend: React 18 + TypeScript + Vite + Chakra UI
- Backend: Firebase Hosting + Cloud Functions
- AI: OpenAI GPT integration for smart recommendations
- PWA: Service workers, manifest, offline support

📦 What's included:
- Complete web application with builder interface
- Project generator with 16+ file templates
- Authentication, responsive design, PWA optimization
- Deployment configurations for major cloud platforms
- Comprehensive documentation and troubleshooting guides

🎯 Phase 1 COMPLETE: Foundation architecture with all core features working
Ready for Phase 2: Enterprise features and advanced integrations"

if git push origin v1.0.0; then
    print_status "Release tag v1.0.0 created and pushed"
else
    print_warning "Failed to push release tag (repository might not be ready yet)"
fi

# Step 8: Final verification
echo ""
echo -e "${GREEN}🎉 GitHub Repository Setup Complete!${NC}"
echo ""
echo -e "${CYAN}📋 Repository Information:${NC}"
echo -e "Repository URL: ${GREEN}https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "Live Demo: ${GREEN}https://pwa-template-generator.web.app${NC}"
echo -e "Clone URL: ${GREEN}git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git${NC}"
echo ""

echo -e "${CYAN}🔧 Next Steps:${NC}"
echo -e "1. Visit your repository: ${BLUE}https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "2. Add repository topics: ${YELLOW}pwa, react, typescript, vite, ai, generator${NC}"
echo -e "3. Enable GitHub Pages (optional): Settings → Pages"
echo -e "4. Set up branch protection rules (optional)"
echo -e "5. Create a GitHub release from tag v1.0.0"
echo ""

if [ "$USE_GH_CLI" = true ]; then
    echo -e "${CYAN}🚀 Quick Actions with GitHub CLI:${NC}"
    echo -e "Create GitHub release: ${YELLOW}gh release create v1.0.0 --title '🚀 v1.0.0 - Enterprise PWA Generator' --notes-file .github/release-notes.md${NC}"
    echo -e "Enable discussions: ${YELLOW}gh repo edit --enable-discussions${NC}"
    echo -e "Add topics: ${YELLOW}gh repo edit --add-topic pwa,react,typescript,vite,ai,generator${NC}"
    echo ""
fi

echo -e "${CYAN}📢 Share Your Project:${NC}"
echo -e "Twitter: ${BLUE}Just launched my AI-powered PWA generator! 🚀 https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "LinkedIn: Share your achievement with your professional network"
echo -e "Dev.to: Write a blog post about building the generator"
echo ""

print_status "Your Enterprise PWA Template Generator is now live on GitHub!"
print_info "Don't forget to star your own repository ⭐"

# Cleanup
rm -f .github/release-notes.md 2>/dev/null || true
