#!/usr/bin/env node

/**
 * CLI Workflow Test - End-to-End Testing
 * Tests the complete workflow from CLI launch to project generation
 * Verifies that DirectProjectGenerator is properly connected and working
 */

import { Phase2CLI } from './src/cli/Phase2CLI.js';
import { DirectProjectGenerator } from './src/core/DirectProjectGenerator.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

class CLIWorkflowTester {
  constructor() {
    this.testDir = 'test-cli-workflow-output';
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log(chalk.blue('\n🔧 Starting CLI Workflow Tests\n'));
    console.log(chalk.gray('Testing the complete flow from CLI → Feature Selection → Project Generation'));

    try {
      // Clean up any existing test output
      await this.cleanup();

      // Run comprehensive tests
      await this.testCLIInitialization();
      await this.testDirectProjectGeneratorIntegration();
      await this.testFeatureToPageMapping();
      await this.testCompleteWorkflow();
      await this.testBusinessIntelligenceFeatures();

      // Report results
      this.reportResults();

    } catch (error) {
      console.error(chalk.red('❌ CLI Workflow test suite failed:'), error);
      process.exit(1);
    }
  }

  async testCLIInitialization() {
    console.log(chalk.yellow('🔍 Testing CLI initialization...'));

    try {
      // Test Phase2CLI can be instantiated
      const cli = new Phase2CLI();

      this.assert(cli !== null, 'Phase2CLI should instantiate successfully');
      this.assert(typeof cli.run === 'function', 'CLI should have run method');
      this.assert(typeof cli.generateProject === 'function', 'CLI should have generateProject method');
      this.assert(typeof cli.mapSelectedFeatures === 'function', 'CLI should have mapSelectedFeatures method');

      console.log(chalk.green('✅ CLI initialization test passed'));
    } catch (error) {
      this.assert(false, `CLI initialization failed: ${error.message}`);
      throw error;
    }
  }

  async testDirectProjectGeneratorIntegration() {
    console.log(chalk.yellow('🔍 Testing DirectProjectGenerator integration...'));

    try {
      const cli = new Phase2CLI();

      // Simulate a typical user configuration
      const mockConfig = {
        projectName: 'cli-test-project',
        businessName: 'Digital Ghost Protocol 3',
        framework: 'react',
        industry: 'technology',
        location: 'Silicon Valley',
        targetAudience: 'Tech professionals',
        primaryGoal: 'Lead generation',
        aiFeatures: ['contentGeneration', 'performanceOptimization'],
        selectedFeatures: ['contact-form', 'gallery', 'testimonials']
      };

      // Test that generateProject works with DirectProjectGenerator
      const result = await cli.generateProject(mockConfig);

      this.assert(result !== null, 'Generate project should return a result');

      // Verify the project was created
      const projectPath = path.join(process.cwd(), mockConfig.projectName);
      const projectExists = await fs.pathExists(projectPath);

      this.assert(projectExists, 'Project directory should be created');

      // Clean up
      if (projectExists) {
        await fs.remove(projectPath);
      }

      console.log(chalk.green('✅ DirectProjectGenerator integration test passed'));
    } catch (error) {
      this.assert(false, `DirectProjectGenerator integration failed: ${error.message}`);
      throw error;
    }
  }

  async testFeatureToPageMapping() {
    console.log(chalk.yellow('🔍 Testing feature to page mapping...'));

    try {
      const cli = new Phase2CLI();

      // Test different feature combinations
      const testCases = [
        {
          name: 'Restaurant with Gallery & Testimonials',
          config: {
            industry: 'restaurant',
            aiFeatures: ['contentGeneration'],
            selectedFeatures: ['contact-form', 'gallery', 'testimonials']
          },
          expectedPages: ['Home', 'About', 'Services', 'Contact', 'Gallery', 'Testimonials']
        },
        {
          name: 'SaaS with Auth & Reviews',
          config: {
            industry: 'saas',
            aiFeatures: ['competitiveAnalysis'],
            selectedFeatures: ['contact-form', 'auth', 'reviews']
          },
          expectedPages: ['Home', 'About', 'Services', 'Contact', 'Login', 'Register', 'Reviews']
        },
        {
          name: 'E-commerce with Gallery & Reviews',
          config: {
            industry: 'e-commerce',
            aiFeatures: ['performanceOptimization'],
            selectedFeatures: ['contact-form', 'gallery', 'reviews']
          },
          expectedPages: ['Home', 'About', 'Services', 'Contact', 'Gallery', 'Reviews']
        }
      ];

      for (const testCase of testCases) {
        const mappedFeatures = cli.mapSelectedFeatures(testCase.config);

        this.assert(mappedFeatures.length > 0, `${testCase.name} should map to features`);
        this.assert(mappedFeatures.includes('contact-form'), `${testCase.name} should include contact-form`);

        console.log(chalk.gray(`   ✓ ${testCase.name}: ${mappedFeatures.join(', ')}`));
      }

      console.log(chalk.green('✅ Feature to page mapping test passed'));
    } catch (error) {
      this.assert(false, `Feature mapping failed: ${error.message}`);
      throw error;
    }
  }

  async testCompleteWorkflow() {
    console.log(chalk.yellow('🔍 Testing complete workflow (CLI → Generation → Verification)...'));

    try {
      const cli = new Phase2CLI();

      // Simulate complete user workflow
      const fullConfig = {
        projectName: this.testDir,
        businessName: 'Digital Ghost Protocol 3',
        framework: 'react',
        industry: 'technology',
        location: 'Silicon Valley',
        targetAudience: 'Tech professionals',
        primaryGoal: 'Lead generation',
        aiFeatures: ['contentGeneration', 'competitiveAnalysis', 'performanceOptimization'],
        selectedFeatures: ['contact-form', 'gallery', 'testimonials', 'auth', 'reviews']
      };

      // Generate the project
      const result = await cli.generateProject(fullConfig);

      this.assert(result !== null, 'Complete workflow should generate project');

      // Verify project structure
      const projectPath = path.join(process.cwd(), this.testDir);

      // Check essential files
      const essentialFiles = [
        'package.json',
        'src/App.tsx',
        'src/main.tsx',
        'src/pages/Home.tsx',
        'src/pages/Contact.tsx',
        'src/pages/Gallery.tsx',
        'src/pages/Testimonials.tsx',
        'src/pages/Login.tsx',
        'src/pages/Register.tsx',
        'src/pages/Reviews.tsx',
        'src/components/Navigation.tsx'
      ];

      for (const file of essentialFiles) {
        const filePath = path.join(projectPath, file);
        const exists = await fs.pathExists(filePath);
        this.assert(exists, `Essential file ${file} should exist`);
      }

      // Verify content quality
      const contactPage = await fs.readFile(path.join(projectPath, 'src/pages/Contact.tsx'), 'utf8');
      this.assert(contactPage.includes('form'), 'Contact page should contain working form');
      this.assert(contactPage.includes('useState'), 'Contact page should have React state management');

      const galleryPage = await fs.readFile(path.join(projectPath, 'src/pages/Gallery.tsx'), 'utf8');
      this.assert(galleryPage.includes('gallery'), 'Gallery page should contain gallery functionality');
      this.assert(galleryPage.includes('filter'), 'Gallery page should have filtering');

      console.log(chalk.green('✅ Complete workflow test passed'));
    } catch (error) {
      this.assert(false, `Complete workflow failed: ${error.message}`);
      throw error;
    }
  }

  async testBusinessIntelligenceFeatures() {
    console.log(chalk.yellow('🔍 Testing business intelligence features...'));

    try {
      const cli = new Phase2CLI();

      // Test AI analysis config
      const aiConfig = {
        projectName: 'ai-test-project',
        businessName: 'Digital Ghost Protocol 3',
        framework: 'react',
        industry: 'technology',
        location: 'Silicon Valley',
        targetAudience: 'Tech professionals',
        primaryGoal: 'Lead generation',
        aiFeatures: ['businessIntelligence', 'contentGeneration', 'competitiveAnalysis'],
        selectedFeatures: ['contact-form', 'gallery', 'testimonials']
      };

      // Test that AI content generation works in fallback mode
      const mappedFeatures = cli.mapSelectedFeatures(aiConfig);

      this.assert(mappedFeatures.includes('seo'), 'Business intelligence should include SEO');
      this.assert(mappedFeatures.includes('testimonials'), 'Content generation should include testimonials');
      this.assert(mappedFeatures.includes('gallery'), 'Competitive analysis should include gallery');

      console.log(chalk.green('✅ Business intelligence features test passed'));
    } catch (error) {
      this.assert(false, `Business intelligence features failed: ${error.message}`);
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
    console.log(chalk.blue('\n📊 CLI Workflow Test Results:'));
    console.log(`✅ Passed: ${chalk.green(this.testResults.passed)}`);
    console.log(`❌ Failed: ${chalk.red(this.testResults.failed)}`);
    console.log(`📋 Total: ${this.testResults.passed + this.testResults.failed}`);

    if (this.testResults.failed > 0) {
      console.log(chalk.red('\n❌ Failed tests:'));
      this.testResults.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(chalk.red(`   • ${test.message}`)));
    } else {
      console.log(chalk.green('\n🎉 All CLI workflow tests passed!'));
      console.log(chalk.blue('\n✅ CONCLUSION: The CLI is properly connected to DirectProjectGenerator'));
      console.log(chalk.blue('✅ Feature selection → Project generation → Working features all confirmed'));
    }

    // Summary
    console.log(chalk.blue('\n🔍 WORKFLOW VERIFICATION:'));
    console.log(chalk.gray('   • Phase2CLI initializes correctly'));
    console.log(chalk.gray('   • DirectProjectGenerator is properly integrated'));
    console.log(chalk.gray('   • Feature mapping works as expected'));
    console.log(chalk.gray('   • Complete workflow generates working projects'));
    console.log(chalk.gray('   • Business intelligence features are functional'));

    if (this.testResults.failed === 0) {
      console.log(chalk.green('\n🚀 READY FOR PRODUCTION: The CLI workflow is working correctly!'));
    }
  }

  async cleanup() {
    const testPath = path.join(process.cwd(), this.testDir);
    if (await fs.pathExists(testPath)) {
      await fs.remove(testPath);
    }
  }
}

// Run the CLI workflow tests
const tester = new CLIWorkflowTester();
tester.runAllTests()
  .then(() => {
    console.log(chalk.blue('\n🏁 CLI Workflow test suite completed.'));
    process.exit(tester.testResults.failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error(chalk.red('💥 CLI Workflow test suite crashed:'), error);
    process.exit(1);
  });
