#!/usr/bin/env node

/**
 * Direct Project Generator Test Script
 * Tests the DirectProjectGenerator to verify it works correctly
 * and generates projects with all selected features
 */

import { DirectProjectGenerator } from './src/core/DirectProjectGenerator.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

class DirectGeneratorTester {
  constructor() {
    this.testDir = 'test-direct-generator-output';
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log(chalk.blue('\n🧪 Starting DirectProjectGenerator Tests\n'));

    try {
      // Clean up any existing test output
      await this.cleanup();

      // Run tests
      await this.testBasicGeneration();
      await this.testFeatureMapping();
      await this.testContentGeneration();
      await this.testFileStructure();
      await this.testPageGeneration();

      // Report results
      this.reportResults();

    } catch (error) {
      console.error(chalk.red('❌ Test suite failed:'), error);
      process.exit(1);
    }
  }

  async testBasicGeneration() {
    console.log(chalk.yellow('🔍 Testing basic project generation...'));

    const generator = new DirectProjectGenerator({
      outputDir: this.testDir,
      typescript: true
    });

    const testConfig = {
      projectName: 'test-pwa',
      businessName: 'Test Business',
      framework: 'react',
      features: ['contact-form', 'gallery', 'testimonials'],
      selectedFeatures: ['contact-form', 'gallery', 'testimonials'],
      industry: 'restaurant',
      location: 'San Francisco',
      targetAudience: 'Local diners',
      primaryGoal: 'Increase reservations'
    };

    try {
      const result = await generator.generateProject(testConfig);

      this.assert(result.success, 'Project generation should succeed');
      this.assert(result.framework === 'react', 'Framework should be React');
      this.assert(result.features.length > 0, 'Should have features');
      this.assert(result.pages.length > 0, 'Should have pages');

      console.log(chalk.green('✅ Basic generation test passed'));

      return result;
    } catch (error) {
      this.assert(false, `Basic generation failed: ${error.message}`);
      throw error;
    }
  }

  async testFeatureMapping() {
    console.log(chalk.yellow('🔍 Testing feature mapping...'));

    const generator = new DirectProjectGenerator({
      outputDir: this.testDir,
      typescript: true
    });

    const testConfig = {
      projectName: 'feature-test',
      businessName: 'Feature Test Business',
      framework: 'react',
      features: ['contact-form', 'gallery', 'testimonials', 'auth', 'reviews'],
      selectedFeatures: ['contact-form', 'gallery', 'testimonials', 'auth', 'reviews'],
      industry: 'saas',
      location: 'New York',
      targetAudience: 'Business owners',
      primaryGoal: 'User acquisition'
    };

    try {
      const result = await generator.generateProject(testConfig);

      this.assert(result.features.includes('contact-form'), 'Should include contact form');
      this.assert(result.features.includes('gallery'), 'Should include gallery');
      this.assert(result.features.includes('testimonials'), 'Should include testimonials');

      console.log(chalk.green('✅ Feature mapping test passed'));

      return result;
    } catch (error) {
      this.assert(false, `Feature mapping failed: ${error.message}`);
      throw error;
    }
  }

  async testContentGeneration() {
    console.log(chalk.yellow('🔍 Testing content generation...'));

    const generator = new DirectProjectGenerator({
      outputDir: this.testDir,
      typescript: true
    });

    const testConfig = {
      projectName: 'content-test',
      businessName: 'Digital Ghost Protocol 3',
      framework: 'react',
      features: ['contact-form', 'gallery', 'testimonials'],
      selectedFeatures: ['contact-form', 'gallery', 'testimonials'],
      industry: 'technology',
      location: 'Silicon Valley',
      targetAudience: 'Tech professionals',
      primaryGoal: 'Lead generation'
    };

    try {
      const result = await generator.generateProject(testConfig);

      // Check if files were created
      const outputPath = path.join(process.cwd(), this.testDir);
      const packageJsonExists = await fs.pathExists(path.join(outputPath, 'package.json'));
      const appFileExists = await fs.pathExists(path.join(outputPath, 'src/App.tsx'));

      this.assert(packageJsonExists, 'package.json should be created');
      this.assert(appFileExists, 'App.tsx should be created');

      console.log(chalk.green('✅ Content generation test passed'));

      return result;
    } catch (error) {
      this.assert(false, `Content generation failed: ${error.message}`);
      throw error;
    }
  }

  async testFileStructure() {
    console.log(chalk.yellow('🔍 Testing file structure...'));

    const outputPath = path.join(process.cwd(), this.testDir);

    const expectedFiles = [
      'package.json',
      'src/App.tsx',
      'src/pages/Home.tsx',
      'src/pages/About.tsx',
      'src/pages/Contact.tsx',
      'src/pages/Gallery.tsx',
      'src/pages/Testimonials.tsx',
      'src/components/Navigation.tsx',
      'src/styles/App.scss',
      'public/index.html',
      'public/manifest.json'
    ];

    try {
      for (const file of expectedFiles) {
        const filePath = path.join(outputPath, file);
        const exists = await fs.pathExists(filePath);
        this.assert(exists, `${file} should exist`);
      }

      console.log(chalk.green('✅ File structure test passed'));
    } catch (error) {
      this.assert(false, `File structure test failed: ${error.message}`);
      throw error;
    }
  }

  async testPageGeneration() {
    console.log(chalk.yellow('🔍 Testing page content generation...'));

    const outputPath = path.join(process.cwd(), this.testDir);

    try {
      // Check Contact page has form
      const contactPath = path.join(outputPath, 'src/pages/Contact.tsx');
      const contactContent = await fs.readFile(contactPath, 'utf8');
      this.assert(contactContent.includes('form'), 'Contact page should have a form');
      this.assert(contactContent.includes('input'), 'Contact page should have input fields');

      // Check Gallery page has images
      const galleryPath = path.join(outputPath, 'src/pages/Gallery.tsx');
      const galleryContent = await fs.readFile(galleryPath, 'utf8');
      this.assert(galleryContent.includes('img'), 'Gallery page should have images');

      // Check Testimonials page has reviews
      const testimonialsPath = path.join(outputPath, 'src/pages/Testimonials.tsx');
      const testimonialsContent = await fs.readFile(testimonialsPath, 'utf8');
      this.assert(testimonialsContent.includes('testimonial'), 'Testimonials page should have testimonials');

      console.log(chalk.green('✅ Page generation test passed'));
    } catch (error) {
      this.assert(false, `Page generation test failed: ${error.message}`);
      throw error;
    }
  }

  assert(condition, message) {
    if (condition) {
      this.testResults.passed++;
      this.testResults.tests.push({ status: 'PASS', message });
    } else {
      this.testResults.failed++;
      this.testResults.tests.push({ status: 'FAIL', message });
      console.log(chalk.red(`❌ ${message}`));
    }
  }

  reportResults() {
    console.log(chalk.blue('\n📊 Test Results Summary:'));
    console.log(`✅ Passed: ${chalk.green(this.testResults.passed)}`);
    console.log(`❌ Failed: ${chalk.red(this.testResults.failed)}`);
    console.log(`📋 Total: ${this.testResults.passed + this.testResults.failed}`);

    if (this.testResults.failed > 0) {
      console.log(chalk.red('\n❌ Some tests failed. Details:'));
      this.testResults.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(chalk.red(`   • ${test.message}`)));
    } else {
      console.log(chalk.green('\n🎉 All tests passed! DirectProjectGenerator is working correctly.'));
    }
  }

  async cleanup() {
    const testPath = path.join(process.cwd(), this.testDir);
    if (await fs.pathExists(testPath)) {
      await fs.remove(testPath);
    }
  }
}

// Run the tests
const tester = new DirectGeneratorTester();
tester.runAllTests()
  .then(() => {
    console.log(chalk.blue('\n🏁 Test suite completed.'));
    process.exit(tester.testResults.failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error(chalk.red('💥 Test suite crashed:'), error);
    process.exit(1);
  });
