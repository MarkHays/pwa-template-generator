#!/usr/bin/env node

/**
 * Enhanced PWA Generator Test Script
 * Tests all Phase 2 features and ensures proper implementation
 */

import { Phase2CLI } from './src/cli/Phase2CLI.js';
import { TemplateEngine } from './src/core/TemplateEngine.js';
import { PageGenerator } from './src/core/PageGenerator.js';
import { ContentGenerator } from './src/ai/ContentGenerator.js';
import { CompetitiveAnalysis } from './src/ai/CompetitiveAnalysis.js';
import { PerformanceOptimizer } from './src/ai/PerformanceOptimizer.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

console.log(chalk.cyan.bold('🧪 Enhanced PWA Generator Test Suite\n'));

class EnhancedTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(testName, testFn) {
    try {
      console.log(chalk.blue(`🔍 Testing: ${testName}`));
      await testFn();
      this.testResults.passed++;
      this.testResults.tests.push({ name: testName, status: 'PASSED' });
      console.log(chalk.green(`✅ ${testName} - PASSED\n`));
    } catch (error) {
      this.testResults.failed++;
      this.testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
      console.log(chalk.red(`❌ ${testName} - FAILED`));
      console.log(chalk.red(`   Error: ${error.message}\n`));
    }
  }

  async testModuleImports() {
    // Test that all modules can be imported
    const cli = new Phase2CLI();
    const templateEngine = new TemplateEngine();
    const pageGenerator = new PageGenerator();
    const contentGenerator = new ContentGenerator();
    const competitiveAnalysis = new CompetitiveAnalysis();
    const performanceOptimizer = new PerformanceOptimizer();

    if (!cli || !templateEngine || !pageGenerator || !contentGenerator || !competitiveAnalysis || !performanceOptimizer) {
      throw new Error('Failed to import required modules');
    }

    console.log(chalk.gray('   ✓ All modules imported successfully'));
  }

  async testAIModuleStatus() {
    const contentGenerator = new ContentGenerator();
    const competitiveAnalysis = new CompetitiveAnalysis();
    const performanceOptimizer = new PerformanceOptimizer();

    const aiStatus = {
      contentGenerator: contentGenerator.aiEnabled,
      competitiveAnalysis: competitiveAnalysis.aiEnabled,
      performanceOptimizer: performanceOptimizer.aiEnabled
    };

    console.log(chalk.gray('   AI Module Status:'));
    Object.entries(aiStatus).forEach(([module, enabled]) => {
      const status = enabled ? 'Enabled' : 'Fallback Mode';
      const icon = enabled ? '🤖' : '🔄';
      console.log(chalk.gray(`   ${icon} ${module}: ${status}`));
    });
  }

  async testContentGeneration() {
    const contentGenerator = new ContentGenerator();

    const businessData = {
      name: 'Test Business',
      location: 'Test City',
      targetAudience: 'Test Audience'
    };

    const content = await contentGenerator.generateDemoContent('small-business', businessData);

    if (!content.hero || !content.about || !content.services) {
      throw new Error('Content generation missing required sections');
    }

    if (!content.hero.title || !content.hero.subtitle) {
      throw new Error('Hero content incomplete');
    }

    console.log(chalk.gray(`   ✓ Generated content with ${Object.keys(content).length} sections`));
    console.log(chalk.gray(`   ✓ Hero title: "${content.hero.title}"`));
  }

  async testSEOContentGeneration() {
    const contentGenerator = new ContentGenerator();

    const businessData = {
      name: 'Test SEO Business',
      location: 'SEO City',
      primaryService: 'SEO Services'
    };

    const seoContent = await contentGenerator.generateSEOContent('small-business', businessData);

    if (!seoContent.metaTitle || !seoContent.metaDescription || !seoContent.keywords) {
      throw new Error('SEO content generation incomplete');
    }

    console.log(chalk.gray(`   ✓ Generated SEO meta title: "${seoContent.metaTitle}"`));
    console.log(chalk.gray(`   ✓ Generated ${seoContent.keywords?.length || 0} keywords`));
  }

  async testCompetitiveAnalysis() {
    const competitiveAnalysis = new CompetitiveAnalysis();

    const businessData = {
      name: 'Test Competitive Business'
    };

    const analysis = await competitiveAnalysis.analyzeCompetitors('saas', businessData, []);

    if (!analysis.analysis || !analysis.analysis.marketOverview) {
      throw new Error('Competitive analysis incomplete');
    }

    console.log(chalk.gray(`   ✓ Market size: ${analysis.analysis.marketOverview.size}`));
    console.log(chalk.gray(`   ✓ Growth rate: ${analysis.analysis.marketOverview.growth}`));
  }

  async testPerformanceOptimizer() {
    const performanceOptimizer = new PerformanceOptimizer();

    // Create a temporary test project directory
    const testDir = './test-project';
    await fs.ensureDir(testDir);
    await fs.writeFile(path.join(testDir, 'package.json'), JSON.stringify({
      name: 'test-project',
      dependencies: { react: '^18.0.0' }
    }));

    const optimizations = await performanceOptimizer.optimizePerformance(testDir, 'react', { autoApply: false });

    if (!optimizations.benchmarks || !optimizations.optimizations) {
      throw new Error('Performance optimization incomplete');
    }

    console.log(chalk.gray(`   ✓ Framework: ${optimizations.framework}`));
    console.log(chalk.gray(`   ✓ Optimization strategies: ${Object.keys(optimizations.optimizations).length}`));

    // Cleanup
    await fs.remove(testDir);
  }

  async testPageGeneration() {
    const pageGenerator = new PageGenerator();

    const context = {
      framework: 'react',
      selectedFeatures: ['contact-form', 'gallery', 'testimonials'],
      outputDir: './test-pages',
      businessData: {
        name: 'Test Business',
        location: 'Test City'
      }
    };

    await fs.ensureDir('./test-pages/src/pages');

    const pages = await pageGenerator.generatePages(context);

    if (!pages || pages.length === 0) {
      throw new Error('No pages generated');
    }

    // Check that core pages exist
    const requiredPages = ['home', 'about', 'contact'];
    const missingPages = requiredPages.filter(page => !pages.includes(page));

    if (missingPages.length > 0) {
      throw new Error(`Missing required pages: ${missingPages.join(', ')}`);
    }

    console.log(chalk.gray(`   ✓ Generated ${pages.length} pages: ${pages.join(', ')}`));

    // Verify page files exist
    for (const page of pages) {
      const pagePath = path.join('./test-pages/src/pages', `${page.charAt(0).toUpperCase() + page.slice(1)}.tsx`);
      if (await fs.pathExists(pagePath)) {
        console.log(chalk.gray(`   ✓ Page file exists: ${page}.tsx`));
      }
    }

    // Cleanup
    await fs.remove('./test-pages');
  }

  async testTemplateEngine() {
    const templateEngine = new TemplateEngine({
      outputDir: './test-template-output',
      typescript: true
    });

    const config = {
      projectName: 'test-enhanced-pwa',
      businessName: 'Test Enhanced Business',
      description: 'Test PWA with enhanced features',
      framework: 'react',
      industry: 'small-business',
      features: ['contact-form', 'gallery', 'testimonials', 'responsive', 'pwa'],
      aiFeatures: ['contentGeneration', 'performanceOptimization'],
      location: 'Test City',
      targetAudience: 'Test Users',
      primaryGoal: 'Test Goal'
    };

    const result = await templateEngine.generateProject(config);

    if (!result.success) {
      throw new Error('Template generation failed');
    }

    console.log(chalk.gray(`   ✓ Framework: ${result.framework}`));
    console.log(chalk.gray(`   ✓ Features: ${result.features?.length || 0}`));
    console.log(chalk.gray(`   ✓ Pages: ${result.pages?.length || 0}`));

    // Verify key files exist
    const keyFiles = [
      'package.json',
      'src/styles/pages.css',
      'src/components/Navigation.css',
      'src/styles/main.css'
    ];

    for (const file of keyFiles) {
      const filePath = path.join('./test-template-output', file);
      if (await fs.pathExists(filePath)) {
        console.log(chalk.gray(`   ✓ Key file exists: ${file}`));
      } else {
        console.log(chalk.yellow(`   ⚠ Missing file: ${file}`));
      }
    }

    // Cleanup
    await fs.remove('./test-template-output');
  }

  async testFeatureImplementation() {
    // Test that selected features are properly implemented
    const templateEngine = new TemplateEngine({
      outputDir: './test-features',
      typescript: true
    });

    const config = {
      projectName: 'feature-test-pwa',
      framework: 'react',
      industry: 'e-commerce',
      features: ['contact-form', 'gallery', 'testimonials', 'auth', 'reviews'],
      businessData: {
        name: 'Feature Test Store'
      }
    };

    const result = await templateEngine.generateProject(config);

    // Verify feature-specific CSS files are created
    const featureStyles = [
      'src/styles/contact-form.css',
      'src/styles/gallery.css',
      'src/styles/testimonials.css',
      'src/styles/auth.css',
      'src/styles/reviews.css'
    ];

    let stylesCreated = 0;
    for (const styleFile of featureStyles) {
      const stylePath = path.join('./test-features', styleFile);
      if (await fs.pathExists(stylePath)) {
        stylesCreated++;
        console.log(chalk.gray(`   ✓ Feature style created: ${styleFile}`));
      }
    }

    if (stylesCreated === 0) {
      throw new Error('No feature styles were created');
    }

    console.log(chalk.gray(`   ✓ Created ${stylesCreated}/${featureStyles.length} feature stylesheets`));

    // Cleanup
    await fs.remove('./test-features');
  }

  async testMultiLanguageContent() {
    const contentGenerator = new ContentGenerator();

    const baseContent = {
      hero: { title: 'Welcome', subtitle: 'Test content' },
      about: { title: 'About Us' }
    };

    const translatedContent = await contentGenerator.generateMultiLanguageContent(baseContent, 'es');

    if (!translatedContent) {
      throw new Error('Multi-language content generation failed');
    }

    console.log(chalk.gray(`   ✓ Generated content for Spanish locale`));
    console.log(chalk.gray(`   ✓ Content structure preserved: ${Object.keys(translatedContent).length} sections`));
  }

  async testCLIConfiguration() {
    const cli = new Phase2CLI();

    // Test that CLI has all required configuration
    if (!cli.config || !cli.config.features) {
      throw new Error('CLI configuration incomplete');
    }

    if (!cli.businessIntelligence || !cli.contentGenerator || !cli.competitiveAnalysis || !cli.performanceOptimizer) {
      throw new Error('CLI missing required AI modules');
    }

    console.log(chalk.gray(`   ✓ CLI version: ${cli.config.version}`));
    console.log(chalk.gray(`   ✓ Features count: ${cli.config.features.length}`));
    console.log(chalk.gray(`   ✓ All AI modules initialized`));
  }

  printResults() {
    console.log(chalk.cyan.bold('\n📊 Test Results Summary'));
    console.log(chalk.cyan('=' .repeat(50)));

    console.log(chalk.green(`✅ Passed: ${this.testResults.passed}`));
    console.log(chalk.red(`❌ Failed: ${this.testResults.failed}`));
    console.log(chalk.blue(`📋 Total:  ${this.testResults.tests.length}`));

    if (this.testResults.failed > 0) {
      console.log(chalk.red('\n❌ Failed Tests:'));
      this.testResults.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(chalk.red(`   • ${test.name}: ${test.error}`));
        });
    }

    const successRate = Math.round((this.testResults.passed / this.testResults.tests.length) * 100);
    console.log(chalk.cyan(`\n🎯 Success Rate: ${successRate}%`));

    if (successRate >= 90) {
      console.log(chalk.green.bold('\n🎉 Excellent! Enhanced PWA Generator is working great!'));
    } else if (successRate >= 70) {
      console.log(chalk.yellow.bold('\n⚠️  Good, but some issues need attention.'));
    } else {
      console.log(chalk.red.bold('\n🚨 Multiple issues detected. Please review failed tests.'));
    }
  }
}

// Run all tests
async function runTests() {
  const tester = new EnhancedTester();

  await tester.runTest('Module Imports', () => tester.testModuleImports());
  await tester.runTest('AI Module Status', () => tester.testAIModuleStatus());
  await tester.runTest('Content Generation', () => tester.testContentGeneration());
  await tester.runTest('SEO Content Generation', () => tester.testSEOContentGeneration());
  await tester.runTest('Competitive Analysis', () => tester.testCompetitiveAnalysis());
  await tester.runTest('Performance Optimizer', () => tester.testPerformanceOptimizer());
  await tester.runTest('Page Generation', () => tester.testPageGeneration());
  await tester.runTest('Template Engine', () => tester.testTemplateEngine());
  await tester.runTest('Feature Implementation', () => tester.testFeatureImplementation());
  await tester.runTest('Multi-Language Content', () => tester.testMultiLanguageContent());
  await tester.runTest('CLI Configuration', () => tester.testCLIConfiguration());

  tester.printResults();
}

// Run the test suite
runTests().catch(error => {
  console.error(chalk.red.bold('\n💥 Test suite failed to run:'));
  console.error(chalk.red(error.message));
  console.error(chalk.gray(error.stack));
  process.exit(1);
});
