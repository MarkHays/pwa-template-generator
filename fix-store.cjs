#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing PWA Generator Store for Enhanced Validation...');

const storePath = path.join(__dirname, 'web-app/src/store/PWAGeneratorStore.tsx');

// Read the store file
let storeContent = fs.readFileSync(storePath, 'utf8');

// Fix 1: Replace validation calls to use webGenerator method
storeContent = storeContent.replace(
  /const validationResult = await enhancedProjectValidator\.validateProject\(files, \{[\s\S]*?\}\);/g,
  'const validationResult = await webGenerator.validateGeneratedProject(files, projectConfig);'
);

// Fix 2: Replace the other validation call in validateProject function
storeContent = storeContent.replace(
  /const validationResult = await enhancedProjectValidator\.validateProject\(files, \{\s*files,\s*config,\s*\}\);/g,
  'const validationResult = await webGenerator.validateGeneratedProject(files, config);'
);

// Fix 3: Replace auto-fix calls
storeContent = storeContent.replace(
  /const autoFixResult = await intelligentAutoFixEngine\.autoFix\(/g,
  'const autoFixResult = await webGenerator.autoFixProject('
);

// Fix 4: Make sure webGenerator is available in all functions
const validateProjectFunctionPattern = /const validateProject = async \(files: GeneratedFile\[\], config: any\) => \{/;
if (validateProjectFunctionPattern.test(storeContent)) {
  storeContent = storeContent.replace(
    validateProjectFunctionPattern,
    `const validateProject = async (files: GeneratedFile[], config: any) => {
    const webGenerator = new WebDirectProjectGenerator({ typescript: state.typescript });`
  );
}

const autoFixProjectFunctionPattern = /const autoFixProject = async \(files: GeneratedFile\[\], errors: ValidationError\[\], warnings: ValidationWarning\[\], config: any\) => \{/;
if (autoFixProjectFunctionPattern.test(storeContent)) {
  storeContent = storeContent.replace(
    autoFixProjectFunctionPattern,
    `const autoFixProject = async (files: GeneratedFile[], errors: ValidationError[], warnings: ValidationWarning[], config: any) => {
    const webGenerator = new WebDirectProjectGenerator({ typescript: state.typescript });`
  );
}

// Write the fixed content back
fs.writeFileSync(storePath, storeContent);

console.log('✅ PWA Generator Store fixed successfully!');
console.log('📝 Changes made:');
console.log('  - Updated validation calls to use webGenerator.validateGeneratedProject');
console.log('  - Fixed parameter structure for enhanced validation');
console.log('  - Updated auto-fix calls to use webGenerator.autoFixProject');
console.log('  - Added webGenerator instances where needed');
