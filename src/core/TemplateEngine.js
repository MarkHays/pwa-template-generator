/**
 * Advanced Template Engine - Enterprise PWA Generator
 * Supports multi-framework generation with AI-powered customization
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import chalk from "chalk";
import { glob } from "glob";
import { minify } from "terser";
import sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { PageGenerator } from "./PageGenerator.js";
import { ContentGenerator } from "../ai/ContentGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TemplateEngine {
  constructor(options = {}) {
    this.options = {
      templatesDir: path.join(__dirname, "../../templates"),
      outputDir: options.outputDir || process.cwd(),
      framework: options.framework || "react",
      typescript: options.typescript || true,
      minify: options.minify || false,
      ...options,
    };

    // Initialize enhanced generators
    this.contentGenerator = new ContentGenerator();
    this.pageGenerator = new PageGenerator(this.contentGenerator);

    this.frameworks = {
      react: {
        name: "React",
        version: "18.2.0",
        description: "A JavaScript library for building user interfaces",
        dependencies: [
          "react@^18.2.0",
          "react-dom@^18.2.0",
          "react-router-dom@^6.20.0",
          "react-query@^3.39.3",
          "react-hook-form@^7.48.0",
          "framer-motion@^10.16.0",
          "react-helmet-async@^1.3.0",
        ],
        devDependencies: [
          "@types/react@^18.2.0",
          "@types/react-dom@^18.2.0",
          "@vitejs/plugin-react@^4.1.0",
          "@testing-library/react@^13.4.0",
          "@testing-library/jest-dom@^6.1.0",
          "@testing-library/user-event@^14.5.0",
          "eslint-plugin-react@^7.33.0",
          "eslint-plugin-react-hooks@^4.6.0",
        ],
        extensions: [".jsx", ".tsx"],
        buildTool: "vite",
        configFiles: ["vite.config.ts", "tsconfig.json", ".eslintrc.json"],
        features: [
          "hooks",
          "context",
          "suspense",
          "concurrent",
          "router",
          "state-management",
        ],
      },
      vue: {
        name: "Vue.js",
        version: "3.3.0",
        description: "The Progressive JavaScript Framework",
        dependencies: [
          "vue@^3.3.0",
          "vue-router@^4.2.0",
          "pinia@^2.1.0",
          "@vueuse/core@^10.5.0",
          "vue-i18n@^9.6.0",
          "vue-meta@^3.0.0-alpha.8",
        ],
        devDependencies: [
          "@vitejs/plugin-vue@^4.4.0",
          "@vue/tsconfig@^0.4.0",
          "@vue/test-utils@^2.4.0",
          "vue-tsc@^1.8.0",
          "eslint-plugin-vue@^9.18.0",
          "@pinia/testing@^0.1.0",
        ],
        extensions: [".vue", ".ts", ".js"],
        buildTool: "vite",
        configFiles: ["vite.config.ts", "tsconfig.json", ".eslintrc.json"],
        features: [
          "composition-api",
          "reactivity",
          "directives",
          "router",
          "state-management",
          "i18n",
        ],
      },
      angular: {
        name: "Angular",
        version: "17.0.0",
        description:
          "Platform for building mobile and desktop web applications",
        dependencies: [
          "@angular/core@^17.0.0",
          "@angular/common@^17.0.0",
          "@angular/router@^17.0.0",
          "@angular/forms@^17.0.0",
          "@angular/platform-browser@^17.0.0",
          "@angular/platform-browser-dynamic@^17.0.0",
          "@angular/animations@^17.0.0",
          "@angular/material@^17.0.0",
          "@angular/cdk@^17.0.0",
          "rxjs@^7.8.0",
          "zone.js@^0.14.0",
        ],
        devDependencies: [
          "@angular/cli@^17.0.0",
          "@angular/compiler-cli@^17.0.0",
          "@angular-devkit/build-angular@^17.0.0",
          "@angular/testing@^17.0.0",
          "karma@^6.4.0",
          "karma-chrome-launcher@^3.2.0",
          "karma-coverage@^2.2.0",
          "karma-jasmine@^5.1.0",
          "karma-jasmine-html-reporter@^2.1.0",
          "jasmine-core@^5.1.0",
          "typescript@^5.2.0",
        ],
        extensions: [".ts", ".html", ".scss"],
        buildTool: "angular-cli",
        configFiles: [
          "angular.json",
          "tsconfig.json",
          "tsconfig.app.json",
          "karma.conf.js",
        ],
        features: [
          "standalone-components",
          "signals",
          "dependency-injection",
          "router",
          "forms",
          "material",
        ],
      },
      nextjs: {
        name: "Next.js",
        version: "14.0.0",
        description: "The React Framework for the Web",
        dependencies: [
          "next@^14.0.0",
          "react@^18.2.0",
          "react-dom@^18.2.0",
          "next-auth@^4.24.0",
          "next-themes@^0.2.0",
          "next-seo@^6.4.0",
          "next-pwa@^5.6.0",
        ],
        devDependencies: [
          "@types/node@^20.0.0",
          "@types/react@^18.2.0",
          "@types/react-dom@^18.2.0",
          "eslint@^8.0.0",
          "eslint-config-next@^14.0.0",
          "@next/eslint-plugin-next@^14.0.0",
          "autoprefixer@^10.4.0",
          "postcss@^8.4.0",
          "tailwindcss@^3.3.0",
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        buildTool: "next",
        configFiles: [
          "next.config.js",
          "tsconfig.json",
          "tailwind.config.js",
          "postcss.config.js",
        ],
        features: [
          "app-router",
          "server-components",
          "api-routes",
          "middleware",
          "image-optimization",
          "auth",
        ],
      },
      svelte: {
        name: "SvelteKit",
        version: "4.0.0",
        description: "Cybernetically enhanced web apps",
        dependencies: [
          "svelte@^4.0.0",
          "@sveltejs/kit@^1.27.0",
          "svelte-forms-lib@^2.0.0",
          "svelte-i18n@^3.7.0",
        ],
        devDependencies: [
          "@sveltejs/adapter-auto@^2.1.0",
          "@sveltejs/adapter-vercel@^3.1.0",
          "@sveltejs/vite-plugin-svelte@^2.5.0",
          "vite@^4.5.0",
          "eslint@^8.0.0",
          "eslint-plugin-svelte@^2.35.0",
          "eslint-config-prettier@^9.0.0",
          "prettier@^3.0.0",
          "prettier-plugin-svelte@^3.0.0",
          "svelte-check@^3.6.0",
          "typescript@^5.2.0",
          "tslib@^2.6.0",
          "vitest@^0.34.0",
        ],
        extensions: [".svelte", ".ts", ".js"],
        buildTool: "vite",
        configFiles: [
          "vite.config.js",
          "svelte.config.js",
          "tsconfig.json",
          "app.html",
        ],
        features: [
          "routing",
          "server-side-rendering",
          "static-generation",
          "forms",
          "stores",
          "transitions",
        ],
      },
      astro: {
        name: "Astro",
        version: "4.0.0",
        description: "The web framework for content-driven websites",
        dependencies: [
          "astro@^4.0.0",
          "@astrojs/react@^3.0.0",
          "@astrojs/tailwind@^5.0.0",
          "@astrojs/sitemap@^3.0.0",
          "@astrojs/rss@^4.0.0",
          "react@^18.2.0",
          "react-dom@^18.2.0",
          "tailwindcss@^3.3.0",
        ],
        devDependencies: [
          "@astrojs/check@^0.3.0",
          "@astrojs/ts-plugin@^1.3.0",
          "@types/react@^18.2.0",
          "@types/react-dom@^18.2.0",
          "typescript@^5.2.0",
          "prettier@^3.0.0",
          "prettier-plugin-astro@^0.12.0",
        ],
        extensions: [".astro", ".ts", ".js", ".jsx", ".tsx"],
        buildTool: "astro",
        configFiles: [
          "astro.config.mjs",
          "tsconfig.json",
          "tailwind.config.mjs",
        ],
        features: [
          "static-generation",
          "server-side-rendering",
          "component-islands",
          "content-collections",
          "markdown",
        ],
      },
    };

    this.industryTemplates = {
      "small-business": {
        name: "Small Business",
        components: ["Hero", "About", "Services", "Contact", "Gallery"],
        features: ["contact-form", "gallery", "testimonials", "business-info"],
        colorScheme: "professional",
        layout: "standard",
      },
      "e-commerce": {
        name: "E-commerce",
        components: ["ProductCatalog", "Cart", "Checkout", "UserAccount"],
        features: ["payments", "inventory", "reviews", "wishlist"],
        colorScheme: "vibrant",
        layout: "product-focused",
      },
      saas: {
        name: "SaaS Platform",
        components: ["Dashboard", "Analytics", "Settings", "Billing"],
        features: ["authentication", "multi-tenant", "analytics", "payments"],
        colorScheme: "modern",
        layout: "dashboard",
      },
      portfolio: {
        name: "Portfolio",
        components: ["ProjectShowcase", "About", "Skills", "Contact"],
        features: ["gallery", "blog", "contact-form"],
        colorScheme: "creative",
        layout: "showcase",
      },
      restaurant: {
        name: "Restaurant",
        components: ["Menu", "Reservations", "Location", "Reviews"],
        features: ["booking", "menu-display", "location", "reviews"],
        colorScheme: "warm",
        layout: "hospitality",
      },
      healthcare: {
        name: "Healthcare",
        components: ["Services", "Appointments", "Staff", "Contact"],
        features: ["appointment-booking", "HIPAA-compliance", "patient-portal"],
        colorScheme: "medical",
        layout: "professional",
      },
    };

    this.setupHandlebars();
  }

  setupHandlebars() {
    // Register custom helpers
    Handlebars.registerHelper("json", (obj) => JSON.stringify(obj, null, 2));

    Handlebars.registerHelper("uppercase", (str) => str.toUpperCase());

    Handlebars.registerHelper("lowercase", (str) => str.toLowerCase());

    Handlebars.registerHelper("camelCase", (str) => {
      return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    });

    Handlebars.registerHelper("pascalCase", (str) => {
      const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) =>
        c ? c.toUpperCase() : "",
      );
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    });

    Handlebars.registerHelper("kebabCase", (str) => {
      return str
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        .replace(/^-/, "");
    });

    Handlebars.registerHelper("if_eq", function (a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this);
    });

    Handlebars.registerHelper("if_includes", function (array, value, opts) {
      return array.includes(value) ? opts.fn(this) : opts.inverse(this);
    });

    Handlebars.registerHelper("frameworkExt", (framework) => {
      const ext = this.frameworks[framework]?.extensions[0] || ".js";
      return this.options.typescript ? ext.replace(".js", ".ts") : ext;
    });

    Handlebars.registerHelper("importStatement", (framework, module) => {
      const statements = {
        react: `import ${module} from '${module}';`,
        vue: `import ${module} from '${module}';`,
        angular: `import { ${module} } from '${module}';`,
        nextjs: `import ${module} from '${module}';`,
        svelte: `import ${module} from '${module}';`,
        astro: `import ${module} from '${module}';`,
      };
      return statements[framework] || statements.react;
    });
  }

  async generateProject(config) {
    console.log(chalk.blue("🚀 Starting enterprise PWA generation..."));

    try {
      const context = await this.buildContext(config);

      // Create project structure
      await this.createProjectStructure(context);

      // Generate framework-specific files
      await this.generateFrameworkFiles(context);

      // Generate components
      await this.generateComponents(context);

      // Generate styles
      await this.generateStyles(context);

      // Generate configuration files
      await this.generateConfigFiles(context);

      // Generate package.json
      await this.generatePackageJson(context);

      // Generate PWA files
      await this.generatePWAFiles(context);

      // Generate deployment files
      await this.generateDeploymentFiles(context);

      // Generate testing files
      await this.generateTestingFiles(context);

      console.log(chalk.green("✅ Enterprise PWA generated successfully!"));

      return {
        success: true,
        path: this.options.outputDir,
        framework: context.framework,
        features: context.features,
        components: context.components,
      };
    } catch (error) {
      console.error(chalk.red("❌ Error generating PWA:"), error);
      throw error;
    }
  }

  async buildContext(config) {
    const framework = this.frameworks[config.framework];
    const industry = this.industryTemplates[config.industry];

    if (!framework) {
      throw new Error(`Unsupported framework: ${config.framework}`);
    }

    if (!industry) {
      throw new Error(`Unsupported industry: ${config.industry}`);
    }

    const context = {
      // Project info
      projectName: config.projectName,
      businessName: config.businessName,
      description: config.description,

      // Framework info
      framework: config.framework,
      frameworkConfig: framework,
      typescript: this.options.typescript,

      // Industry info
      industry: config.industry,
      industryConfig: industry,

      // Features
      features: config.features || industry.features,
      components: config.components || industry.components,

      // Styling
      colorScheme: config.colorScheme || industry.colorScheme,
      layout: config.layout || industry.layout,

      // Advanced features
      authentication: config.authentication || false,
      database: config.database || null,
      cms: config.cms || null,
      analytics: config.analytics || [],

      // Deployment
      deployment: config.deployment || [],

      // AI enhancements
      aiGenerated: config.aiGenerated || {},

      // Paths
      outputDir: this.options.outputDir,
      templatesDir: this.options.templatesDir,

      // Build info
      buildTool: framework.buildTool,
      minify: this.options.minify,

      // Current date
      generatedDate: new Date().toISOString(),

      // Utilities
      utils: {
        camelCase: (str) =>
          str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")),
        pascalCase: (str) => {
          const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) =>
            c ? c.toUpperCase() : "",
          );
          return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        },
        kebabCase: (str) =>
          str
            .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            .replace(/^-/, ""),
      },
    };

    return context;
  }

  async createProjectStructure(context) {
    const dirs = [
      "src",
      "src/components",
      "src/components/common",
      "src/components/layout",
      "src/components/sections",
      "src/pages",
      "src/hooks",
      "src/utils",
      "src/services",
      "src/store",
      "src/styles",
      "src/assets",
      "src/assets/images",
      "src/assets/icons",
      "src/types",
      "src/config",
      "public",
      "docs",
      "tests",
      "tests/unit",
      "tests/integration",
      "tests/e2e",
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(context.outputDir, dir));
    }
  }

  async generateFrameworkFiles(context) {
    const templateDir = path.join(this.options.templatesDir, context.framework);

    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }

    const files = await glob("**/*", { cwd: templateDir });

    for (const file of files) {
      const sourcePath = path.join(templateDir, file);
      const stat = await fs.stat(sourcePath);

      if (stat.isFile()) {
        await this.processTemplate(sourcePath, file, context);
      }
    }
  }

  async generateComponents(context) {
    console.log(
      chalk.blue("🧩 Generating components for selected features..."),
    );

    // Generate pages with actual content
    const generatedPages = await this.pageGenerator.generatePages(context);
    context.generatedPages = generatedPages;

    // Generate feature-specific components
    if (context.features && context.features.length > 0) {
      await this.generateFeatureComponents(context);
    }

    // Generate basic component structure
    const componentDir = path.join(this.options.templatesDir, "components");
    const components = context.components || [];

    for (const componentName of components) {
      const componentPath = path.join(componentDir, `${componentName}.hbs`);

      if (await fs.pathExists(componentPath)) {
        await this.processTemplate(
          componentPath,
          `src/components/sections/${componentName}.${this.getFileExtension(context)}`,
          context,
        );
      }
    }
  }

  async generateFeatureComponents(context) {
    const featureImplementations = {
      "contact-form": () => this.generateContactFormFiles(context),
      gallery: () => this.generateGalleryFiles(context),
      testimonials: () => this.generateTestimonialFiles(context),
      auth: () => this.generateAuthFiles(context),
      reviews: () => this.generateReviewFiles(context),
    };

    for (const feature of context.features) {
      if (featureImplementations[feature]) {
        console.log(chalk.gray(`  - Implementing ${feature}...`));
        await featureImplementations[feature]();
      }
    }
  }

  async generateContactFormFiles(context) {
    const contactFormCSS = `
.contact-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.contact-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;
}

.contact-details {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-button {
  background: #007bff;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background: #0056b3;
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.contact-form-success {
  text-align: center;
  padding: 2rem;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
}

@media (max-width: 768px) {
  .contact-info {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/contact-form.css"),
      contactFormCSS,
    );
  }

  async generateGalleryFiles(context) {
    const galleryCSS = `
.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.gallery-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/gallery.css"),
      galleryCSS,
    );
  }

  async generateTestimonialFiles(context) {
    const testimonialsCSS = `
.testimonials-section {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.testimonial-content {
  font-style: italic;
  margin-bottom: 1.5rem;
  color: #555;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ddd;
}

.author-info h4 {
  margin: 0;
  color: #333;
}

.author-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.star-rating {
  color: #ffc107;
  margin-bottom: 1rem;
}

.testimonial-slider {
  position: relative;
  overflow: hidden;
}

.slider-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.slider-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.slider-btn:hover {
  background: #0056b3;
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/testimonials.css"),
      testimonialsCSS,
    );
  }

  async generateAuthFiles(context) {
    const authCSS = `
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-form .form-group {
  margin-bottom: 1.5rem;
}

.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.auth-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-submit {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.auth-submit:hover {
  background: #0056b3;
}

.auth-links {
  text-align: center;
  margin-top: 1rem;
}

.auth-links a {
  color: #007bff;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/auth.css"),
      authCSS,
    );
  }

  async generateReviewFiles(context) {
    const reviewsCSS = `
.reviews-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.reviews-header {
  text-align: center;
  margin-bottom: 3rem;
}

.reviews-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.review-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-rating {
  color: #ffc107;
}

.review-content {
  color: #555;
  margin-bottom: 1rem;
}

.review-author {
  font-weight: 600;
  color: #333;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/reviews.css"),
      reviewsCSS,
    );
  }

  async generateStyles(context) {
    const styleDir = path.join(this.options.templatesDir, "styles");
    const outputStyleDir = path.join(context.outputDir, "src/styles");

    // Ensure styles directory exists
    await fs.ensureDir(outputStyleDir);

    // Generate comprehensive page styles
    await this.generatePageStyles(context);

    // Generate navigation styles
    await this.generateNavigationStyles(context);

    // Generate main stylesheet
    const mainStylePath = path.join(styleDir, "main.scss.hbs");
    if (await fs.pathExists(mainStylePath)) {
      await this.processTemplate(
        mainStylePath,
        "src/styles/main.scss",
        context,
      );
    } else {
      // Generate default main styles if template doesn't exist
      await this.generateDefaultMainStyles(context);
    }

    // Generate component styles
    const components = context.components || [];
    for (const component of components) {
      const componentStylePath = path.join(
        styleDir,
        "components",
        `${component}.scss.hbs`,
      );
      if (await fs.pathExists(componentStylePath)) {
        await this.processTemplate(
          componentStylePath,
          `src/styles/components/${component}.scss`,
          context,
        );
      }
    }
  }

  async generatePageStyles(context) {
    const pageCSS = `
/* Page Styles - Comprehensive styling for all pages */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #ffffff;
}

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  flex: 1;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-button {
  background: #ff6b6b;
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

/* Sections */
.features-section,
.testimonials-section,
.services-section,
.about-content,
.values-section,
.team-section {
  padding: 4rem 0;
}

.features-section h2,
.testimonials-section h2,
.services-section h2,
.values-section h2,
.team-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

/* Grid Layouts */
.features-grid,
.services-grid,
.values-grid,
.team-grid,
.testimonials-grid {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.features-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.values-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.team-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.testimonials-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

/* Card Styles */
.feature-card,
.service-card,
.value-card,
.team-card,
.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover,
.service-card:hover,
.value-card:hover,
.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.feature-card h3,
.service-card h3,
.value-card h3,
.team-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
}

.service-features {
  list-style: none;
  margin: 1.5rem 0;
}

.service-features li {
  padding: 0.5rem 0;
  color: #666;
  position: relative;
  padding-left: 1.5rem;
}

.service-features li:before {
  content: '✓';
  color: #4CAF50;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.service-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin: 1rem 0;
}

.service-cta {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}

.service-cta:hover {
  background: #5a6fd8;
}

/* Team Cards */
.team-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin: 0 auto 1rem;
}

.team-role {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.team-bio {
  color: #666;
  line-height: 1.6;
}

/* Contact Layout */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 3rem;
}

.contact-details {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.contact-item {
  margin-bottom: 1rem;
  color: #555;
}

.contact-item strong {
  color: #333;
  display: inline-block;
  min-width: 80px;
}

.office-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.office-info h3 {
  color: #333;
  margin-bottom: 1rem;
}

/* Page Content */
.page-content {
  padding: 3rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.page-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
}

/* About Page Specific */
.about-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-text h2,
.about-text h3 {
  color: #333;
  margin: 2rem 0 1rem;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .features-grid,
  .services-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 1rem;
  }

  .hero-section {
    padding: 4rem 1rem;
    min-height: 60vh;
  }

  .features-section,
  .testimonials-section,
  .services-section {
    padding: 3rem 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .cta-button {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }

  .feature-card,
  .service-card,
  .team-card,
  .testimonial-card {
    padding: 1.5rem;
  }
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/pages.css"),
      pageCSS,
    );
  }

  async generateNavigationStyles(context) {
    const navCSS = `
/* Navigation Styles */
.navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-logo:hover {
  color: #5a6fd8;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-link.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* Mobile Navigation */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #333;
  margin: 3px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  .nav-link:last-child {
    border-bottom: none;
  }
}

/* Ensure content doesn't hide behind fixed nav */
body {
  padding-top: 70px;
}

/* Navigation scroll effect */
.navigation.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/components/Navigation.css"),
      navCSS,
    );
  }

  async generateDefaultMainStyles(context) {
    const mainCSS = `
/* Main Application Styles */
@import './pages.css';
@import '../components/Navigation.css';

/* Global Styles */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ff6b6b;
  --text-color: #333;
  --text-light: #666;
  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --border-color: #e9ecef;
  --success-color: #4CAF50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.15);
}

html {
  scroll-behavior: smooth;
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 2rem; }
.mt-4 { margin-top: 3rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 2rem; }
.mb-4 { margin-bottom: 3rem; }

.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 2rem; }
.p-4 { padding: 3rem; }

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-accent {
  background: var(--accent-color);
  color: white;
}

.btn-accent:hover {
  background: #ff5252;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Success/Error States */
.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin: 1rem 0;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin: 1rem 0;
}

/* Loading States */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
*:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

button:focus,
input:focus,
textarea:focus,
select:focus,
.nav-link:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/main.css"),
      mainCSS,
    );
  }

  async generateConfigFiles(context) {
    const configTemplates = [
      "tsconfig.json.hbs",
      "vite.config.js.hbs",
      "tailwind.config.js.hbs",
      "postcss.config.js.hbs",
      ".env.example.hbs",
      ".gitignore.hbs",
      "README.md.hbs",
    ];

    for (const template of configTemplates) {
      const templatePath = path.join(
        this.options.templatesDir,
        "config",
        template,
      );
      if (await fs.pathExists(templatePath)) {
        await this.processTemplate(
          templatePath,
          template.replace(".hbs", ""),
          context,
        );
      }
    }
  }

  async generatePackageJson(context) {
    const framework = context.frameworkConfig;

    const packageJson = {
      name: context.projectName,
      version: "1.0.0",
      description: context.description,
      private: true,
      type: "module",
      scripts: {
        dev: this.getBuildCommand(context, "dev"),
        build: this.getBuildCommand(context, "build"),
        preview: this.getBuildCommand(context, "preview"),
        test: "vitest",
        "test:e2e": "playwright test",
        lint: "eslint . --ext .js,.jsx,.ts,.tsx,.vue",
        "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx,.vue --fix",
        format: "prettier --write .",
        "type-check": context.typescript ? "tsc --noEmit" : undefined,
      },
      dependencies: {
        ...this.getFrameworkDependencies(framework),
        ...this.getFeatureDependencies(context.features),
      },
      devDependencies: {
        ...this.getFrameworkDevDependencies(framework),
        ...this.getCommonDevDependencies(context),
      },
      engines: {
        node: ">=16.0.0",
        npm: ">=8.0.0",
      },
      keywords: [
        "pwa",
        "progressive-web-app",
        context.framework,
        context.industry,
        "enterprise",
      ],
      author: "",
      license: "MIT",
    };

    await fs.writeJson(
      path.join(context.outputDir, "package.json"),
      packageJson,
      { spaces: 2 },
    );
  }

  async generatePWAFiles(context) {
    const pwaTemplates = ["manifest.json.hbs", "sw.js.hbs", "offline.html.hbs"];

    for (const template of pwaTemplates) {
      const templatePath = path.join(
        this.options.templatesDir,
        "pwa",
        template,
      );
      if (await fs.pathExists(templatePath)) {
        const outputPath = template.replace(".hbs", "");
        await this.processTemplate(
          templatePath,
          `public/${outputPath}`,
          context,
        );
      }
    }
  }

  async generateDeploymentFiles(context) {
    for (const deployment of context.deployment) {
      const deploymentDir = path.join(
        this.options.templatesDir,
        "deployment",
        deployment,
      );

      if (await fs.pathExists(deploymentDir)) {
        const files = await glob("**/*", { cwd: deploymentDir });

        for (const file of files) {
          const sourcePath = path.join(deploymentDir, file);
          const stat = await fs.stat(sourcePath);

          if (stat.isFile()) {
            await this.processTemplate(sourcePath, file, context);
          }
        }
      }
    }
  }

  async generateTestingFiles(context) {
    const testTemplates = [
      "vitest.config.js.hbs",
      "playwright.config.js.hbs",
      "jest.config.js.hbs",
    ];

    for (const template of testTemplates) {
      const templatePath = path.join(
        this.options.templatesDir,
        "testing",
        template,
      );
      if (await fs.pathExists(templatePath)) {
        await this.processTemplate(
          templatePath,
          template.replace(".hbs", ""),
          context,
        );
      }
    }
  }

  async processTemplate(sourcePath, outputPath, context) {
    try {
      const template = await fs.readFile(sourcePath, "utf-8");
      const compiled = Handlebars.compile(template);
      let content = compiled(context);

      // Post-process based on file type
      if (outputPath.endsWith(".js") || outputPath.endsWith(".ts")) {
        content = await this.processJavaScript(content, context);
      } else if (outputPath.endsWith(".css") || outputPath.endsWith(".scss")) {
        content = await this.processStyles(content, context);
      }

      const fullOutputPath = path.join(context.outputDir, outputPath);
      await fs.ensureDir(path.dirname(fullOutputPath));
      await fs.writeFile(fullOutputPath, content);

      console.log(chalk.green(`✅ Generated: ${outputPath}`));
    } catch (error) {
      console.error(
        chalk.red(`❌ Error processing template ${sourcePath}:`),
        error,
      );
      throw error;
    }
  }

  async processJavaScript(content, context) {
    if (context.minify) {
      const result = await minify(content, {
        mangle: false,
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      });
      return result.code;
    }
    return content;
  }

  async processStyles(content, context) {
    if (content.includes("@") || content.includes("$")) {
      // Process SCSS
      const result = sass.compileString(content, {
        style: context.minify ? "compressed" : "expanded",
      });

      // Process with PostCSS
      const postcssResult = await postcss([
        autoprefixer(),
        ...(context.minify ? [cssnano()] : []),
      ]).process(result.css, { from: undefined });

      return postcssResult.css;
    }

    return content;
  }

  getBuildCommand(context, command) {
    const commands = {
      vite: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      next: {
        dev: "next dev",
        build: "next build",
        preview: "next start",
      },
      "angular-cli": {
        dev: "ng serve",
        build: "ng build",
        preview: "ng serve --prod",
      },
      astro: {
        dev: "astro dev",
        build: "astro build",
        preview: "astro preview",
      },
    };

    return commands[context.buildTool]?.[command] || `npm run ${command}`;
  }

  getFrameworkDependencies(framework) {
    const deps = {};
    framework.dependencies.forEach((dep) => {
      deps[dep] = "latest";
    });
    return deps;
  }

  getFrameworkDevDependencies(framework) {
    const deps = {};
    framework.devDependencies.forEach((dep) => {
      deps[dep] = "latest";
    });
    return deps;
  }

  getFeatureDependencies(features) {
    const deps = {};
    const featureMap = {
      "contact-form": ["formik", "yup"],
      payments: ["stripe"],
      analytics: ["@google-analytics/gtag"],
      authentication: ["firebase", "auth0"],
      database: ["prisma"],
      cms: ["contentful"],
      "real-time": ["socket.io-client"],
    };

    features.forEach((feature) => {
      if (featureMap[feature]) {
        featureMap[feature].forEach((dep) => {
          deps[dep] = "latest";
        });
      }
    });

    return deps;
  }

  getCommonDevDependencies(context) {
    const deps = {
      vite: "latest",
      vitest: "latest",
      playwright: "latest",
      eslint: "latest",
      prettier: "latest",
      sass: "latest",
      postcss: "latest",
      autoprefixer: "latest",
      cssnano: "latest",
      terser: "latest",
    };

    if (context.typescript) {
      deps["typescript"] = "latest";
      deps["@types/node"] = "latest";
    }

    return deps;
  }

  getFileExtension(context) {
    const extensions = {
      react: context.typescript ? "tsx" : "jsx",
      vue: "vue",
      angular: "ts",
      nextjs: context.typescript ? "tsx" : "jsx",
      svelte: "svelte",
      astro: "astro",
    };

    return extensions[context.framework] || "js";
  }
}

export default TemplateEngine;
