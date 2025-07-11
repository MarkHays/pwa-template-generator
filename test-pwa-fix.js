#!/usr/bin/env node

/**
 * PWA Fix Test Script
 * Tests the PWA generation fixes to ensure service worker, icons, and manifest are properly generated
 */

import { DirectProjectGenerator } from "./src/core/DirectProjectGenerator.js";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

class PWAFixTester {
  constructor() {
    this.testDir = "test-pwa-fix-output";
    this.passed = 0;
    this.failed = 0;
  }

  async runTest() {
    console.log(chalk.blue("\n🧪 Testing PWA Fix Implementation\n"));

    try {
      // Clean up any existing test output
      await this.cleanup();

      // Generate test project
      await this.generateTestProject();

      // Verify PWA files
      await this.verifyPWAFiles();

      // Print results
      this.printResults();
    } catch (error) {
      console.error(chalk.red("💥 Test failed with error:"), error.message);
      process.exit(1);
    }
  }

  async cleanup() {
    if (await fs.pathExists(this.testDir)) {
      await fs.remove(this.testDir);
    }
  }

  async generateTestProject() {
    console.log(chalk.yellow("🚀 Generating test PWA project..."));

    const generator = new DirectProjectGenerator({
      outputDir: this.testDir,
      templatesDir: "./templates",
    });

    const config = {
      projectName: "test-pwa-fix",
      businessName: "Test PWA Business",
      description: "Testing PWA fixes for service worker and icons",
      framework: "react",
      industry: "small-business",
      features: ["contact-form", "gallery", "testimonials"],
    };

    await generator.generateProject(config);
    console.log(chalk.green("✅ Test project generated"));
  }

  async verifyPWAFiles() {
    console.log(chalk.yellow("\n🔍 Verifying PWA files..."));

    const checks = [
      // Service Worker
      {
        name: "Service Worker (sw.js)",
        path: "public/sw.js",
        check: (content) =>
          content.includes("Service Worker") && content.includes("CACHE_NAME"),
      },

      // PWA Icons
      {
        name: "Favicon SVG",
        path: "public/favicon.svg",
        check: (content) =>
          content.includes("<svg") && content.includes("text"),
      },
      {
        name: "Icon 192x192",
        path: "public/icon-192.png",
        check: (content) =>
          content.length > 100 &&
          (content.startsWith("PNG") ||
            content.includes("PNG") ||
            content.length > 500),
      },
      {
        name: "Icon 512x512",
        path: "public/icon-512.png",
        check: (content) =>
          content.length > 100 &&
          (content.startsWith("PNG") ||
            content.includes("PNG") ||
            content.length > 500),
      },
      {
        name: "Icon 144x144",
        path: "public/icon-144x144.png",
        check: (content) =>
          content.length > 100 &&
          (content.startsWith("PNG") ||
            content.includes("PNG") ||
            content.length > 500),
      },

      // Manifest
      {
        name: "PWA Manifest",
        path: "public/manifest.json",
        check: (content) => {
          const manifest = JSON.parse(content);
          return manifest.icons && manifest.icons.length >= 4;
        },
      },

      // HTML with PWA meta tags
      {
        name: "HTML with PWA meta tags",
        path: "index.html",
        check: (content) => {
          return (
            content.includes("manifest.json") &&
            content.includes("theme-color") &&
            content.includes("apple-touch-icon")
          );
        },
      },

      // Service Worker Registration
      {
        name: "Service Worker Registration",
        path: "src/main.tsx",
        check: (content) => {
          return (
            content.includes("serviceWorker") &&
            content.includes("navigator.serviceWorker.register")
          );
        },
      },
    ];

    for (const check of checks) {
      await this.runCheck(check);
    }
  }

  async runCheck(check) {
    try {
      const filePath = path.join(this.testDir, check.path);

      if (!(await fs.pathExists(filePath))) {
        this.logFailure(check.name, `File ${check.path} does not exist`);
        return;
      }

      const content = await fs.readFile(filePath, "utf8");

      if (check.check(content)) {
        this.logSuccess(check.name);
      } else {
        this.logFailure(check.name, "Content validation failed");
      }
    } catch (error) {
      this.logFailure(check.name, error.message);
    }
  }

  logSuccess(name) {
    console.log(chalk.green(`   ✅ ${name}`));
    this.passed++;
  }

  logFailure(name, reason) {
    console.log(chalk.red(`   ❌ ${name}: ${reason}`));
    this.failed++;
  }

  printResults() {
    console.log(chalk.blue("\n📊 PWA Fix Test Results:"));
    console.log(chalk.green(`✅ Passed: ${this.passed}`));
    console.log(chalk.red(`❌ Failed: ${this.failed}`));
    console.log(chalk.cyan(`📋 Total: ${this.passed + this.failed}`));

    if (this.failed === 0) {
      console.log(chalk.green.bold("\n🎉 All PWA fixes working correctly!"));
      console.log(
        chalk.yellow("📁 Test project available at:"),
        chalk.cyan(this.testDir),
      );
      console.log(chalk.yellow("\n🚀 You can now run:"));
      console.log(chalk.cyan(`   cd ${this.testDir}`));
      console.log(chalk.cyan("   npm install"));
      console.log(chalk.cyan("   npm run dev"));
    } else {
      console.log(chalk.red.bold("\n💥 Some PWA fixes need attention!"));
      process.exit(1);
    }
  }
}

// Run the test
const tester = new PWAFixTester();
tester.runTest().catch(console.error);
