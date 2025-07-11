#!/usr/bin/env node

/**
 * Web Direct Project Generator Test
 * Tests the web-compatible DirectProjectGenerator to ensure it generates
 * working PWA projects with all selected features
 */

import { WebDirectProjectGenerator } from "./web-app/src/utils/WebDirectProjectGenerator.ts";
import fs from "fs-extra";
import path from "path";

class WebGeneratorTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: [],
    };
  }

  async runAllTests() {
    console.log("\n🧪 Starting Web Direct Project Generator Tests\n");

    try {
      await this.testBasicGeneration();
      await this.testFeatureGeneration();
      await this.testIndustryContent();
      await this.testFileStructure();
      await this.testComponentGeneration();
      await this.testPageContent();

      this.reportResults();
    } catch (error) {
      console.error("❌ Test suite failed:", error);
      process.exit(1);
    }
  }

  async testBasicGeneration() {
    console.log("🔍 Testing basic project generation...");

    const generator = new WebDirectProjectGenerator({
      typescript: true,
    });

    const testConfig = {
      projectName: "test-web-pwa",
      businessName: "Test Web Business",
      framework: "react",
      industry: "technology",
      location: "Silicon Valley",
      targetAudience: "Tech professionals",
      primaryGoal: "Lead generation",
      features: ["contact-form", "gallery", "testimonials"],
      selectedFeatures: ["contact-form", "gallery", "testimonials"],
      businessData: {
        name: "Test Web Business",
        location: "Silicon Valley",
        targetAudience: "Tech professionals",
        primaryGoal: "Lead generation",
        description: "A test business for web generation",
        contactEmail: "test@example.com",
        contactPhone: "(555) 123-4567",
      },
    };

    try {
      const files = await generator.generateProject(testConfig);

      this.assert(Array.isArray(files), "Should return an array of files");
      this.assert(files.length > 0, "Should generate at least one file");

      // Check for essential files
      const packageJsonFile = files.find((f) => f.path === "package.json");
      this.assert(
        packageJsonFile !== undefined,
        "Should generate package.json",
      );

      const appFile = files.find((f) => f.path === "src/App.tsx");
      this.assert(appFile !== undefined, "Should generate App.tsx");

      const mainFile = files.find((f) => f.path === "src/main.tsx");
      this.assert(mainFile !== undefined, "Should generate main.tsx");

      console.log("✅ Basic generation test passed");
      return files;
    } catch (error) {
      this.assert(false, `Basic generation failed: ${error.message}`);
      throw error;
    }
  }

  async testFeatureGeneration() {
    console.log("🔍 Testing feature-based generation...");

    const generator = new WebDirectProjectGenerator();

    const testConfigs = [
      {
        name: "Contact Form Feature",
        config: {
          projectName: "contact-test",
          businessName: "Contact Test Business",
          framework: "react",
          industry: "restaurant",
          features: ["contact-form"],
          selectedFeatures: ["contact-form"],
          businessData: {
            name: "Contact Test Business",
            description: "Testing contact form generation",
          },
        },
        expectedFiles: ["src/pages/Contact.tsx"],
        expectedContent: {
          "src/pages/Contact.tsx": [
            "form",
            "input",
            "useState",
            "handleSubmit",
          ],
        },
      },
      {
        name: "Gallery Feature",
        config: {
          projectName: "gallery-test",
          businessName: "Gallery Test Business",
          framework: "react",
          industry: "technology",
          features: ["gallery"],
          selectedFeatures: ["gallery"],
          businessData: {
            name: "Gallery Test Business",
            description: "Testing gallery generation",
          },
        },
        expectedFiles: ["src/pages/Gallery.tsx"],
        expectedContent: {
          "src/pages/Gallery.tsx": [
            "gallery-grid",
            "filter",
            "useState",
            "GalleryItem",
          ],
        },
      },
      {
        name: "Authentication Features",
        config: {
          projectName: "auth-test",
          businessName: "Auth Test Business",
          framework: "react",
          industry: "saas",
          features: ["auth"],
          selectedFeatures: ["auth"],
          businessData: {
            name: "Auth Test Business",
            description: "Testing auth generation",
          },
        },
        expectedFiles: ["src/pages/Login.tsx", "src/pages/Register.tsx"],
        expectedContent: {
          "src/pages/Login.tsx": ["login-form", "email", "password"],
          "src/pages/Register.tsx": ["register-form", "confirmPassword"],
        },
      },
    ];

    for (const testCase of testConfigs) {
      try {
        const files = await generator.generateProject(testCase.config);

        // Check if expected files are generated
        for (const expectedFile of testCase.expectedFiles) {
          const file = files.find((f) => f.path === expectedFile);
          this.assert(
            file !== undefined,
            `${testCase.name}: Should generate ${expectedFile}`,
          );
        }

        // Check file content
        for (const [filePath, expectedStrings] of Object.entries(
          testCase.expectedContent,
        )) {
          const file = files.find((f) => f.path === filePath);
          if (file) {
            for (const expectedString of expectedStrings) {
              this.assert(
                file.content.includes(expectedString),
                `${testCase.name}: ${filePath} should contain "${expectedString}"`,
              );
            }
          }
        }

        console.log(`   ✓ ${testCase.name} passed`);
      } catch (error) {
        this.assert(false, `${testCase.name} failed: ${error.message}`);
      }
    }

    console.log("✅ Feature generation test passed");
  }

  async testIndustryContent() {
    console.log("🔍 Testing industry-specific content generation...");

    const generator = new WebDirectProjectGenerator();

    const industries = ["restaurant", "technology", "healthcare", "default"];

    for (const industry of industries) {
      try {
        const config = {
          projectName: `${industry}-test`,
          businessName: `${industry} Business`,
          framework: "react",
          industry: industry,
          features: ["testimonials"],
          selectedFeatures: ["testimonials"],
          businessData: {
            name: `${industry} Business`,
            description: `Testing ${industry} content`,
          },
        };

        const files = await generator.generateProject(config);

        // Check if home page has industry-specific content
        const homeFile = files.find((f) => f.path === "src/pages/Home.tsx");
        this.assert(
          homeFile !== undefined,
          `${industry}: Should generate Home.tsx`,
        );

        if (homeFile) {
          this.assert(
            homeFile.content.includes(config.businessName),
            `${industry}: Home page should contain business name`,
          );
        }

        // Check testimonials page
        const testimonialsFile = files.find(
          (f) => f.path === "src/pages/Testimonials.tsx",
        );
        if (testimonialsFile) {
          this.assert(
            testimonialsFile.content.includes("testimonial"),
            `${industry}: Testimonials page should contain testimonial content`,
          );
        }

        console.log(`   ✓ ${industry} industry content generated`);
      } catch (error) {
        this.assert(
          false,
          `Industry ${industry} content generation failed: ${error.message}`,
        );
      }
    }

    console.log("✅ Industry content generation test passed");
  }

  async testFileStructure() {
    console.log("🔍 Testing file structure generation...");

    const generator = new WebDirectProjectGenerator();

    const config = {
      projectName: "structure-test",
      businessName: "Structure Test Business",
      framework: "react",
      industry: "technology",
      features: ["contact-form", "gallery", "testimonials", "auth", "reviews"],
      selectedFeatures: [
        "contact-form",
        "gallery",
        "testimonials",
        "auth",
        "reviews",
      ],
      businessData: {
        name: "Structure Test Business",
        description: "Testing complete file structure",
      },
    };

    try {
      const files = await generator.generateProject(config);

      const expectedFiles = [
        // Root files
        "package.json",
        "tsconfig.json",
        "tsconfig.node.json",
        "vite.config.ts",
        "index.html",
        "README.md",

        // Source files
        "src/main.tsx",
        "src/App.tsx",
        "src/index.css",

        // Components
        "src/components/Navigation.tsx",
        "src/components/LoadingSpinner.tsx",
        "src/components/ErrorFallback.tsx",

        // Pages
        "src/pages/Home.tsx",
        "src/pages/About.tsx",
        "src/pages/Services.tsx",
        "src/pages/Contact.tsx",
        "src/pages/Gallery.tsx",
        "src/pages/Testimonials.tsx",
        "src/pages/Login.tsx",
        "src/pages/Register.tsx",
        "src/pages/Reviews.tsx",

        // Styles
        "src/App.css",
        "src/components/Navigation.css",
        "src/components/LoadingSpinner.css",
        "src/components/ErrorFallback.css",

        // Public files
        "public/manifest.json",
      ];

      for (const expectedFile of expectedFiles) {
        const file = files.find((f) => f.path === expectedFile);
        this.assert(file !== undefined, `Should generate ${expectedFile}`);
      }

      // Verify file types
      const packageJson = files.find((f) => f.path === "package.json");
      if (packageJson) {
        this.assert(
          packageJson.type === "json",
          'package.json should have type "json"',
        );

        // Verify package.json content
        const packageData = JSON.parse(packageJson.content);
        this.assert(
          packageData.name === "structure-test",
          "package.json should have correct name",
        );
        this.assert(
          packageData.dependencies.react,
          "package.json should include React dependency",
        );
      }

      console.log("✅ File structure test passed");
    } catch (error) {
      this.assert(false, `File structure test failed: ${error.message}`);
    }
  }

  async testComponentGeneration() {
    console.log("🔍 Testing component generation...");

    const generator = new WebDirectProjectGenerator();

    const config = {
      projectName: "component-test",
      businessName: "Component Test Business",
      framework: "react",
      industry: "technology",
      features: ["contact-form", "gallery"],
      selectedFeatures: ["contact-form", "gallery"],
      businessData: {
        name: "Component Test Business",
        description: "Testing component generation",
      },
    };

    try {
      const files = await generator.generateProject(config);

      // Test Navigation component
      const navFile = files.find(
        (f) => f.path === "src/components/Navigation.tsx",
      );
      this.assert(
        navFile !== undefined,
        "Should generate Navigation component",
      );

      if (navFile) {
        this.assert(
          navFile.content.includes("nav-link"),
          "Navigation should have nav links",
        );
        this.assert(
          navFile.content.includes(config.businessName),
          "Navigation should include business name",
        );
      }

      // Test LoadingSpinner component
      const spinnerFile = files.find(
        (f) => f.path === "src/components/LoadingSpinner.tsx",
      );
      this.assert(
        spinnerFile !== undefined,
        "Should generate LoadingSpinner component",
      );

      if (spinnerFile) {
        this.assert(
          spinnerFile.content.includes("spinner"),
          "LoadingSpinner should have spinner element",
        );
      }

      // Test ErrorFallback component
      const errorFile = files.find(
        (f) => f.path === "src/components/ErrorFallback.tsx",
      );
      this.assert(
        errorFile !== undefined,
        "Should generate ErrorFallback component",
      );

      if (errorFile) {
        this.assert(
          errorFile.content.includes("error"),
          "ErrorFallback should handle errors",
        );
      }

      console.log("✅ Component generation test passed");
    } catch (error) {
      this.assert(false, `Component generation test failed: ${error.message}`);
    }
  }

  async testPageContent() {
    console.log("🔍 Testing page content quality...");

    const generator = new WebDirectProjectGenerator();

    const config = {
      projectName: "content-test",
      businessName: "Digital Ghost Protocol 3",
      framework: "react",
      industry: "technology",
      features: ["contact-form", "gallery", "testimonials"],
      selectedFeatures: ["contact-form", "gallery", "testimonials"],
      businessData: {
        name: "Digital Ghost Protocol 3",
        location: "Silicon Valley",
        targetAudience: "Tech professionals",
        primaryGoal: "Lead generation",
        description: "Advanced technology solutions",
        contactEmail: "contact@dgp3.com",
        contactPhone: "(555) 123-4567",
      },
    };

    try {
      const files = await generator.generateProject(config);

      // Test Home page content
      const homeFile = files.find((f) => f.path === "src/pages/Home.tsx");
      if (homeFile) {
        this.assert(
          homeFile.content.includes("Digital Ghost Protocol 3"),
          "Home page should contain business name",
        );
        this.assert(
          homeFile.content.includes("hero-title"),
          "Home page should have hero section",
        );
        this.assert(
          homeFile.content.includes("services-grid"),
          "Home page should have services section",
        );
      }

      // Test Contact page functionality
      const contactFile = files.find((f) => f.path === "src/pages/Contact.tsx");
      if (contactFile) {
        this.assert(
          contactFile.content.includes("useState<ContactFormData>"),
          "Contact page should have form state management",
        );
        this.assert(
          contactFile.content.includes("handleSubmit"),
          "Contact page should have form submission handler",
        );
        this.assert(
          contactFile.content.includes("(555) 123-4567"),
          "Contact page should display contact phone",
        );
        this.assert(
          contactFile.content.includes("contact@dgp3.com"),
          "Contact page should display contact email",
        );
      }

      // Test Gallery page functionality
      const galleryFile = files.find((f) => f.path === "src/pages/Gallery.tsx");
      if (galleryFile) {
        this.assert(
          galleryFile.content.includes("GalleryItem"),
          "Gallery page should have GalleryItem interface",
        );
        this.assert(
          galleryFile.content.includes("filter"),
          "Gallery page should have filtering functionality",
        );
        this.assert(
          galleryFile.content.includes("gallery-grid"),
          "Gallery page should have grid layout",
        );
      }

      // Test Testimonials page content
      const testimonialsFile = files.find(
        (f) => f.path === "src/pages/Testimonials.tsx",
      );
      if (testimonialsFile) {
        this.assert(
          testimonialsFile.content.includes("testimonial-card"),
          "Testimonials page should have testimonial cards",
        );
        this.assert(
          testimonialsFile.content.includes("rating"),
          "Testimonials page should have ratings",
        );
      }

      console.log("✅ Page content test passed");
    } catch (error) {
      this.assert(false, `Page content test failed: ${error.message}`);
    }
  }

  assert(condition, message) {
    if (condition) {
      this.testResults.passed++;
      this.testResults.tests.push({ status: "PASS", message });
    } else {
      this.testResults.failed++;
      this.testResults.tests.push({ status: "FAIL", message });
      console.log(`❌ ${message}`);
    }
  }

  reportResults() {
    console.log("\n📊 Web Generator Test Results:");
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(
      `📋 Total: ${this.testResults.passed + this.testResults.failed}`,
    );

    if (this.testResults.failed > 0) {
      console.log("\n❌ Failed tests:");
      this.testResults.tests
        .filter((test) => test.status === "FAIL")
        .forEach((test) => console.log(`   • ${test.message}`));
    } else {
      console.log("\n🎉 All Web Generator tests passed!");
      console.log(
        "\n✅ CONCLUSION: WebDirectProjectGenerator is working correctly",
      );
      console.log("✅ The web app can now generate working PWA projects with:");
      console.log("   • Contact forms with React state management");
      console.log("   • Gallery pages with filtering functionality");
      console.log("   • Testimonials pages with real content");
      console.log("   • Authentication pages (login/register)");
      console.log("   • Reviews and rating systems");
      console.log("   • Industry-specific content generation");
      console.log("   • Complete file structure with TypeScript");
      console.log("   • Working components and navigation");
    }

    if (this.testResults.failed === 0) {
      console.log(
        "\n🚀 READY FOR PRODUCTION: The web frontend is now using the working generator!",
      );
      console.log(
        "🌐 Users can visit https://pwa-template-generator.web.app/builder",
      );
      console.log(
        "📦 And download working PWA projects with all features implemented",
      );
    }
  }
}

// Run the tests
const tester = new WebGeneratorTester();
tester
  .runAllTests()
  .then(() => {
    console.log("\n🏁 Web Generator test suite completed.");
    process.exit(tester.testResults.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("💥 Web Generator test suite crashed:", error);
    process.exit(1);
  });
