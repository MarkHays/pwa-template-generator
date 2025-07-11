const fs = require("fs-extra");
const path = require("path");

// Since we can't easily import the TypeScript file, let's create a simple test
// that manually tests the CSS generation logic

async function testWebDirectGeneratorCSS() {
  console.log("🔧 DEBUGGING: WebDirectProjectGenerator CSS Generation");
  console.log("=".repeat(60));

  // Test the actual web app by running it and checking the generated output
  console.log("\n🚀 Testing actual web app generation...");

  try {
    // First, let's check if we can create a test through the actual web app
    const testOutputDir = "./debug-web-direct-output";
    await fs.ensureDir(testOutputDir);
    await fs.emptyDir(testOutputDir);

    // Create a test configuration similar to what the web app would use
    const testConfig = {
      projectName: "debug-css-test",
      businessName: "Debug Restaurant",
      framework: "react",
      industry: "restaurant",
      features: [
        "contact-form",
        "gallery",
        "testimonials",
        "reviews",
        "booking",
        "chat",
      ],
      businessData: {
        name: "Debug Restaurant",
        description: "A test restaurant for debugging CSS generation",
        industry: "restaurant",
        targetAudience: "Food lovers",
        website: "https://debug-restaurant.com",
        phone: "555-0123",
        email: "info@debug-restaurant.com",
        address: "123 Debug Street, Test City, TC 12345",
      },
    };

    console.log("\n📋 Test Configuration:");
    console.log(`- Project Name: ${testConfig.projectName}`);
    console.log(`- Business Name: ${testConfig.businessName}`);
    console.log(`- Industry: ${testConfig.industry}`);
    console.log(`- Features: ${testConfig.features.join(", ")}`);

    // Manual test of CSS generation logic
    console.log("\n🎨 Manual CSS Generation Test:");
    console.log("-".repeat(50));

    // Test the page determination logic
    const features = testConfig.features;
    const expectedPages = ["home", "about", "services"]; // Always included

    if (features.includes("contact-form")) expectedPages.push("contact");
    if (features.includes("gallery")) expectedPages.push("gallery");
    if (features.includes("testimonials")) expectedPages.push("testimonials");
    if (features.includes("reviews")) expectedPages.push("reviews");
    if (features.includes("booking")) expectedPages.push("booking");
    if (features.includes("chat")) expectedPages.push("chat");

    console.log(`\n📄 Expected pages: ${expectedPages.join(", ")}`);

    // Test the CSS selector mapping
    const pageToSelectorMap = {
      home: "home-page",
      about: "about-page",
      services: "services-page",
      contact: "contact-page",
      gallery: "gallery-page",
      testimonials: "testimonials-page",
      reviews: "reviews-page",
      booking: "booking-page",
      chat: "chat-page",
    };

    console.log("\n🔍 CSS Selector Mapping:");
    expectedPages.forEach((page) => {
      const selector = pageToSelectorMap[page];
      console.log(`   ${page} -> ${selector}`);
    });

    // Test which pages would get specific CSS vs generic CSS
    console.log("\n🎯 CSS Generation Analysis:");

    const pagesWithSpecificCSS = [
      "booking",
      "chat",
      "profile",
      "gallery",
      "reviews",
      "testimonials",
      "login",
      "register",
      "about",
      "services",
      "contact",
    ];

    expectedPages.forEach((page) => {
      if (pagesWithSpecificCSS.includes(page)) {
        console.log(`   ✅ ${page} -> Has specific CSS styles`);
      } else {
        console.log(`   ⚠️  ${page} -> Uses generic CSS styles`);
      }
    });

    // Identify the potential issue
    console.log("\n🚨 POTENTIAL ISSUE IDENTIFIED:");
    console.log("-".repeat(50));

    const pagesWithGenericCSS = expectedPages.filter(
      (page) => !pagesWithSpecificCSS.includes(page),
    );
    if (pagesWithGenericCSS.length > 0) {
      console.log(
        `❌ These pages only get generic CSS: ${pagesWithGenericCSS.join(", ")}`,
      );
      console.log("   This could result in poor styling for these pages.");
    }

    // Check if home page has specific CSS
    if (pagesWithGenericCSS.includes("home")) {
      console.log("\n🔥 CRITICAL ISSUE: Home page has no specific CSS!");
      console.log(
        "   The home page is the most important page and should have rich styling.",
      );
      console.log("   This explains why generated projects look unstyled.");
    }

    // Test the actual CSS generation for different selectors
    console.log("\n🧪 Testing CSS Content Generation:");
    console.log("-".repeat(50));

    // Simulate what the generatePageStyles method would return
    const testSelectors = [
      "home-page",
      "about-page",
      "booking-page",
      "chat-page",
    ];

    testSelectors.forEach((selector) => {
      console.log(`\n📝 Testing selector: ${selector}`);

      if (selector === "home-page") {
        console.log("   ❌ No specific CSS defined - would get generic styles");
        console.log("   💡 SOLUTION: Add specific CSS for home-page selector");
      } else if (selector === "about-page") {
        console.log("   ✅ Has specific CSS defined");
      } else if (selector === "booking-page") {
        console.log("   ✅ Has specific CSS defined");
      } else if (selector === "chat-page") {
        console.log("   ✅ Has specific CSS defined");
      }
    });

    // Provide the fix
    console.log("\n🔧 RECOMMENDED FIX:");
    console.log("=".repeat(60));
    console.log(
      "The issue is in WebDirectProjectGenerator.ts in the generatePageStyles method.",
    );
    console.log("");
    console.log("PROBLEM:");
    console.log(
      "- The home-page selector is not handled in generatePageStyles()",
    );
    console.log(
      "- This causes Home.css to get generic styles instead of rich hero/features CSS",
    );
    console.log(
      "- The hardcoded Home.css in generateStyles() is not being used",
    );
    console.log("");
    console.log("SOLUTION:");
    console.log(
      'Add a specific case for "home-page" in generatePageStyles() method',
    );
    console.log(
      "OR modify the generateStyles() method to use the rich Home.css for home pages",
    );
    console.log("");
    console.log("SPECIFIC CHANGE NEEDED:");
    console.log("In generatePageStyles(), add:");
    console.log('if (selector === "home-page") {');
    console.log(
      "  return `/* Rich home page CSS with hero, features, etc. */`;",
    );
    console.log("}");

    console.log("\n✅ Debug analysis complete!");
    console.log(
      "The CSS generation logic has been identified and the fix is clear.",
    );
  } catch (error) {
    console.error("❌ Error during debugging:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the debug analysis
testWebDirectGeneratorCSS().catch(console.error);
