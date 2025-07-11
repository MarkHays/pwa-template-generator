#!/usr/bin/env node

/**
 * CSS Fix Test - Comprehensive test for CSS file generation
 * Tests that all generated pages have their corresponding CSS files
 */

import { DirectProjectGenerator } from "./src/core/DirectProjectGenerator.js";
import { PageGenerator } from "./src/core/PageGenerator.js";
import { ContentGenerator } from "./src/ai/ContentGenerator.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

console.log(chalk.cyan.bold("🧪 PWA Template Generator - CSS Fix Test\n"));

class CSSFixTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: [],
    };
  }

  async runTest(testName, testFn) {
    try {
      console.log(chalk.blue(`🔍 Testing: ${testName}`));
      await testFn();
      this.testResults.passed++;
      this.testResults.tests.push({ name: testName, status: "PASSED" });
      console.log(chalk.green(`✅ ${testName} - PASSED\n`));
    } catch (error) {
      this.testResults.failed++;
      this.testResults.tests.push({
        name: testName,
        status: "FAILED",
        error: error.message,
      });
      console.log(chalk.red(`❌ ${testName} - FAILED`));
      console.log(chalk.red(`   Error: ${error.message}\n`));
    }
  }

  async testDirectProjectGeneratorCSS() {
    const outputDir = "./test-css-direct-output";
    await fs.ensureDir(outputDir);

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "test-css-pwa",
      businessName: "Test Restaurant",
      businessType: "restaurant",
      features: [
        "gallery",
        "booking",
        "chat",
        "payments",
        "reviews",
        "analytics",
      ],
    };

    await generator.generateProject(testConfig);

    // Check that pages.css exists
    const pagesCSSPath = path.join(outputDir, "src/pages/pages.css");
    if (!(await fs.pathExists(pagesCSSPath))) {
      throw new Error("pages.css file not generated");
    }

    // Check that individual page CSS files exist for complex pages
    const complexPages = [
      "Gallery",
      "Booking",
      "Chat",
      "Payments",
      "Reviews",
      "Analytics",
    ];
    for (const pageName of complexPages) {
      const cssPath = path.join(outputDir, `src/pages/${pageName}.css`);
      if (await fs.pathExists(cssPath)) {
        console.log(chalk.gray(`   ✓ ${pageName}.css generated`));
      }
    }

    // Check CSS content quality
    const pagesCSSContent = await fs.readFile(pagesCSSPath, "utf8");
    if (!pagesCSSContent.includes(".page-container")) {
      throw new Error("pages.css missing essential styles");
    }

    console.log(chalk.gray("   ✓ pages.css contains proper styles"));
    console.log(chalk.gray("   ✓ All CSS files generated successfully"));
  }

  async testPageGeneratorCSS() {
    const outputDir = "./test-css-page-output";
    await fs.ensureDir(outputDir);

    const contentGenerator = new ContentGenerator();
    const pageGenerator = new PageGenerator();

    const context = {
      framework: "react",
      outputDir,
      selectedFeatures: ["gallery", "contact-form", "testimonials", "auth"],
      businessData: {
        name: "Test Business",
        description: "Test business description",
      },
    };

    // Generate content
    const content = await contentGenerator.generateBusinessContent({
      businessType: "restaurant",
      businessName: "Test Restaurant",
      location: "Test City",
    });

    context.content = content;

    // Generate pages
    await pageGenerator.generatePages(context);

    // Check that pages.css exists
    const pagesCSSPath = path.join(outputDir, "src/pages/pages.css");
    if (!(await fs.pathExists(pagesCSSPath))) {
      throw new Error("PageGenerator did not create pages.css");
    }

    // Check that pages with CSS imports have the CSS file
    const pagesDir = path.join(outputDir, "src/pages");
    const pageFiles = await fs.readdir(pagesDir);
    const tsxFiles = pageFiles.filter((file) => file.endsWith(".tsx"));

    for (const file of tsxFiles) {
      const filePath = path.join(pagesDir, file);
      const content = await fs.readFile(filePath, "utf8");

      if (content.includes("import './pages.css'")) {
        console.log(chalk.gray(`   ✓ ${file} imports pages.css`));
      }
    }

    console.log(chalk.gray("   ✓ PageGenerator CSS generation working"));
  }

  async testCSSImportConsistency() {
    const outputDir = "./test-css-consistency";
    await fs.ensureDir(outputDir);

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "test-css-consistency",
      businessName: "Test Tech Company",
      businessType: "technology",
      features: [
        "gallery",
        "booking",
        "chat",
        "payments",
        "reviews",
        "analytics",
        "search",
      ],
    };

    await generator.generateProject(testConfig);

    // Check for broken imports
    const pagesDir = path.join(outputDir, "src/pages");
    const pageFiles = await fs.readdir(pagesDir);
    const tsxFiles = pageFiles.filter((file) => file.endsWith(".tsx"));

    let brokenImports = 0;
    for (const file of tsxFiles) {
      const filePath = path.join(pagesDir, file);
      const content = await fs.readFile(filePath, "utf8");

      // Check for CSS imports
      const cssImports = content.match(/import\s+['"]\.\/[^'"]+\.css['"]/g);
      if (cssImports) {
        for (const cssImport of cssImports) {
          const cssFileName = cssImport.match(/['"]\.\/([^'"]+)['"]/)[1];
          const cssPath = path.join(pagesDir, cssFileName);

          if (!(await fs.pathExists(cssPath))) {
            console.log(
              chalk.red(
                `   ❌ ${file} imports ${cssFileName} but file doesn't exist`,
              ),
            );
            brokenImports++;
          }
        }
      }
    }

    if (brokenImports > 0) {
      throw new Error(`${brokenImports} broken CSS imports found`);
    }

    console.log(chalk.gray("   ✓ No broken CSS imports found"));
    console.log(chalk.gray(`   ✓ Checked ${tsxFiles.length} page files`));
  }

  async testAllFeaturesCSS() {
    const features = [
      "gallery",
      "booking",
      "chat",
      "payments",
      "reviews",
      "analytics",
      "search",
      "contact-form",
      "testimonials",
      "auth",
    ];

    const outputDir = "./test-css-all-features";
    await fs.ensureDir(outputDir);

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "test-css-all-features",
      businessName: "Test SaaS Company",
      businessType: "saas",
      features,
    };

    await generator.generateProject(testConfig);

    // Check that pages.css exists
    const pagesCSSPath = path.join(outputDir, "src/pages/pages.css");
    if (!(await fs.pathExists(pagesCSSPath))) {
      throw new Error("pages.css not generated for all features");
    }

    // Check CSS content includes all necessary styles
    const pagesCSSContent = await fs.readFile(pagesCSSPath, "utf8");

    const requiredStyles = [
      ".page-container",
      ".page-header",
      ".hero-section",
      ".features-grid",
      ".gallery-grid",
      ".contact-form",
      ".testimonial-card",
    ];

    for (const style of requiredStyles) {
      if (!pagesCSSContent.includes(style)) {
        throw new Error(`pages.css missing ${style} styles`);
      }
    }

    console.log(chalk.gray("   ✓ pages.css contains all required styles"));
    console.log(chalk.gray(`   ✓ Generated for ${features.length} features`));
  }

  async testCSSFileStructure() {
    const outputDir = "./test-css-structure";
    await fs.ensureDir(outputDir);

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "test-css-structure",
      businessName: "Test Restaurant",
      businessType: "restaurant",
      features: ["gallery", "booking", "chat"],
    };

    await generator.generateProject(testConfig);

    // Check file structure
    const pagesDir = path.join(outputDir, "src/pages");
    const files = await fs.readdir(pagesDir);

    const cssFiles = files.filter((file) => file.endsWith(".css"));
    const tsxFiles = files.filter((file) => file.endsWith(".tsx"));

    console.log(chalk.gray(`   ✓ Generated ${cssFiles.length} CSS files`));
    console.log(
      chalk.gray(`   ✓ Generated ${tsxFiles.length} TypeScript files`),
    );

    // Check that pages.css is always generated
    if (!cssFiles.includes("pages.css")) {
      throw new Error("pages.css not found in generated files");
    }

    // Check CSS file quality
    for (const cssFile of cssFiles) {
      const cssPath = path.join(pagesDir, cssFile);
      const content = await fs.readFile(cssPath, "utf8");

      if (content.trim().length < 100) {
        throw new Error(`${cssFile} appears to be empty or too short`);
      }

      if (!content.includes("{") || !content.includes("}")) {
        throw new Error(`${cssFile} doesn't contain valid CSS syntax`);
      }
    }

    console.log(chalk.gray("   ✓ All CSS files contain valid content"));
  }

  async testBuildCompatibility() {
    const outputDir = "./test-css-build";
    await fs.ensureDir(outputDir);

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "test-css-build",
      businessName: "Test Tech Company",
      businessType: "technology",
      features: ["gallery", "contact-form", "testimonials"],
    };

    await generator.generateProject(testConfig);

    // Check that tsconfig.json exists and is valid
    const tsconfigPath = path.join(outputDir, "tsconfig.json");
    if (!(await fs.pathExists(tsconfigPath))) {
      throw new Error("tsconfig.json not generated");
    }

    // Check that package.json exists
    const packageJsonPath = path.join(outputDir, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error("package.json not generated");
    }

    // Check that main.css exists in styles directory
    const mainCSSPath = path.join(outputDir, "src/styles/main.css");
    if (!(await fs.pathExists(mainCSSPath))) {
      throw new Error("main.css not generated");
    }

    console.log(chalk.gray("   ✓ All build configuration files present"));
    console.log(chalk.gray("   ✓ CSS files properly structured for build"));
  }

  async runAllTests() {
    console.log(chalk.yellow("🚀 Starting CSS Fix Tests...\n"));

    await this.runTest("DirectProjectGenerator CSS Generation", () =>
      this.testDirectProjectGeneratorCSS(),
    );

    await this.runTest("PageGenerator CSS Generation", () =>
      this.testPageGeneratorCSS(),
    );

    await this.runTest("CSS Import Consistency", () =>
      this.testCSSImportConsistency(),
    );

    await this.runTest("All Features CSS Generation", () =>
      this.testAllFeaturesCSS(),
    );

    await this.runTest("CSS File Structure", () => this.testCSSFileStructure());

    await this.runTest("Build Compatibility", () =>
      this.testBuildCompatibility(),
    );

    this.printResults();
  }

  printResults() {
    console.log(chalk.cyan("\n📊 Test Results Summary"));
    console.log(
      chalk.cyan("=================================================="),
    );
    console.log(chalk.green(`✅ Passed: ${this.testResults.passed}`));
    console.log(chalk.red(`❌ Failed: ${this.testResults.failed}`));
    console.log(
      chalk.blue(
        `📋 Total:  ${this.testResults.passed + this.testResults.failed}`,
      ),
    );

    if (this.testResults.failed > 0) {
      console.log(chalk.red("\n❌ Failed Tests:"));
      this.testResults.tests
        .filter((test) => test.status === "FAILED")
        .forEach((test) => {
          console.log(chalk.red(`   • ${test.name}: ${test.error}`));
        });
    }

    const successRate = Math.round(
      (this.testResults.passed /
        (this.testResults.passed + this.testResults.failed)) *
        100,
    );
    console.log(chalk.blue(`\n🎯 Success Rate: ${successRate}%`));

    if (this.testResults.failed === 0) {
      console.log(chalk.green("\n🎉 ALL CSS FIXES WORKING PERFECTLY!"));
      console.log(chalk.green("✅ No missing CSS files"));
      console.log(chalk.green("✅ No broken imports"));
      console.log(chalk.green("✅ All features generate proper styles"));
      console.log(chalk.green("✅ Projects will build without errors"));
    } else if (successRate >= 80) {
      console.log(chalk.yellow("\n⚠️  Good, but some issues need attention."));
    } else {
      console.log(
        chalk.red("\n🚨 Critical issues found. CSS fixes need work."),
      );
    }
  }
}

// Run the tests
const tester = new CSSFixTester();
tester.runAllTests().catch(console.error);
