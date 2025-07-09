# 🛠️ PWA Template Generator - Troubleshooting Guide

## 🔍 Common Issues & Solutions

### 📦 Download & ZIP Issues

#### Issue: "Could not read package.json: ENOENT"
**Symptoms:**
- `npm install` fails with "no such file or directory"
- Missing `package.json` after extracting ZIP
- Empty or incomplete project folder

**Solutions:**
1. **Re-download the project:**
   - Go back to the download page
   - Click "Download Project" again
   - Wait for the download to complete fully

2. **Check ZIP extraction:**
   ```bash
   # Extract to a specific folder
   unzip digital-ghost-protocol.zip -d ./my-project
   cd my-project
   ls -la  # Should show package.json
   ```

3. **Verify project structure:**
   ```
   your-project/
   ├── package.json ✅
   ├── vite.config.ts ✅
   ├── index.html ✅
   ├── tsconfig.json ✅
   └── src/ ✅
   ```

#### Issue: ZIP file appears corrupted or empty
**Solutions:**
1. **Clear browser cache:**
   - Press `Ctrl+Shift+Del` (Windows) or `Cmd+Shift+Del` (Mac)
   - Clear cached files and reload the page

2. **Try a different browser:**
   - Use Chrome, Firefox, or Safari
   - Disable browser extensions temporarily

3. **Check file size:**
   - ZIP should be 5-15KB minimum
   - If smaller, the generation failed

---

### 🚀 Installation Issues

#### Issue: npm install fails
**Step-by-step fix:**
1. **Verify you're in the right directory:**
   ```bash
   cd your-project-name  # Enter the extracted folder
   pwd  # Should show path ending with your project name
   ls package.json  # Should exist
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be 16.0.0 or higher
   npm --version   # Should be 8.0.0 or higher
   ```

3. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

4. **Alternative package managers:**
   ```bash
   # Try with Yarn
   yarn install
   
   # Or with pnpm
   pnpm install
   ```

#### Issue: "Module not found" errors during install
**Solutions:**
1. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

2. **Use exact versions:**
   ```bash
   npm install --exact
   ```

3. **Check network connection:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm ping
   ```

---

### 🖥️ Development Server Issues

#### Issue: "npm run dev" fails
**Debugging steps:**
1. **Check if installation completed:**
   ```bash
   ls node_modules  # Should contain many packages
   ```

2. **Try different port:**
   ```bash
   npm run dev -- --port 3001
   ```

3. **Check for port conflicts:**
   ```bash
   lsof -i :3000  # See what's using port 3000
   ```

4. **Manual Vite start:**
   ```bash
   npx vite
   ```

#### Issue: White screen in browser
**Solutions:**
1. **Check browser console:**
   - Press F12 → Console tab
   - Look for red error messages

2. **Common fixes:**
   ```bash
   # Clear browser cache
   Ctrl+Shift+R (hard refresh)
   
   # Restart dev server
   Ctrl+C (stop server)
   npm run dev (restart)
   ```

3. **Verify file contents:**
   ```bash
   # Check if main files exist and have content
   cat src/main.tsx
   cat src/App.tsx
   cat package.json
   ```

---

### 🔧 Build Issues

#### Issue: "npm run build" fails
**Common fixes:**
1. **TypeScript errors:**
   ```bash
   # Check for TS errors
   npx tsc --noEmit
   
   # Fix by updating types
   npm install @types/react@latest @types/react-dom@latest
   ```

2. **Missing dependencies:**
   ```bash
   npm install --save-dev typescript @vitejs/plugin-react
   ```

3. **Clear build cache:**
   ```bash
   rm -rf dist
   npm run build
   ```

---

### 🌐 Browser Compatibility

#### Issue: App doesn't work in older browsers
**Solutions:**
1. **Use modern browsers:**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

2. **Check for JavaScript errors:**
   - F12 → Console
   - Look for "Uncaught" errors

3. **Disable browser extensions:**
   - Test in incognito/private mode

---

### 📱 PWA Features Not Working

#### Issue: "Add to Home Screen" not appearing
**Solutions:**
1. **Serve over HTTPS:**
   ```bash
   # For production testing
   npm run build
   npm run preview
   ```

2. **Check manifest:**
   ```bash
   # Verify manifest exists
   cat public/manifest.json
   ```

3. **Test PWA criteria:**
   - F12 → Lighthouse → PWA audit

---

### 🆘 Emergency Fixes

#### Complete Reset - If Nothing Works
```bash
# 1. Re-download the project
# 2. Extract to new folder
cd fresh-project-folder

# 3. Clean install
rm -rf node_modules package-lock.json
npm cache clean --force

# 4. Install with verbose logging
npm install --verbose

# 5. Start with error checking
npm run dev 2>&1 | tee debug.log
```

#### Create Minimal Test
```bash
# Create test file to verify React works
echo 'import React from "react"; export default function Test() { return <h1>Test Works!</h1>; }' > src/Test.tsx

# Update App.tsx to import Test
# Add <Test /> to your App component
```

---

### 📞 Getting Help

#### Before Reporting Issues
1. **Collect debug info:**
   ```bash
   node --version
   npm --version
   npx vite --version
   ```

2. **Check browser console:**
   - Screenshot any error messages
   - Include full error stack traces

3. **Verify project structure:**
   ```bash
   find . -name "*.json" -o -name "*.tsx" -o -name "*.css" | sort
   ```

#### What to Include in Bug Reports
- ✅ Operating system
- ✅ Node.js version
- ✅ Browser and version
- ✅ Complete error messages
- ✅ Steps to reproduce
- ✅ Project structure (ls -la output)

---

### ✅ Verification Checklist

After fixing issues, verify:
- [ ] `package.json` exists and has content
- [ ] `node_modules` folder exists after `npm install`
- [ ] `npm run dev` starts without errors
- [ ] Browser shows the app at `http://localhost:3000`
- [ ] Console shows no red errors
- [ ] All pages/routes work
- [ ] PWA features work (if enabled)

---

### 🔗 Quick Links

- **Live Generator:** https://pwa-template-generator.web.app
- **Documentation:** [/docs](https://pwa-template-generator.web.app/docs)
- **Example Project:** Working sample projects available

---

**Need more help?** If these solutions don't work, the issue might be with the generator itself. Try generating a new project with minimal features first to isolate the problem.