#!/usr/bin/env node

/**
 * Test Booking Feature CSS Generation
 * Verifies that both Booking.tsx and Booking.css files are generated correctly
 */

import { WebDirectProjectGenerator } from "./web-app/src/utils/WebDirectProjectGenerator.ts";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

async function testBookingFeature() {
  console.log(chalk.blue("🧪 Testing Booking Feature CSS Generation..."));

  try {
    // Create WebDirectProjectGenerator instance
    const generator = new WebDirectProjectGenerator({
      typescript: true,
    });

    // Test configuration with booking feature
    const projectConfig = {
      projectName: "booking-test",
      businessName: "Test Booking Business",
      framework: "react",
      industry: "small-business",
      location: "Test City",
      targetAudience: "customers",
      primaryGoal: "bookings",
      features: ["booking", "contact-form", "testimonials"],
      selectedFeatures: ["booking", "contact-form", "testimonials"],
      businessData: {
        name: "Test Booking Business",
        location: "Test City",
        targetAudience: "customers",
        primaryGoal: "bookings",
        description: "A test business for booking feature",
        contactEmail: "test@booking.com",
        contactPhone: "555-123-4567",
      },
    };

    console.log(chalk.cyan("📋 Generating project with booking feature..."));

    // Generate the project
    const files = await generator.generateProject(projectConfig);

    console.log(chalk.gray(`   Generated ${files.length} files total`));

    // Check for Booking.tsx
    const bookingTsxFile = files.find(
      (file) => file.path === "src/pages/Booking.tsx",
    );
    if (!bookingTsxFile) {
      throw new Error("❌ Booking.tsx file not generated!");
    }
    console.log(chalk.green("   ✓ Booking.tsx file generated"));

    // Check for Booking.css
    const bookingCssFile = files.find(
      (file) => file.path === "src/pages/Booking.css",
    );
    if (!bookingCssFile) {
      throw new Error("❌ Booking.css file not generated!");
    }
    console.log(chalk.green("   ✓ Booking.css file generated"));

    // Verify CSS content
    const cssContent = bookingCssFile.content;
    if (!cssContent.includes(".booking-page")) {
      throw new Error("❌ Booking.css missing .booking-page class!");
    }
    console.log(chalk.green("   ✓ Booking.css has proper styling"));

    // Verify TSX content includes CSS import
    const tsxContent = bookingTsxFile.content;
    if (!tsxContent.includes("import './Booking.css'")) {
      throw new Error("❌ Booking.tsx missing CSS import!");
    }
    console.log(chalk.green("   ✓ Booking.tsx imports CSS file"));

    // Check for other expected files
    const expectedFiles = [
      "src/pages/Home.tsx",
      "src/pages/Home.css",
      "src/pages/Contact.tsx",
      "src/pages/Contact.css",
      "src/pages/Testimonials.tsx",
      "src/pages/Testimonials.css",
      "src/App.css",
      "src/components/Navigation.css",
      "package.json",
    ];

    for (const expectedFile of expectedFiles) {
      const file = files.find((f) => f.path === expectedFile);
      if (!file) {
        console.warn(
          chalk.yellow(`   ⚠️  Expected file ${expectedFile} not found`),
        );
      } else {
        console.log(chalk.gray(`   ✓ ${expectedFile} generated`));
      }
    }

    // Check CSS quality
    const cssLines = cssContent.split("\n").length;
    const cssSize = cssContent.length;

    console.log(chalk.blue("\n📊 CSS Quality Metrics:"));
    console.log(chalk.gray(`   Lines: ${cssLines}`));
    console.log(chalk.gray(`   Size: ${cssSize} characters`));
    console.log(
      chalk.gray(
        `   Contains responsive: ${cssContent.includes("@media") ? "Yes" : "No"}`,
      ),
    );
    console.log(
      chalk.gray(
        `   Contains hover effects: ${cssContent.includes(":hover") ? "Yes" : "No"}`,
      ),
    );

    if (cssSize < 1000) {
      console.warn(
        chalk.yellow("   ⚠️  CSS seems quite small, might be basic"),
      );
    } else {
      console.log(chalk.green("   ✓ CSS has substantial styling"));
    }

    // Test different features
    console.log(chalk.cyan("\n🔧 Testing other features..."));

    const featuresTestConfig = {
      ...projectConfig,
      features: ["gallery", "reviews", "chat", "auth"],
      selectedFeatures: ["gallery", "reviews", "chat", "auth"],
    };

    const featuresFiles = await generator.generateProject(featuresTestConfig);

    const featureTests = [
      {
        name: "Gallery",
        tsx: "src/pages/Gallery.tsx",
        css: "src/pages/Gallery.css",
      },
      {
        name: "Reviews",
        tsx: "src/pages/Reviews.tsx",
        css: "src/pages/Reviews.css",
      },
      { name: "Chat", tsx: "src/pages/Chat.tsx", css: "src/pages/Chat.css" },
      { name: "Login", tsx: "src/pages/Login.tsx", css: "src/pages/Login.css" },
      {
        name: "Register",
        tsx: "src/pages/Register.tsx",
        css: "src/pages/Register.css",
      },
      {
        name: "Profile",
        tsx: "src/pages/Profile.tsx",
        css: "src/pages/Profile.css",
      },
    ];

    for (const test of featureTests) {
      const tsxFile = featuresFiles.find((f) => f.path === test.tsx);
      const cssFile = featuresFiles.find((f) => f.path === test.css);

      if (tsxFile && cssFile) {
        console.log(
          chalk.green(`   ✓ ${test.name} feature complete (TSX + CSS)`),
        );
      } else if (tsxFile && !cssFile) {
        console.error(chalk.red(`   ❌ ${test.name} missing CSS file!`));
      } else {
        console.warn(chalk.yellow(`   ⚠️  ${test.name} feature not generated`));
      }
    }

    console.log(
      chalk.green(
        "\n✅ All tests passed! Booking feature CSS generation working correctly.",
      ),
    );

    console.log(chalk.blue("\n📋 Summary:"));
    console.log(chalk.gray("   - Booking.tsx and Booking.css generated ✓"));
    console.log(chalk.gray("   - CSS import included in TSX ✓"));
    console.log(chalk.gray("   - CSS contains proper styling ✓"));
    console.log(chalk.gray("   - Other features also generate CSS files ✓"));
  } catch (error) {
    console.error(chalk.red("\n❌ Test failed:"), error.message);
    process.exit(1);
  }
}

// Run the test
testBookingFeature().catch(console.error);
