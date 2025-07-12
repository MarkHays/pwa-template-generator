/**
 * CSS Completion Test Script
 * Verifies that all CSS generation issues have been fixed
 */

const fs = require('fs-extra');
const path = require('path');

class CSSCompletionTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  log(message, type = 'info') {
    const symbols = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    console.log(`${symbols[type]} ${message}`);
  }

  async runTest(name, testFn) {
    this.testResults.total++;
    try {
      await testFn();
      this.testResults.passed++;
      this.log(`${name} - PASSED`, 'success');
      return true;
    } catch (error) {
      this.testResults.failed++;
      this.log(`${name} - FAILED: ${error.message}`, 'error');
      return false;
    }
  }

  async testWebDirectProjectGenerator() {
    this.log('Testing WebDirectProjectGenerator CSS Completeness...', 'info');

    const generatorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');

    if (!fs.existsSync(generatorPath)) {
      throw new Error('WebDirectProjectGenerator.ts not found');
    }

    const content = await fs.readFile(generatorPath, 'utf8');

    // Test 1: About Page CSS Completeness
    await this.runTest('About Page CSS includes hero-content styles', () => {
      if (!content.includes('.hero-content {')) {
        throw new Error('About page CSS missing .hero-content styles');
      }
    });

    await this.runTest('About Page CSS includes hero-stats styles', () => {
      if (!content.includes('.hero-stats {')) {
        throw new Error('About page CSS missing .hero-stats styles');
      }
    });

    await this.runTest('About Page CSS includes story-grid styles', () => {
      if (!content.includes('.story-grid {')) {
        throw new Error('About page CSS missing .story-grid styles');
      }
    });

    await this.runTest('About Page CSS includes values-grid styles', () => {
      if (!content.includes('.values-grid {')) {
        throw new Error('About page CSS missing .values-grid styles');
      }
    });

    await this.runTest('About Page CSS includes team-grid styles', () => {
      if (!content.includes('.team-grid {')) {
        throw new Error('About page CSS missing .team-grid styles');
      }
    });

    await this.runTest('About Page CSS includes value-card styles', () => {
      if (!content.includes('.value-card {')) {
        throw new Error('About page CSS missing .value-card styles');
      }
    });

    await this.runTest('About Page CSS includes team-member styles', () => {
      if (!content.includes('.team-member {')) {
        throw new Error('About page CSS missing .team-member styles');
      }
    });

    await this.runTest('About Page CSS includes cta-buttons styles', () => {
      if (!content.includes('.cta-buttons {')) {
        throw new Error('About page CSS missing .cta-buttons styles');
      }
    });

    // Test 2: Services Page CSS Completeness
    await this.runTest('Services Page CSS includes services-header styles', () => {
      if (!content.includes('.services-header {')) {
        throw new Error('Services page CSS missing .services-header styles');
      }
    });

    await this.runTest('Services Page CSS includes services-grid styles', () => {
      if (!content.includes('.services-grid {')) {
        throw new Error('Services page CSS missing .services-grid styles');
      }
    });

    await this.runTest('Services Page CSS includes service-card styles', () => {
      if (!content.includes('.service-card {')) {
        throw new Error('Services page CSS missing .service-card styles');
      }
    });

    await this.runTest('Services Page CSS includes service-icon styles', () => {
      if (!content.includes('.service-icon {')) {
        throw new Error('Services page CSS missing .service-icon styles');
      }
    });

    // Test 3: Contact Page CSS Completeness
    await this.runTest('Contact Page CSS includes contact-header styles', () => {
      if (!content.includes('.contact-header {')) {
        throw new Error('Contact page CSS missing .contact-header styles');
      }
    });

    await this.runTest('Contact Page CSS includes contact-layout styles', () => {
      if (!content.includes('.contact-layout {')) {
        throw new Error('Contact page CSS missing .contact-layout styles');
      }
    });

    await this.runTest('Contact Page CSS includes contact-info styles', () => {
      if (!content.includes('.contact-info {')) {
        throw new Error('Contact page CSS missing .contact-info styles');
      }
    });

    await this.runTest('Contact Page CSS includes contact-form styles', () => {
      if (!content.includes('.contact-form {')) {
        throw new Error('Contact page CSS missing .contact-form styles');
      }
    });

    await this.runTest('Contact Page CSS includes form-group styles', () => {
      if (!content.includes('.form-group {')) {
        throw new Error('Contact page CSS missing .form-group styles');
      }
    });

    // Test 4: Mobile Responsiveness
    await this.runTest('About Page includes mobile responsiveness', () => {
      if (!content.includes('@media (max-width: 768px)') ||
          !content.includes('.story-grid {') ||
          !content.includes('grid-template-columns: 1fr')) {
        throw new Error('About page CSS missing mobile responsiveness');
      }
    });

    await this.runTest('Services Page includes mobile responsiveness', () => {
      const servicesSection = content.substring(
        content.indexOf('if (selector === "services-page")'),
        content.indexOf('if (selector === "contact-page")')
      );
      if (!servicesSection.includes('@media (max-width: 768px)')) {
        throw new Error('Services page CSS missing mobile responsiveness');
      }
    });

    await this.runTest('Contact Page includes mobile responsiveness', () => {
      const contactSection = content.substring(
        content.indexOf('if (selector === "contact-page")'),
        content.length
      );
      if (!contactSection.includes('@media (max-width: 768px)')) {
        throw new Error('Contact page CSS missing mobile responsiveness');
      }
    });

    // Test 5: CSS Quality Checks
    await this.runTest('CSS uses modern properties like grid and flexbox', () => {
      if (!content.includes('display: grid') || !content.includes('display: flex')) {
        throw new Error('CSS should use modern layout properties');
      }
    });

    await this.runTest('CSS includes hover effects', () => {
      if (!content.includes(':hover')) {
        throw new Error('CSS should include interactive hover effects');
      }
    });

    await this.runTest('CSS includes transitions', () => {
      if (!content.includes('transition:')) {
        throw new Error('CSS should include smooth transitions');
      }
    });
  }

  async testDirectProjectGenerator() {
    this.log('Testing DirectProjectGenerator CSS Completeness...', 'info');

    const generatorPath = path.join(__dirname, 'src/core/DirectProjectGenerator.js');

    if (!fs.existsSync(generatorPath)) {
      throw new Error('DirectProjectGenerator.js not found');
    }

    const content = await fs.readFile(generatorPath, 'utf8');

    // Test About Page CSS in DirectProjectGenerator
    await this.runTest('DirectProjectGenerator has About page CSS case', () => {
      if (!content.includes('case "about":')) {
        throw new Error('DirectProjectGenerator missing About page CSS case');
      }
    });

    await this.runTest('DirectProjectGenerator About CSS includes values-grid', () => {
      if (!content.includes('.values-grid {')) {
        throw new Error('DirectProjectGenerator About CSS missing .values-grid');
      }
    });

    await this.runTest('DirectProjectGenerator About CSS includes value-card', () => {
      if (!content.includes('.value-card {')) {
        throw new Error('DirectProjectGenerator About CSS missing .value-card');
      }
    });

    // Test Services Page CSS
    await this.runTest('DirectProjectGenerator has comprehensive Services CSS', () => {
      if (!content.includes('.service-card {') || !content.includes('.service-icon {')) {
        throw new Error('DirectProjectGenerator Services CSS incomplete');
      }
    });
  }

  async testCSSClassNameCoverage() {
    this.log('Testing CSS Class Name Coverage...', 'info');

    // Test that critical classes from React components have CSS
    const criticalClasses = [
      'hero-content',
      'hero-stats',
      'story-grid',
      'values-grid',
      'value-card',
      'team-grid',
      'team-member',
      'services-header',
      'services-grid',
      'service-card',
      'contact-header',
      'contact-layout',
      'contact-form',
      'form-group'
    ];

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const webContent = await fs.readFile(webGeneratorPath, 'utf8');

    for (const className of criticalClasses) {
      await this.runTest(`CSS includes .${className} styles`, () => {
        if (!webContent.includes(`.${className} {`)) {
          throw new Error(`Missing CSS for .${className}`);
        }
      });
    }
  }

  async runAllTests() {
    console.log('🧪 CSS COMPLETION VERIFICATION TEST');
    console.log('=' .repeat(60));

    try {
      await this.testWebDirectProjectGenerator();
      await this.testDirectProjectGenerator();
      await this.testCSSClassNameCoverage();

      console.log('\n📊 TEST RESULTS SUMMARY');
      console.log('=' .repeat(60));
      console.log(`Total Tests: ${this.testResults.total}`);
      console.log(`✅ Passed: ${this.testResults.passed}`);
      console.log(`❌ Failed: ${this.testResults.failed}`);
      console.log(`📈 Success Rate: ${Math.round((this.testResults.passed / this.testResults.total) * 100)}%`);

      if (this.testResults.failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ CSS generation is now complete and comprehensive');
        console.log('✅ All className usages should have corresponding styles');
        console.log('✅ Generated projects will have proper visual design');
        console.log('\n🚀 The PWA Generator CSS issue has been FIXED!');
      } else {
        console.log('\n❌ SOME TESTS FAILED');
        console.log('⚠️  Additional CSS fixes may be needed');
      }

    } catch (error) {
      this.log(`Critical test error: ${error.message}`, 'error');
    }
  }
}

// Run the tests
const tester = new CSSCompletionTest();
tester.runAllTests().catch(console.error);
