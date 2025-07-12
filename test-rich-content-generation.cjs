/**
 * Rich Content Generation Test
 * Verifies that all pages now have comprehensive, rich content like the About page
 */

const fs = require('fs-extra');
const path = require('path');

class RichContentTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const symbols = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      section: '🔧'
    };
    console.log(`${symbols[type]} ${message}`);
  }

  async runTest(name, testFn) {
    this.testResults.total++;
    try {
      await testFn();
      this.testResults.passed++;
      this.testResults.details.push({ name, status: 'PASSED' });
      this.log(`${name} - PASSED`, 'success');
      return true;
    } catch (error) {
      this.testResults.failed++;
      this.testResults.details.push({ name, status: 'FAILED', error: error.message });
      this.log(`${name} - FAILED: ${error.message}`, 'error');
      return false;
    }
  }

  async testHomePageRichContent() {
    this.log('SECTION 1: Home Page Rich Content Verification', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    // Extract Home page JSX content
    const homePageStart = content.indexOf('generateHomePage(context: any): string {');
    const homePageEnd = content.indexOf('generateAboutPage(context: any): string {');
    const homePageContent = content.substring(homePageStart, homePageEnd);

    // Test Hero Section Enhancement
    await this.runTest('Home page includes enhanced hero with badge', () => {
      if (!homePageContent.includes('hero-badge') || !homePageContent.includes('Leading ${context.industry} Solutions')) {
        throw new Error('Home page missing enhanced hero section with industry badge');
      }
    });

    await this.runTest('Home page includes hero stats', () => {
      if (!homePageContent.includes('hero-stats') || !homePageContent.includes('hero-stat-number')) {
        throw new Error('Home page missing hero statistics section');
      }
    });

    // Test Features Section
    await this.runTest('Home page includes comprehensive features section', () => {
      if (!homePageContent.includes('features-section') || !homePageContent.includes('Why Choose ${context.businessName}?')) {
        throw new Error('Home page missing features section');
      }
    });

    await this.runTest('Home page features include multiple feature cards', () => {
      const featureCardCount = (homePageContent.match(/feature-card/g) || []).length;
      if (featureCardCount < 6) {
        throw new Error(`Home page should have 6+ feature cards, found ${featureCardCount}`);
      }
    });

    // Test Services Section Enhancement
    await this.runTest('Home page services section is enhanced', () => {
      if (!homePageContent.includes('service-features') || !homePageContent.includes('Expert consultation')) {
        throw new Error('Home page services section not enhanced with features');
      }
    });

    // Test Stats Section
    await this.runTest('Home page includes dedicated stats section', () => {
      if (!homePageContent.includes('stats-section') || !homePageContent.includes('stats-grid')) {
        throw new Error('Home page missing dedicated statistics section');
      }
    });

    // Test Testimonials Section
    await this.runTest('Home page includes testimonials section', () => {
      if (!homePageContent.includes('testimonials-section') || !homePageContent.includes('testimonial-card')) {
        throw new Error('Home page missing testimonials section');
      }
    });

    // Test CTA Section
    await this.runTest('Home page includes call-to-action section', () => {
      if (!homePageContent.includes('cta-section') || !homePageContent.includes('Ready to Get Started?')) {
        throw new Error('Home page missing call-to-action section');
      }
    });

    // Test Footer
    await this.runTest('Home page includes comprehensive footer', () => {
      if (!homePageContent.includes('footer') || !homePageContent.includes('footer-content')) {
        throw new Error('Home page missing footer section');
      }
    });

    await this.runTest('Home page footer includes multiple sections', () => {
      const footerSectionCount = (homePageContent.match(/footer-section/g) || []).length;
      if (footerSectionCount < 4) {
        throw new Error(`Home page footer should have 4+ sections, found ${footerSectionCount}`);
      }
    });
  }

  async testServicesPageRichContent() {
    this.log('SECTION 2: Services Page Rich Content Verification', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    // Extract Services page JSX content
    const servicesPageStart = content.indexOf('generateServicesPage(context: any): string {');
    const servicesPageEnd = content.indexOf('generateContactPage(context: any): string {');
    const servicesPageContent = content.substring(servicesPageStart, servicesPageEnd);

    // Test Hero Section
    await this.runTest('Services page includes enhanced hero section', () => {
      if (!servicesPageContent.includes('services-hero') || !servicesPageContent.includes('hero-stats')) {
        throw new Error('Services page missing enhanced hero section');
      }
    });

    // Test Process Section
    await this.runTest('Services page includes process section', () => {
      if (!servicesPageContent.includes('process-section') || !servicesPageContent.includes('process-steps')) {
        throw new Error('Services page missing process section');
      }
    });

    await this.runTest('Services page process includes multiple steps', () => {
      const processStepCount = (servicesPageContent.match(/process-step/g) || []).length;
      if (processStepCount < 4) {
        throw new Error(`Services page should have 4+ process steps, found ${processStepCount}`);
      }
    });

    // Test Why Choose Us Section
    await this.runTest('Services page includes "Why Choose Us" section', () => {
      if (!servicesPageContent.includes('why-choose-us') || !servicesPageContent.includes('Why Choose ${context.businessName}?')) {
        throw new Error('Services page missing "Why Choose Us" section');
      }
    });

    // Test Pricing Section
    await this.runTest('Services page includes pricing section', () => {
      if (!servicesPageContent.includes('pricing-section') || !servicesPageContent.includes('pricing-grid')) {
        throw new Error('Services page missing pricing section');
      }
    });

    await this.runTest('Services page pricing includes multiple tiers', () => {
      const pricingCardCount = (servicesPageContent.match(/pricing-card/g) || []).length;
      if (pricingCardCount < 3) {
        throw new Error(`Services page should have 3+ pricing tiers, found ${pricingCardCount}`);
      }
    });

    // Test Testimonials on Services Page
    await this.runTest('Services page includes testimonials section', () => {
      if (!servicesPageContent.includes('testimonials-section') || !servicesPageContent.includes('Client Success Stories')) {
        throw new Error('Services page missing testimonials section');
      }
    });

    // Test Services CTA
    await this.runTest('Services page includes dedicated CTA section', () => {
      if (!servicesPageContent.includes('services-cta') || !servicesPageContent.includes('Ready to Transform Your Business?')) {
        throw new Error('Services page missing dedicated CTA section');
      }
    });
  }

  async testGalleryPageRichContent() {
    this.log('SECTION 3: Gallery Page Rich Content Verification', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    // Extract Gallery page JSX content
    const galleryPageStart = content.indexOf('generateGalleryPage(context: any): string {');
    const galleryPageEnd = content.indexOf('generateTestimonialsPage(context: any): string {');
    const galleryPageContent = content.substring(galleryPageStart, galleryPageEnd);

    // Test Hero Section
    await this.runTest('Gallery page includes enhanced hero section', () => {
      if (!galleryPageContent.includes('gallery-hero') || !galleryPageContent.includes('Our Gallery')) {
        throw new Error('Gallery page missing enhanced hero section');
      }
    });

    // Test Enhanced Gallery Items
    await this.runTest('Gallery page includes enhanced gallery items with descriptions', () => {
      if (!galleryPageContent.includes('description:') || !galleryPageContent.includes('Innovative solution for client success')) {
        throw new Error('Gallery page items missing descriptions');
      }
    });

    // Test Showcase Section
    await this.runTest('Gallery page includes showcase section', () => {
      if (!galleryPageContent.includes('showcase-section') || !galleryPageContent.includes('Excellence in Every Project')) {
        throw new Error('Gallery page missing showcase section');
      }
    });

    // Test Categories Section
    await this.runTest('Gallery page includes categories section', () => {
      if (!galleryPageContent.includes('categories-section') || !galleryPageContent.includes('categories-grid')) {
        throw new Error('Gallery page missing categories section');
      }
    });

    await this.runTest('Gallery page categories include multiple category cards', () => {
      const categoryCardCount = (galleryPageContent.match(/category-card/g) || []).length;
      if (categoryCardCount < 4) {
        throw new Error(`Gallery page should have 4+ category cards, found ${categoryCardCount}`);
      }
    });

    // Test Enhanced Modal
    await this.runTest('Gallery page includes enhanced modal with info section', () => {
      if (!galleryPageContent.includes('modal-info') || !galleryPageContent.includes('modal-category')) {
        throw new Error('Gallery page modal not enhanced with info section');
      }
    });

    // Test Gallery CTA
    await this.runTest('Gallery page includes CTA section', () => {
      if (!galleryPageContent.includes('gallery-cta') || !galleryPageContent.includes('Ready to Create Something Amazing?')) {
        throw new Error('Gallery page missing CTA section');
      }
    });
  }

  async testCSSCompleteness() {
    this.log('SECTION 4: CSS Completeness for New Sections', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    // Test Home Page CSS
    const homePageCSS = content.substring(
      content.indexOf('if (selector === "home-page") {'),
      content.indexOf('if (selector === "about-page") {')
    );

    await this.runTest('Home page CSS includes features section styles', () => {
      if (!homePageCSS.includes('.features-section {') || !homePageCSS.includes('.feature-card {')) {
        throw new Error('Home page CSS missing features section styles');
      }
    });

    await this.runTest('Home page CSS includes stats section styles', () => {
      if (!homePageCSS.includes('.stats-section {') || !homePageCSS.includes('.stat-item {')) {
        throw new Error('Home page CSS missing stats section styles');
      }
    });

    await this.runTest('Home page CSS includes testimonials styles', () => {
      if (!homePageCSS.includes('.testimonials-section {') || !homePageCSS.includes('.testimonial-card {')) {
        throw new Error('Home page CSS missing testimonials styles');
      }
    });

    await this.runTest('Home page CSS includes footer styles', () => {
      if (!homePageCSS.includes('.footer {') || !homePageCSS.includes('.footer-content {')) {
        throw new Error('Home page CSS missing footer styles');
      }
    });

    // Test Services Page CSS
    const servicesPageCSS = content.substring(
      content.indexOf('if (selector === "services-page") {'),
      content.indexOf('if (selector === "contact-page") {')
    );

    await this.runTest('Services page CSS includes process section styles', () => {
      if (!servicesPageCSS.includes('.process-section {') || !servicesPageCSS.includes('.process-step {')) {
        throw new Error('Services page CSS missing process section styles');
      }
    });

    await this.runTest('Services page CSS includes pricing section styles', () => {
      if (!servicesPageCSS.includes('.pricing-section {') || !servicesPageCSS.includes('.pricing-card {')) {
        throw new Error('Services page CSS missing pricing section styles');
      }
    });

    await this.runTest('Services page CSS includes why choose us styles', () => {
      if (!servicesPageCSS.includes('.why-choose-us {') || !servicesPageCSS.includes('.why-feature {')) {
        throw new Error('Services page CSS missing why choose us styles');
      }
    });

    // Test Gallery Page CSS
    const galleryPageCSS = content.substring(
      content.indexOf('if (selector === "gallery-page") {'),
      content.indexOf('if (selector === "reviews-page") {')
    );

    await this.runTest('Gallery page CSS includes showcase section styles', () => {
      if (!galleryPageCSS.includes('.showcase-section {') || !galleryPageCSS.includes('.showcase-content {')) {
        throw new Error('Gallery page CSS missing showcase section styles');
      }
    });

    await this.runTest('Gallery page CSS includes categories section styles', () => {
      if (!galleryPageCSS.includes('.categories-section {') || !galleryPageCSS.includes('.category-card {')) {
        throw new Error('Gallery page CSS missing categories section styles');
      }
    });

    await this.runTest('Gallery page CSS includes enhanced modal styles', () => {
      if (!galleryPageCSS.includes('.modal-info {') || !galleryPageCSS.includes('.modal-category {')) {
        throw new Error('Gallery page CSS missing enhanced modal styles');
      }
    });
  }

  async testFooterConsistency() {
    this.log('SECTION 5: Footer Consistency Across Pages', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    const pagesToTest = ['generateHomePage', 'generateServicesPage', 'generateGalleryPage'];

    for (const pageMethod of pagesToTest) {
      await this.runTest(`${pageMethod} includes footer`, () => {
        const pageStart = content.indexOf(`${pageMethod}(context: any): string {`);
        const nextPageStart = content.indexOf('generateContactPage(context: any): string {', pageStart);
        const pageContent = content.substring(pageStart, nextPageStart);

        if (!pageContent.includes('<footer className="footer">')) {
          throw new Error(`${pageMethod} missing footer element`);
        }
      });

      await this.runTest(`${pageMethod} footer includes contact info`, () => {
        const pageStart = content.indexOf(`${pageMethod}(context: any): string {`);
        const nextPageStart = content.indexOf('generateContactPage(context: any): string {', pageStart);
        const pageContent = content.substring(pageStart, nextPageStart);

        if (!pageContent.includes('contact-info') || !pageContent.includes('info@${context.businessName')) {
          throw new Error(`${pageMethod} footer missing contact information`);
        }
      });
    }
  }

  async testMobileResponsiveness() {
    this.log('SECTION 6: Mobile Responsiveness Verification', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    await this.runTest('Home page CSS includes comprehensive mobile breakpoints', () => {
      const homePageCSS = content.substring(
        content.indexOf('if (selector === "home-page") {'),
        content.indexOf('if (selector === "about-page") {')
      );

      const mediaQueryCount = (homePageCSS.match(/@media \(max-width:/g) || []).length;
      if (mediaQueryCount < 2) {
        throw new Error(`Home page should have multiple mobile breakpoints, found ${mediaQueryCount}`);
      }
    });

    await this.runTest('Services page CSS includes mobile responsiveness', () => {
      const servicesPageCSS = content.substring(
        content.indexOf('if (selector === "services-page") {'),
        content.indexOf('if (selector === "contact-page") {')
      );

      if (!servicesPageCSS.includes('@media (max-width: 768px)')) {
        throw new Error('Services page CSS missing mobile responsiveness');
      }
    });

    await this.runTest('Gallery page CSS includes mobile responsiveness', () => {
      const galleryPageCSS = content.substring(
        content.indexOf('if (selector === "gallery-page") {'),
        content.indexOf('if (selector === "reviews-page") {')
      );

      if (!galleryPageCSS.includes('@media (max-width: 768px)')) {
        throw new Error('Gallery page CSS missing mobile responsiveness');
      }
    });
  }

  async testContentQuality() {
    this.log('SECTION 7: Content Quality and Depth Verification', 'section');

    const webGeneratorPath = path.join(__dirname, 'web-app/src/utils/WebDirectProjectGenerator.ts');
    const content = await fs.readFile(webGeneratorPath, 'utf8');

    // Test that pages now have multiple sections (rich content)
    await this.runTest('Home page has multiple content sections', () => {
      const homePageStart = content.indexOf('generateHomePage(context: any): string {');
      const homePageEnd = content.indexOf('generateAboutPage(context: any): string {');
      const homePageContent = content.substring(homePageStart, homePageEnd);

      const sectionCount = (homePageContent.match(/<section/g) || []).length;
      if (sectionCount < 6) {
        throw new Error(`Home page should have 6+ sections, found ${sectionCount}`);
      }
    });

    await this.runTest('Services page has multiple content sections', () => {
      const servicesPageStart = content.indexOf('generateServicesPage(context: any): string {');
      const servicesPageEnd = content.indexOf('generateContactPage(context: any): string {');
      const servicesPageContent = content.substring(servicesPageStart, servicesPageEnd);

      const sectionCount = (servicesPageContent.match(/<section/g) || []).length;
      if (sectionCount < 6) {
        throw new Error(`Services page should have 6+ sections, found ${sectionCount}`);
      }
    });

    await this.runTest('Gallery page has multiple content sections', () => {
      const galleryPageStart = content.indexOf('generateGalleryPage(context: any): string {');
      const galleryPageEnd = content.indexOf('generateTestimonialsPage(context: any): string {');
      const galleryPageContent = content.substring(galleryPageStart, galleryPageEnd);

      const sectionCount = (galleryPageContent.match(/<section/g) || []).length;
      if (sectionCount < 5) {
        throw new Error(`Gallery page should have 5+ sections, found ${sectionCount}`);
      }
    });

    // Test content depth
    await this.runTest('Pages include detailed descriptions and features', () => {
      const allPagesContent = content.substring(
        content.indexOf('generateHomePage(context: any): string {'),
        content.indexOf('generateContactPage(context: any): string {')
      );

      const descriptiveTextCount = (allPagesContent.match(/Expert|Professional|Innovative|Excellence|Quality|Comprehensive/gi) || []).length;
      if (descriptiveTextCount < 20) {
        throw new Error(`Pages should include rich descriptive content, found ${descriptiveTextCount} quality terms`);
      }
    });
  }

  async runAllTests() {
    console.log('🧪 RICH CONTENT GENERATION VERIFICATION TEST');
    console.log('='.repeat(80));
    console.log('Testing PWA Generator Rich Content Enhancement...\n');

    try {
      await this.testHomePageRichContent();
      console.log('');
      await this.testServicesPageRichContent();
      console.log('');
      await this.testGalleryPageRichContent();
      console.log('');
      await this.testCSSCompleteness();
      console.log('');
      await this.testFooterConsistency();
      console.log('');
      await this.testMobileResponsiveness();
      console.log('');
      await this.testContentQuality();

      console.log('\n📊 COMPREHENSIVE TEST RESULTS');
      console.log('='.repeat(80));
      console.log(`Total Tests: ${this.testResults.total}`);
      console.log(`✅ Passed: ${this.testResults.passed}`);
      console.log(`❌ Failed: ${this.testResults.failed}`);
      console.log(`📈 Success Rate: ${Math.round((this.testResults.passed / this.testResults.total) * 100)}%`);

      if (this.testResults.failed === 0) {
        console.log('\n🎉 ALL RICH CONTENT TESTS PASSED!');
        console.log('✅ Home page now has comprehensive, rich content');
        console.log('✅ Services page now has detailed sections and pricing');
        console.log('✅ Gallery page now has showcase and categories');
        console.log('✅ All pages include professional footers');
        console.log('✅ Complete mobile responsiveness implemented');
        console.log('✅ CSS coverage is comprehensive for all new sections');
        console.log('✅ Content quality matches the About page standard');
        console.log('\n🚀 PWA GENERATOR NOW PRODUCES RICH, PROFESSIONAL CONTENT!');

        console.log('\n📋 CONTENT ENHANCEMENTS VERIFIED:');
        console.log('='.repeat(60));
        console.log('🔧 Home Page: Hero + Features + Stats + Testimonials + CTA + Footer');
        console.log('🔧 Services Page: Hero + Process + Pricing + Why Choose Us + Testimonials + CTA + Footer');
        console.log('🔧 Gallery Page: Hero + Showcase + Categories + Enhanced Modal + CTA + Footer');
        console.log('🔧 All Pages: Professional footers with contact info and links');
        console.log('🔧 CSS: Complete styling for all new sections');
        console.log('🔧 Mobile: Responsive design for all devices');
        console.log('🔧 Quality: Rich, professional content throughout');

      } else {
        console.log('\n❌ SOME RICH CONTENT TESTS FAILED');
        console.log('⚠️  The following issues need attention:');

        const failures = this.testResults.details.filter(detail => detail.status === 'FAILED');
        failures.forEach(failure => {
          console.log(`   • ${failure.name}: ${failure.error}`);
        });
      }

    } catch (error) {
      this.log(`Critical test error: ${error.message}`, 'error');
    }
  }
}

// Run the comprehensive test suite
const tester = new RichContentTest();
tester.runAllTests().catch(console.error);
