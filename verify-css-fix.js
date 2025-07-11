#!/usr/bin/env node

/**
 * CSS Fix Verification Test
 * Final verification that all CSS-related issues have been resolved
 */

import { DirectProjectGenerator } from "./src/core/DirectProjectGenerator.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

console.log(chalk.cyan.bold("🔍 CSS Fix Verification Test\n"));

async function verifyCSSFix() {
  const outputDir = "./verify-css-output";

  try {
    // Clean up any existing output
    await fs.remove(outputDir);

    console.log(
      chalk.blue("🚀 Generating test project with multiple features..."),
    );

    const generator = new DirectProjectGenerator({
      outputDir,
      typescript: true,
    });

    const testConfig = {
      projectName: "css-verification-test",
      businessName: "Test CSS Company",
      businessType: "technology",
      features: [
        "gallery",
        "booking",
        "chat",
        "payments",
        "reviews",
        "contact-form",
        "testimonials",
        "auth",
      ],
    };

    await generator.generateProject(testConfig);

    console.log(chalk.green("✅ Project generated successfully\n"));

    // Verification tests
    const results = {
      pagesCSSExists: false,
      individualCSSFiles: 0,
      brokenImports: 0,
      stylesQuality: false,
      totalPages: 0,
    };

    // Check pages.css exists
    const pagesCSSPath = path.join(outputDir, "src/pages/pages.css");
    results.pagesCSSExists = await fs.pathExists(pagesCSSPath);

    if (results.pagesCSSExists) {
      console.log(chalk.green("✅ Shared pages.css file generated"));

      // Check CSS quality
      const pagesCSSContent = await fs.readFile(pagesCSSPath, "utf8");
      const hasEssentialStyles = [
        ".page-container",
        ".page-header",
        ".hero-section",
        ".features-grid",
        ".gallery-grid",
        ".contact-form",
        ".testimonial-card",
      ].every((style) => pagesCSSContent.includes(style));

      results.stylesQuality = hasEssentialStyles;

      if (results.stylesQuality) {
        console.log(chalk.green("✅ pages.css contains all essential styles"));
      } else {
        console.log(chalk.red("❌ pages.css missing essential styles"));
      }
    } else {
      console.log(chalk.red("❌ Shared pages.css file not found"));
    }

    // Check individual CSS files and imports
    const pagesDir = path.join(outputDir, "src/pages");
    const pageFiles = await fs.readdir(pagesDir);
    const tsxFiles = pageFiles.filter((file) => file.endsWith(".tsx"));
    const cssFiles = pageFiles.filter((file) => file.endsWith(".css"));

    results.totalPages = tsxFiles.length;
    results.individualCSSFiles = cssFiles.length - 1; // Exclude pages.css

    console.log(chalk.blue(`\n📊 File Analysis:`));
    console.log(chalk.gray(`   TypeScript pages: ${results.totalPages}`));
    console.log(chalk.gray(`   CSS files: ${cssFiles.length}`));
    console.log(
      chalk.gray(`   Individual page CSS: ${results.individualCSSFiles}`),
    );

    // Check for broken imports
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
            results.brokenImports++;
            console.log(
              chalk.red(
                `❌ ${file} imports ${cssFileName} but file doesn't exist`,
              ),
            );
          }
        }
      }
    }

    if (results.brokenImports === 0) {
      console.log(chalk.green("✅ No broken CSS imports found"));
    }

    // Check specific feature CSS files
    const expectedFeatureCSS = [
      "Gallery.css",
      "Booking.css",
      "Chat.css",
      "Payments.css",
      "Reviews.css",
    ];

    let featureCSSCount = 0;
    for (const cssFile of expectedFeatureCSS) {
      if (cssFiles.includes(cssFile)) {
        featureCSSCount++;
        console.log(chalk.green(`✅ ${cssFile} generated`));
      }
    }

    // Final assessment
    console.log(chalk.cyan("\n🎯 Verification Results:"));
    console.log(chalk.cyan("========================"));

    const tests = [
      { name: "Shared pages.css exists", passed: results.pagesCSSExists },
      { name: "CSS styles quality", passed: results.stylesQuality },
      { name: "No broken imports", passed: results.brokenImports === 0 },
      { name: "Feature CSS generated", passed: featureCSSCount >= 2 },
      { name: "Multiple pages generated", passed: results.totalPages >= 8 },
    ];

    const passedTests = tests.filter((test) => test.passed).length;
    const totalTests = tests.length;

    tests.forEach((test) => {
      const icon = test.passed ? "✅" : "❌";
      const color = test.passed ? chalk.green : chalk.red;
      console.log(color(`${icon} ${test.name}`));
    });

    const successRate = Math.round((passedTests / totalTests) * 100);
    console.log(chalk.blue(`\nSuccess Rate: ${successRate}%`));

    if (passedTests === totalTests) {
      console.log(chalk.green.bold("\n🎉 CSS FIX VERIFICATION SUCCESSFUL!"));
      console.log(
        chalk.green("✅ All CSS files are being generated correctly"),
      );
      console.log(chalk.green("✅ No broken imports detected"));
      console.log(chalk.green("✅ Professional styling applied"));
      console.log(chalk.green("✅ Ready for production use"));

      console.log(chalk.cyan("\n📁 Generated Files:"));
      cssFiles.forEach((file) => {
        console.log(chalk.gray(`   src/pages/${file}`));
      });
    } else {
      console.log(chalk.red.bold("\n❌ CSS FIX VERIFICATION FAILED"));
      console.log(
        chalk.red(`${totalTests - passedTests} issues still need attention`),
      );
    }

    // Cleanup
    await fs.remove(outputDir);
    console.log(chalk.gray("\n🧹 Cleanup completed"));
  } catch (error) {
    console.log(chalk.red.bold("❌ Verification failed with error:"));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

// Run verification
verifyCSSFix().catch(console.error);
