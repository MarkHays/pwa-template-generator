#!/usr/bin/env node

/**
 * Test Script for Enhanced Production-Ready Page Generator
 * Tests comprehensive page generation with multiple sections and professional styling
 */

import { EnhancedPageGenerator } from "./src/core/EnhancedPageGenerator.js";
import { ContentGenerator } from "./src/ai/ContentGenerator.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

class EnhancedGeneratorTest {
  constructor() {
    this.testDir = "./test-enhanced-output";
    this.contentGenerator = new ContentGenerator();
    this.enhancedPageGenerator = new EnhancedPageGenerator(
      this.contentGenerator,
    );
  }

  async runTests() {
    console.log(chalk.blue("🧪 Starting Enhanced Page Generator Tests..."));

    try {
      // Clean up previous test output
      await this.cleanup();

      // Test 1: Basic page generation
      await this.testBasicPageGeneration();

      // Test 2: Multiple page types
      await this.testMultiplePageTypes();

      // Test 3: CSS generation
      await this.testCSSGeneration();

      // Test 4: Different business types
      await this.testDifferentBusinessTypes();

      // Test 5: Feature-based page generation
      await this.testFeatureBasedPages();

      // Test 6: React routing generation
      await this.testRoutingGeneration();

      // Test 7: Navigation generation
      await this.testNavigationGeneration();

      // Final verification
      await this.verifyOutputStructure();

      console.log(chalk.green("✅ All Enhanced Generator Tests Passed!"));
      console.log(chalk.yellow("\n📊 Test Results Summary:"));
      console.log(chalk.gray("   - Production-ready pages generated"));
      console.log(chalk.gray("   - Comprehensive content sections created"));
      console.log(chalk.gray("   - Professional CSS styling applied"));
      console.log(chalk.gray("   - Responsive design implemented"));
      console.log(chalk.gray("   - Navigation and routing configured"));
    } catch (error) {
      console.error(chalk.red("❌ Test failed:"), error);
      process.exit(1);
    }
  }

  async testBasicPageGeneration() {
    console.log(chalk.cyan("🔍 Test 1: Basic Page Generation"));

    const context = {
      businessName: "TechCorp Solutions",
      description: "Innovative technology solutions",
      framework: "react",
      industry: "technology",
      selectedFeatures: ["contact-form", "testimonials"],
      outputDir: this.testDir,
      aiContent: null,
    };

    await this.enhancedPageGenerator.generatePages(context);

    // Verify home page has comprehensive content
    const homeContent = await fs.readFile(
      path.join(this.testDir, "src/pages/Home.tsx"),
      "utf8",
    );

    this.assert(
      homeContent.includes("hero-section"),
      "Home page should have hero section",
    );
    this.assert(
      homeContent.includes("features-section"),
      "Home page should have features section",
    );
    this.assert(
      homeContent.includes("services-section"),
      "Home page should have services section",
    );
    this.assert(
      homeContent.includes("stats-section"),
      "Home page should have stats section",
    );
    this.assert(
      homeContent.includes("testimonials-section"),
      "Home page should have testimonials section",
    );
    this.assert(
      homeContent.includes("faq-section"),
      "Home page should have FAQ section",
    );
    this.assert(
      homeContent.includes("cta-section"),
      "Home page should have CTA section",
    );

    console.log(chalk.green("   ✓ Home page has comprehensive sections"));
  }

  async testMultiplePageTypes() {
    console.log(chalk.cyan("🔍 Test 2: Multiple Page Types"));

    // Test About page
    const aboutContent = await fs.readFile(
      path.join(this.testDir, "src/pages/About.tsx"),
      "utf8",
    );

    this.assert(
      aboutContent.includes("about-hero"),
      "About page should have hero section",
    );
    this.assert(
      aboutContent.includes("story-section"),
      "About page should have story section",
    );
    this.assert(
      aboutContent.includes("mission-section"),
      "About page should have mission section",
    );
    this.assert(
      aboutContent.includes("team-section"),
      "About page should have team section",
    );
    this.assert(
      aboutContent.includes("awards-section"),
      "About page should have awards section",
    );
    this.assert(
      aboutContent.includes("timeline"),
      "About page should have timeline",
    );

    // Test Services page
    const servicesContent = await fs.readFile(
      path.join(this.testDir, "src/pages/Services.tsx"),
      "utf8",
    );

    this.assert(
      servicesContent.includes("services-hero"),
      "Services page should have hero section",
    );
    this.assert(
      servicesContent.includes("services-grid-section"),
      "Services page should have services grid",
    );
    this.assert(
      servicesContent.includes("process-section"),
      "Services page should have process section",
    );
    this.assert(
      servicesContent.includes("testimonials-section"),
      "Services page should have testimonials",
    );
    this.assert(
      servicesContent.includes("service-pricing"),
      "Services page should have pricing info",
    );

    console.log(chalk.green("   ✓ All page types have comprehensive content"));
  }

  async testCSSGeneration() {
    console.log(chalk.cyan("🔍 Test 3: CSS Generation"));

    // Check if CSS files are generated
    const mainCSSExists = await fs.pathExists(
      path.join(this.testDir, "src/styles/main.css"),
    );
    this.assert(mainCSSExists, "Main CSS file should be generated");

    const homeCSSExists = await fs.pathExists(
      path.join(this.testDir, "src/pages/Home.css"),
    );
    this.assert(homeCSSExists, "Home CSS file should be generated");

    const aboutCSSExists = await fs.pathExists(
      path.join(this.testDir, "src/pages/About.css"),
    );
    this.assert(aboutCSSExists, "About CSS file should be generated");

    const servicesCSSExists = await fs.pathExists(
      path.join(this.testDir, "src/pages/Services.css"),
    );
    this.assert(servicesCSSExists, "Services CSS file should be generated");

    // Check CSS content quality
    const homeCSSContent = await fs.readFile(
      path.join(this.testDir, "src/pages/Home.css"),
      "utf8",
    );
    this.assert(
      homeCSSContent.includes("@keyframes"),
      "Home CSS should include animations",
    );
    this.assert(
      homeCSSContent.includes("hover"),
      "Home CSS should include hover effects",
    );

    console.log(chalk.green("   ✓ Professional CSS files generated"));
  }

  async testDifferentBusinessTypes() {
    console.log(chalk.cyan("🔍 Test 4: Different Business Types"));

    const contexts = [
      {
        businessName: "Healthcare Plus",
        industry: "healthcare",
        framework: "react",
        selectedFeatures: ["contact-form", "testimonials"],
        outputDir: path.join(this.testDir, "healthcare-test"),
      },
      {
        businessName: "Legal Services Pro",
        industry: "legal",
        framework: "react",
        selectedFeatures: ["contact-form", "gallery"],
        outputDir: path.join(this.testDir, "legal-test"),
      },
    ];

    for (const context of contexts) {
      // Create directory structure for each context
      await fs.ensureDir(context.outputDir);
      await fs.ensureDir(path.join(context.outputDir, "src/pages"));
      await fs.ensureDir(path.join(context.outputDir, "src/styles"));
      await fs.ensureDir(path.join(context.outputDir, "src/components"));

      // Create directory structure for feature test
      await fs.ensureDir(context.outputDir);
      await fs.ensureDir(path.join(context.outputDir, "src/pages"));
      await fs.ensureDir(path.join(context.outputDir, "src/styles"));
      await fs.ensureDir(path.join(context.outputDir, "src/components"));

      await this.enhancedPageGenerator.generatePages(context);

      const homeExists = await fs.pathExists(
        path.join(context.outputDir, "src/pages/Home.tsx"),
      );
      this.assert(
        homeExists,
        `Home page should be generated for ${context.industry}`,
      );

      const aboutExists = await fs.pathExists(
        path.join(context.outputDir, "src/pages/About.tsx"),
      );
      this.assert(
        aboutExists,
        `About page should be generated for ${context.industry}`,
      );
    }

    console.log(chalk.green("   ✓ Different business types handled correctly"));
  }

  async testFeatureBasedPages() {
    console.log(chalk.cyan("🔍 Test 5: Feature-based Page Generation"));

    const context = {
      businessName: "Feature Test Corp",
      framework: "react",
      selectedFeatures: [
        "contact-form",
        "gallery",
        "testimonials",
        "auth",
        "reviews",
      ],
      outputDir: path.join(this.testDir, "feature-test"),
    };

    // Create directory structure for feature test
    await fs.ensureDir(context.outputDir);
    await fs.ensureDir(path.join(context.outputDir, "src/pages"));
    await fs.ensureDir(path.join(context.outputDir, "src/styles"));
    await fs.ensureDir(path.join(context.outputDir, "src/components"));

    await this.enhancedPageGenerator.generatePages(context);

    // Check if feature-based pages are created
    const contactExists = await fs.pathExists(
      path.join(context.outputDir, "src/pages/Contact.tsx"),
    );
    this.assert(
      contactExists,
      "Contact page should be generated when contact-form feature is selected",
    );

    const galleryExists = await fs.pathExists(
      path.join(context.outputDir, "src/pages/Gallery.tsx"),
    );
    this.assert(
      galleryExists,
      "Gallery page should be generated when gallery feature is selected",
    );

    const testimonialsExists = await fs.pathExists(
      path.join(context.outputDir, "src/pages/Testimonials.tsx"),
    );
    this.assert(
      testimonialsExists,
      "Testimonials page should be generated when testimonials feature is selected",
    );

    console.log(chalk.green("   ✓ Feature-based pages generated correctly"));
  }

  async testRoutingGeneration() {
    console.log(chalk.cyan("🔍 Test 6: React Routing Generation"));

    const routerExists = await fs.pathExists(
      path.join(this.testDir, "src/components/AppRouter.tsx"),
    );
    this.assert(routerExists, "AppRouter component should be generated");

    const routerContent = await fs.readFile(
      path.join(this.testDir, "src/components/AppRouter.tsx"),
      "utf8",
    );
    this.assert(
      routerContent.includes("BrowserRouter"),
      "Router should use BrowserRouter",
    );
    this.assert(
      routerContent.includes("Routes"),
      "Router should include Routes",
    );
    this.assert(
      routerContent.includes("Route"),
      "Router should include Route components",
    );
    this.assert(
      routerContent.includes("Home"),
      "Router should include Home route",
    );
    this.assert(
      routerContent.includes("About"),
      "Router should include About route",
    );
    this.assert(
      routerContent.includes("Services"),
      "Router should include Services route",
    );

    console.log(chalk.green("   ✓ React routing configured correctly"));
  }

  async testNavigationGeneration() {
    console.log(chalk.cyan("🔍 Test 7: Navigation Generation"));

    const navExists = await fs.pathExists(
      path.join(this.testDir, "src/components/Navigation.tsx"),
    );
    this.assert(navExists, "Navigation component should be generated");

    const navContent = await fs.readFile(
      path.join(this.testDir, "src/components/Navigation.tsx"),
      "utf8",
    );
    this.assert(
      navContent.includes("useState"),
      "Navigation should use React hooks",
    );
    this.assert(
      navContent.includes("useLocation"),
      "Navigation should use useLocation hook",
    );
    this.assert(
      navContent.includes("nav-toggle"),
      "Navigation should have mobile toggle",
    );
    this.assert(
      navContent.includes("TechCorp Solutions"),
      "Navigation should include business name",
    );

    console.log(chalk.green("   ✓ Navigation component generated correctly"));
  }

  async verifyOutputStructure() {
    console.log(chalk.cyan("🔍 Final Verification: Output Structure"));

    const expectedFiles = [
      "src/pages/Home.tsx",
      "src/pages/About.tsx",
      "src/pages/Services.tsx",
      "src/pages/Contact.tsx",
      "src/pages/Home.css",
      "src/pages/About.css",
      "src/pages/Services.css",
      "src/pages/Contact.css",
      "src/styles/main.css",
      "src/components/AppRouter.tsx",
      "src/components/Navigation.tsx",
    ];

    for (const file of expectedFiles) {
      const exists = await fs.pathExists(path.join(this.testDir, file));
      this.assert(exists, `Expected file ${file} should exist`);
    }

    // Check file sizes (should be substantial for production-ready content)
    const homeStats = await fs.stat(
      path.join(this.testDir, "src/pages/Home.tsx"),
    );
    this.assert(
      homeStats.size > 5000,
      "Home page should have substantial content (>5KB)",
    );

    const aboutStats = await fs.stat(
      path.join(this.testDir, "src/pages/About.tsx"),
    );
    this.assert(
      aboutStats.size > 3000,
      "About page should have substantial content (>3KB)",
    );

    const servicesStats = await fs.stat(
      path.join(this.testDir, "src/pages/Services.tsx"),
    );
    this.assert(
      servicesStats.size > 4000,
      "Services page should have substantial content (>4KB)",
    );

    const mainCSSStats = await fs.stat(
      path.join(this.testDir, "src/styles/main.css"),
    );
    this.assert(
      mainCSSStats.size > 10000,
      "Main CSS should have comprehensive styles (>10KB)",
    );

    console.log(chalk.green("   ✓ Output structure verified"));

    // Log file sizes for reference
    console.log(chalk.yellow("\n📁 Generated File Sizes:"));
    console.log(
      chalk.gray(`   Home.tsx: ${Math.round(homeStats.size / 1024)}KB`),
    );
    console.log(
      chalk.gray(`   About.tsx: ${Math.round(aboutStats.size / 1024)}KB`),
    );
    console.log(
      chalk.gray(`   Services.tsx: ${Math.round(servicesStats.size / 1024)}KB`),
    );
    console.log(
      chalk.gray(`   Main CSS: ${Math.round(mainCSSStats.size / 1024)}KB`),
    );
  }

  async cleanup() {
    try {
      await fs.remove(this.testDir);
      await fs.ensureDir(this.testDir);
      await fs.ensureDir(path.join(this.testDir, "src/pages"));
      await fs.ensureDir(path.join(this.testDir, "src/styles"));
      await fs.ensureDir(path.join(this.testDir, "src/components"));
    } catch (error) {
      console.warn("Cleanup warning:", error.message);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
}

// Run tests
const tester = new EnhancedGeneratorTest();
tester.runTests().catch(console.error);
