const path = require('path');
const fs = require('fs');
const { WebDirectProjectGenerator } = require('./web-app/src/utils/WebDirectProjectGenerator.ts');

async function testChatFeature() {
  console.log('🧪 Testing Live Chat Feature Generation...\n');

  const testConfig = {
    businessName: 'Test Chat Business',
    businessType: 'Technology',
    description: 'Testing live chat feature implementation',
    features: [
      'auth',
      'contact-form',
      'gallery',
      'chat',  // This is the key feature we're testing
      'reviews'
    ],
    industry: 'technology',
    colorScheme: 'blue',
    layout: 'modern'
  };

  const outputDir = path.join(__dirname, 'test-chat-output');

  // Clean up previous test output
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  try {
    console.log('📋 Test Configuration:');
    console.log(`- Business: ${testConfig.businessName}`);
    console.log(`- Features: ${testConfig.features.join(', ')}`);
    console.log(`- Output Directory: ${outputDir}\n`);

    // Generate the project
    const generator = new WebDirectProjectGenerator();
    const files = await generator.generateProject(testConfig);

    console.log(`✅ Generated ${files.length} files successfully!\n`);

    // Write files to output directory
    fs.mkdirSync(outputDir, { recursive: true });

    files.forEach(file => {
      const filePath = path.join(outputDir, file.path);
      const fileDir = path.dirname(filePath);

      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      fs.writeFileSync(filePath, file.content);
    });

    console.log('📂 Files written to output directory\n');

    // Check for chat-related files
    console.log('🔍 Checking for Chat Feature Implementation...\n');

    const chatFiles = [
      'src/pages/Chat.tsx',
      'src/pages/Chat.css',
      'src/components/LiveChat.tsx',
      'src/components/ChatWidget.tsx',
      'src/components/ChatMessage.tsx'
    ];

    const foundChatFiles = [];
    const missingChatFiles = [];

    chatFiles.forEach(chatFile => {
      const chatFilePath = path.join(outputDir, chatFile);
      if (fs.existsSync(chatFilePath)) {
        foundChatFiles.push(chatFile);
        console.log(`✅ Found: ${chatFile}`);
      } else {
        missingChatFiles.push(chatFile);
        console.log(`❌ Missing: ${chatFile}`);
      }
    });

    console.log('\n📊 Chat Feature Test Results:');
    console.log(`- Found chat files: ${foundChatFiles.length}`);
    console.log(`- Missing chat files: ${missingChatFiles.length}`);

    // Check if chat feature is mentioned in navigation
    const appFilePath = path.join(outputDir, 'src/App.tsx');
    if (fs.existsSync(appFilePath)) {
      const appContent = fs.readFileSync(appFilePath, 'utf8');
      const hasChatRoute = appContent.includes('chat') || appContent.includes('Chat');
      console.log(`- Chat route in App.tsx: ${hasChatRoute ? '✅' : '❌'}`);
    }

    // Check if chat feature is mentioned in navigation component
    const navFilePath = path.join(outputDir, 'src/components/Navigation.tsx');
    if (fs.existsSync(navFilePath)) {
      const navContent = fs.readFileSync(navFilePath, 'utf8');
      const hasChatNav = navContent.includes('chat') || navContent.includes('Chat');
      console.log(`- Chat link in Navigation: ${hasChatNav ? '✅' : '❌'}`);
    }

    // List all generated files for verification
    console.log('\n📋 All Generated Files:');
    files.forEach(file => {
      console.log(`- ${file.path}`);
    });

    if (missingChatFiles.length > 0) {
      console.log('\n❌ ISSUE CONFIRMED: Live Chat feature is not being generated!');
      console.log('The chat feature is selected but the corresponding files are not created.');
      console.log('\nNext steps:');
      console.log('1. Update determinePagesFromFeatures() to include chat page');
      console.log('2. Update determineComponentsFromFeatures() to include chat components');
      console.log('3. Add generateChatPage() method');
      console.log('4. Add generateChatComponents() method');
      console.log('5. Add chat-specific CSS styling');
    } else {
      console.log('\n✅ SUCCESS: Live Chat feature is properly implemented!');
    }

  } catch (error) {
    console.error('❌ Error during chat feature test:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testChatFeature().catch(console.error);
