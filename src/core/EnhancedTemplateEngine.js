/**
 * Enhanced Template Engine - Properly Implements All Selected Features
 * Ensures that every feature selected in the builder form is actually implemented
 */

import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { ContentGenerator } from "../ai/ContentGenerator.js";
import { PerformanceOptimizer } from "../ai/PerformanceOptimizer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EnhancedTemplateEngine {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || "./generated-pwa",
      templatesDir: options.templatesDir || path.join(__dirname, "../../templates"),
      typescript: options.typescript !== false,
      minify: options.minify !== false,
      ...options,
    };

    // Initialize AI modules
    this.contentGenerator = new ContentGenerator();
    this.performanceOptimizer = new PerformanceOptimizer();

    // Feature implementation mapping
    this.featureImplementations = {
      // Core Features
      "contact-form": {
        components: ["ContactForm", "ContactSection"],
        pages: ["contact"],
        dependencies: ["formik", "yup"],
        styles: ["contact-form.css"],
        functionality: "contact-form-handler"
      },
      "gallery": {
        components: ["Gallery", "ImageModal", "GalleryGrid"],
        pages: ["gallery"],
        dependencies: ["react-image-gallery", "lightbox2"],
        styles: ["gallery.css"],
        functionality: "image-gallery"
      },
      "testimonials": {
        components: ["TestimonialCard", "TestimonialSlider", "TestimonialSection"],
        pages: ["testimonials"],
        dependencies: ["swiper"],
        styles: ["testimonials.css"],
        functionality: "testimonial-display"
      },
      "auth": {
        components: ["LoginForm", "RegisterForm", "AuthGuard", "UserProfile"],
        pages: ["login", "register", "profile"],
        dependencies: ["firebase", "jwt-decode"],
        styles: ["auth.css"],
        functionality: "authentication"
      },
      "reviews": {
        components: ["ReviewCard", "ReviewForm", "ReviewList", "StarRating"],
        pages: ["reviews"],
        dependencies: ["react-stars"],
        styles: ["reviews.css"],
        functionality: "review-system"
      },
      "responsive": {
        components: ["ResponsiveContainer", "MobileNav"],
        styles: ["responsive.css", "mobile.css"],
        functionality: "responsive-design"
      },
      "pwa": {
        components: ["InstallPrompt", "OfflineIndicator"],
        files: ["manifest.json", "sw.js"],
        functionality: "pwa-features"
      },
      "typescript": {
        files: ["tsconfig.json", "types.ts"],
        functionality: "typescript-support"
      },
      "performance": {
        components: ["LazyImage", "VirtualScroll"],
        functionality: "performance-optimized"
      },
      "seo": {
        components: ["SEOHead", "StructuredData"],
        functionality: "seo-ready"
      },
      "testing": {
        files: ["jest.config.js", "setup-tests.js"],
        dependencies: ["@testing-library/react", "jest"],
        functionality: "testing-setup"
      }
    };

    // Framework-specific configurations
    this.frameworkConfigs = {
      react: {
        mainFile: "App.tsx",
        routerComponent: "BrowserRouter",
        dependencies: ["react", "react-dom", "react-router-dom"],
        devDependencies: ["@types/react", "@types/react-dom", "vite"]
      },
      vue: {
        mainFile: "App.vue",
        routerComponent: "RouterView",
        dependencies: ["vue", "vue-router", "pinia"],
        devDependencies: ["@vitejs/plugin-vue", "vite"]
      },
      angular: {
        mainFile: "app.component.ts",
        routerComponent: "RouterOutlet",
        dependencies: ["@angular/core", "@angular/router"],
        devDependencies: ["@angular/cli", "typescript"]
      },
      nextjs: {
        mainFile: "layout.tsx",
        routerComponent: "built-in",
        dependencies: ["next", "react", "react-dom"],
        devDependencies: ["@types/node", "@types/react"]
      },
      svelte: {
        mainFile: "App.svelte",
        routerComponent: "Router",
        dependencies: ["svelte", "@sveltejs/kit"],
        devDependencies: ["@sveltejs/adapter-auto", "vite"]
      },
      astro: {
        mainFile: "Layout.astro",
        routerComponent: "built-in",
        dependencies: ["astro"],
        devDependencies: ["@astrojs/react", "@astrojs/tailwind"]
      }
    };

    this.setupHandlebars();
  }

  setupHandlebars() {
    // Enhanced Handlebars helpers
    Handlebars.registerHelper("camelCase", (str) =>
      str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    );

    Handlebars.registerHelper("pascalCase", (str) => {
      const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) =>
        c ? c.toUpperCase() : ""
      );
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    });

    Handlebars.registerHelper("kebabCase", (str) =>
      str
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        .replace(/^-/, "")
    );

    Handlebars.registerHelper("includes", (array, value) =>
      Array.isArray(array) && array.includes(value)
    );

    Handlebars.registerHelper("ifEquals", function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("json", (context) =>
      JSON.stringify(context, null, 2)
    );
  }

  /**
   * Main project generation method
   */
  async generateProject(config) {
    console.log(chalk.blue("🚀 Enhanced PWA Generation Starting..."));

    try {
      // Build comprehensive context
      const context = await this.buildEnhancedContext(config);

      // Generate AI content if available
      if (config.aiFeatures?.includes("contentGeneration")) {
        context.aiContent = await this.generateAIContent(config);
      }

      // Create project structure
      await this.createProjectStructure(context);

      // Generate all selected features
      await this.implementSelectedFeatures(context);

      // Generate framework-specific files
      await this.generateFrameworkFiles(context);

      // Generate pages with actual content
      await this.generatePagesWithContent(context);

      // Generate components for selected features
      await this.generateFeatureComponents(context);

      // Generate styles
      await this.generateStyles(context);

      // Generate configuration files
      await this.generateConfigFiles(context);

      // Generate package.json with all dependencies
      await this.generateEnhancedPackageJson(context);

      // Generate PWA files
      await this.generatePWAFiles(context);

      // Apply performance optimizations
      if (config.aiFeatures?.includes("performanceOptimization")) {
        await this.applyPerformanceOptimizations(context);
      }

      console.log(chalk.green("✅ Enhanced PWA generated successfully!"));

      return {
        success: true,
        path: this.options.outputDir,
        framework: context.framework,
        features: context.selectedFeatures,
        pages: context.pages,
        components: context.implementedComponents,
        aiEnhanced: !!context.aiContent
      };
    } catch (error) {
      console.error(chalk.red("❌ Error generating enhanced PWA:"), error);
      throw error;
    }
  }

  /**
   * Build enhanced context with proper feature mapping
   */
  async buildEnhancedContext(config) {
    const frameworkConfig = this.frameworkConfigs[config.framework];

    if (!frameworkConfig) {
      throw new Error(`Unsupported framework: ${config.framework}`);
    }

    // Map selected features to implementations
    const selectedFeatures = config.features || [];
    const implementedComponents = [];
    const requiredDependencies = new Set();
    const requiredDevDependencies = new Set();
    const requiredStyles = [];
    const pages = ["home", "about"]; // Always include these

    // Process each selected feature
    selectedFeatures.forEach(feature => {
      const implementation = this.featureImplementations[feature];
      if (implementation) {
        // Add components
        if (implementation.components) {
          implementedComponents.push(...implementation.components);
        }

        // Add pages
        if (implementation.pages) {
          pages.push(...implementation.pages);
        }

        // Add dependencies
        if (implementation.dependencies) {
          implementation.dependencies.forEach(dep => requiredDependencies.add(dep));
        }

        // Add styles
        if (implementation.styles) {
          requiredStyles.push(...implementation.styles);
        }
      }
    });

    // Add framework dependencies
    frameworkConfig.dependencies.forEach(dep => requiredDependencies.add(dep));
    frameworkConfig.devDependencies.forEach(dep => requiredDevDependencies.add(dep));

    // Add common dependencies
    requiredDependencies.add("@types/node");
    if (config.framework !== "angular") {
      requiredDependencies.add("typescript");
    }

    const context = {
      // Project info
      projectName: config.projectName || "my-pwa-app",
      businessName: config.businessName || config.projectName || "My Business",
      description: config.description || "An AI-powered PWA application",

      // Framework info
      framework: config.framework,
      frameworkConfig,
      typescript: this.options.typescript,

      // Industry info
      industry: config.industry || "small-business",

      // Features and implementations
      selectedFeatures,
      implementedComponents: [...new Set(implementedComponents)],
      pages: [...new Set(pages)],
      requiredDependencies: Array.from(requiredDependencies),
      requiredDevDependencies: Array.from(requiredDevDependencies),
      requiredStyles,

      // Content
      businessData: {
        name: config.businessName || "My Business",
        location: config.location || "Your City",
        targetAudience: config.targetAudience || "General consumers",
        primaryGoal: config.primaryGoal || "Increase online presence"
      },

      // Styling
      colorScheme: config.colorScheme || {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#1F2937"
      },

      // Advanced features
      pwaEnabled: selectedFeatures.includes("pwa"),
      authEnabled: selectedFeatures.includes("auth"),
      responsiveEnabled: selectedFeatures.includes("responsive"),
      seoEnabled: selectedFeatures.includes("seo"),
      performanceOptimized: selectedFeatures.includes("performance"),

      // Paths
      outputDir: this.options.outputDir,
      templatesDir: this.options.templatesDir,

      // Build info
      buildTool: frameworkConfig.buildTool || "vite",
      minify: this.options.minify,

      // Metadata
      generatedDate: new Date().toISOString(),
      generatedBy: "Enhanced PWA Template Generator v2.0",

      // Utilities
      utils: {
        camelCase: (str) => str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")),
        pascalCase: (str) => {
          const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "");
          return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        },
        kebabCase: (str) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, ""),
      }
    };

    return context;
  }

  /**
   * Generate AI content for the project
   */
  async generateAIContent(config) {
    try {
      console.log(chalk.cyan("🤖 Generating AI-powered content..."));

      const businessData = {
        name: config.businessName || "My Business",
        location: config.location || "Your City",
        targetAudience: config.targetAudience || "General consumers",
        primaryGoal: config.primaryGoal || "Increase online presence"
      };

      const content = await this.contentGenerator.generateDemoContent(
        config.industry || "small-business",
        businessData
      );

      const seoContent = await this.contentGenerator.generateSEOContent(
        config.industry || "small-business",
        businessData
      );

      return {
        ...content,
        seo: seoContent
      };
    } catch (error) {
      console.log(chalk.yellow("⚠️  AI content generation failed, using defaults"));
      return this.getDefaultContent(config);
    }
  }

  /**
   * Get default content when AI is not available
   */
  getDefaultContent(config) {
    const businessName = config.businessName || "Digital Ghost Protocol 2";

    return {
      hero: {
        title: businessName,
        subtitle: `Welcome to ${businessName} - Your trusted digital solution`,
        cta: "Get Started"
      },
      about: {
        title: `About ${businessName}`,
        content: `${businessName} is dedicated to providing exceptional digital services with cutting-edge technology and innovative solutions.`,
        benefits: [
          "Professional Service",
          "Quality Solutions",
          "Customer Focused",
          "Modern Technology"
        ]
      },
      services: [
        "Professional Consulting",
        "Digital Solutions",
        "Customer Support",
        "Quality Assurance"
      ],
      testimonials: [
        "Excellent service and professional team!",
        "Highly recommend for quality work.",
        "Outstanding results and great communication."
      ],
      contact: {
        phone: "(555) 123-4567",
        email: "contact@example.com",
        address: "123 Main Street, Your City",
        hours: "Mon-Fri: 9AM-6PM"
      },
      faq: [
        {
          question: "What services do you offer?",
          answer: "We offer comprehensive digital solutions tailored to your business needs."
        },
        {
          question: "How can I get started?",
          answer: "Contact us through our contact form or call us directly to discuss your project."
        }
      ]
    };
  }

  /**
   * Create enhanced project structure
   */
  async createProjectStructure(context) {
    const dirs = [
      "src",
      "src/components",
      "src/components/sections",
      "src/components/ui",
      "src/pages",
      "src/styles",
      "src/utils",
      "src/hooks",
      "src/types",
      "public",
      "public/images",
      "public/icons"
    ];

    // Add framework-specific directories
    if (context.framework === "nextjs") {
      dirs.push("app", "app/api");
    } else if (context.framework === "angular") {
      dirs.push("src/app", "src/environments");
    }

    // Add feature-specific directories
    if (context.authEnabled) {
      dirs.push("src/auth", "src/guards");
    }

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.options.outputDir, dir));
    }
  }

  /**
   * Implement all selected features
   */
  async implementSelectedFeatures(context) {
    console.log(chalk.blue("🔧 Implementing selected features..."));

    for (const feature of context.selectedFeatures) {
      console.log(chalk.gray(`  - Implementing ${feature}...`));

      const implementation = this.featureImplementations[feature];
      if (implementation) {
        // Generate feature-specific files
        await this.generateFeatureFiles(feature, implementation, context);
      }
    }
  }

  /**
   * Generate files for a specific feature
   */
  async generateFeatureFiles(featureName, implementation, context) {
    // Generate components for this feature
    if (implementation.components) {
      for (const componentName of implementation.components) {
        await this.generateComponent(componentName, featureName, context);
      }
    }

    // Generate feature-specific files
    if (implementation.files) {
      for (const fileName of implementation.files) {
        await this.generateFeatureConfigFile(fileName, featureName, context);
      }
    }

    // Generate functionality files
    if (implementation.functionality) {
      await this.generateFunctionalityFile(implementation.functionality, featureName, context);
    }
  }

  /**
   * Generate a component with actual functionality
   */
  async generateComponent(componentName, featureName, context) {
    const componentContent = this.generateComponentContent(componentName, featureName, context);
    const fileExtension = context.typescript ? "tsx" : "jsx";
    const fileName = `${componentName}.${fileExtension}`;
    const filePath = path.join(this.options.outputDir, "src/components", fileName);

    await fs.writeFile(filePath, componentContent);
  }

  /**
   * Generate actual component content based on feature and framework
   */
  generateComponentContent(componentName, featureName, context) {
    const { framework, businessData, aiContent } = context;

    switch (componentName) {
      case "ContactForm":
        return this.generateContactFormComponent(framework, context);

      case "Gallery":
        return this.generateGalleryComponent(framework, context);

      case "TestimonialSection":
        return this.generateTestimonialComponent(framework, context);

      case "LoginForm":
        return this.generateLoginComponent(framework, context);

      case "ReviewList":
        return this.generateReviewComponent(framework, context);

      default:
        return this.generateGenericComponent(componentName, framework, context);
    }
  }

  /**
   * Generate Contact Form component
   */
  generateContactFormComponent(framework, context) {
    const content = context.aiContent || this.getDefaultContent(context);

    if (framework === "react" || framework === "nextjs") {
      return `import React, { useState } from 'react';
import './ContactForm.css';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)}>Send Another Message</button>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      <div className="contact-info">
        <div className="contact-details">
          <h3>Get in Touch</h3>
          <p><strong>Phone:</strong> ${content.contact.phone}</p>
          <p><strong>Email:</strong> ${content.contact.email}</p>
          <p><strong>Address:</strong> ${content.contact.address}</p>
          <p><strong>Hours:</strong> ${content.contact.hours}</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;`;
    }

    // Vue implementation
    if (framework === "vue") {
      return `<template>
  <div class="contact-form-container">
    <h2>Contact Us</h2>
    <div class="contact-info">
      <div class="contact-details">
        <h3>Get in Touch</h3>
        <p><strong>Phone:</strong> ${content.contact.phone}</p>
        <p><strong>Email:</strong> ${content.contact.email}</p>
        <p><strong>Address:</strong> ${content.contact.address}</p>
        <p><strong>Hours:</strong> ${content.contact.hours}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="contact-form" v-if="!submitted">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
          />
        </div>

        <div class="form-group">
          <label for="message">Message *</label>
          <textarea
            id="message"
            rows="5"
            v-model="formData.message"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="submit-button"
        >
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>

      <div v-if="submitted" class="contact-form-success">
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you within 24 hours.</p>
        <button @click="submitted = false">Send Another Message</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const formData = ref<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const isSubmitting = ref(false);
const submitted = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;

  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000));

  submitted.value = true;
  isSubmitting.value = false;
  formData.value = { name: '', email: '', phone: '', message: '' };
};
</script>

<style scoped>
@import './ContactForm.css';
</style>`;
    }

    return `<!-- ${componentName} for ${framework} -->`;
  }

  /**
   * Generate Gallery component
   */
  generateGalleryComponent(framework, context) {
    if (framework === "react" || framework === "nextjs") {
      return `import React, { useState } from 'react';
import './Gallery.css';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const sampleImages: GalleryItem[] = [
  { id: 1, src: '/images/gallery/image1.jpg', alt: 'Gallery Image 1', title: 'Project Showcase 1', category: 'work' },
  { id: 2, src: '/images/gallery/image2.jpg', alt: 'Gallery Image 2', title: 'Project Showcase 2', category: 'work' },
  { id: 3, src: '/images/gallery/image3.jpg', alt: 'Gallery Image 3', title: 'Team Photo', category: 'team' },
  { id: 4, src: '/images/gallery/image4.jpg', alt: 'Gallery Image 4', title: 'Office Space', category: 'office' },
  { id: 5, src: '/images/gallery/image5.jpg', alt: 'Gallery Image 5', title: 'Project Showcase 3', category: 'work' },
  { id: 6, src: '/images/gallery/image6.jpg', alt: 'Gallery Image 6', title: 'Company Event', category: 'events' }
];

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'work', 'team', 'office', 'events'];

  const filteredImages = filter === 'all'
    ? sampleImages
    : sampleImages.filter(img => img.category === filter);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>

      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category}
            className={\`filter-btn \${filter === category ? 'active' : ''}\`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredImages.map(image => (
          <div
            key={image.id}
            className="gallery-item"
            onClick={() => setSelectedImage(image)}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
            <div className="gallery-overlay">
              <h3>{image.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <h3>{selectedImage.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;`;
    }

    return `<!-- Gallery component for ${framework} -->`;
  }

  /**
   * Generate Testimonial component
   */
  generateTestimonialComponent(framework, context) {
    const content = context.aiContent || this.getDefaultContent(context);

    if (framework === "react" || framework === "nextjs") {
      return `import React, { useState, useEffect } from 'react';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "Tech Innovations",
    content: "${content.testimonials[0]}",
    rating: 5,
    avatar: "/images/avatars/sarah.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    company: "Growth Co",
    content: "${content.testimonials[1]}",
    rating: 5,
    avatar: "/images/avatars/michael.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Project Manager",
    company: "Solutions Inc",
    content: "${content.testimonials[2]}",
    rating: 5,
    avatar: "/images/avatars/emily.jpg"
  }
];

export const TestimonialSection: React.FC
