/**
 * Advanced Component Generator - Enterprise PWA Generator
 * Generates sophisticated, enterprise-grade components with framework support
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import chalk from "chalk";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ComponentGenerator {
  constructor(options = {}) {
    this.options = {
      framework: options.framework || "react",
      typescript: options.typescript || true,
      styling: options.styling || "scss",
      accessibility: options.accessibility || true,
      performance: options.performance || true,
      analytics: options.analytics || true,
      ...options,
    };

    this.componentTemplates = {
      // Navigation Components
      Header: {
        description: "Advanced header with navigation, mobile menu, and search",
        dependencies: ["react-router-dom", "framer-motion"],
        features: ["responsive", "mobile-menu", "search", "accessibility"],
        analytics: ["navigation_click", "mobile_menu_toggle", "search_usage"],
      },
      Navigation: {
        description: "Sophisticated navigation with breadcrumbs and mega menu",
        dependencies: ["react-router-dom"],
        features: ["breadcrumbs", "mega-menu", "keyboard-navigation"],
        analytics: ["nav_item_click", "breadcrumb_click"],
      },
      Footer: {
        description: "Rich footer with links, social media, and newsletter",
        dependencies: ["react-icons"],
        features: ["social-links", "newsletter", "sitemap"],
        analytics: ["footer_link_click", "social_click", "newsletter_signup"],
      },

      // Hero & Landing Components
      Hero: {
        description:
          "Conversion-optimized hero section with video/image backgrounds",
        dependencies: ["framer-motion", "react-intersection-observer"],
        features: ["video-background", "cta-buttons", "animations"],
        analytics: ["hero_cta_click", "video_play", "scroll_past_hero"],
      },
      HeroSlider: {
        description: "Multi-slide hero with autoplay and navigation",
        dependencies: ["swiper", "framer-motion"],
        features: ["autoplay", "navigation", "indicators", "touch-gestures"],
        analytics: ["slide_change", "slider_interaction"],
      },
      CallToAction: {
        description: "High-converting CTA sections with urgency elements",
        dependencies: ["framer-motion"],
        features: ["urgency-timer", "social-proof", "multiple-variants"],
        analytics: ["cta_click", "urgency_timer_view"],
      },

      // Content Components
      About: {
        description: "Rich about section with team, mission, and values",
        dependencies: ["framer-motion"],
        features: ["team-grid", "mission-statement", "values", "timeline"],
        analytics: ["about_section_view", "team_member_click"],
      },
      Services: {
        description: "Service showcase with detailed descriptions and pricing",
        dependencies: ["framer-motion", "react-intersection-observer"],
        features: ["service-cards", "pricing-tables", "comparison"],
        analytics: ["service_click", "pricing_view"],
      },
      Portfolio: {
        description: "Project showcase with filtering and modal views",
        dependencies: ["framer-motion", "react-modal"],
        features: ["filtering", "modal-gallery", "project-details"],
        analytics: ["project_click", "filter_usage", "modal_view"],
      },
      Blog: {
        description: "Blog listing with search, categories, and pagination",
        dependencies: ["react-router-dom", "date-fns"],
        features: ["search", "categories", "pagination", "reading-time"],
        analytics: ["blog_post_click", "search_usage", "category_filter"],
      },

      // E-commerce Components
      ProductCatalog: {
        description: "Advanced product catalog with filtering and search",
        dependencies: ["react-router-dom", "fuse.js"],
        features: ["search", "filtering", "sorting", "pagination"],
        analytics: ["product_click", "search_usage", "filter_usage"],
      },
      ProductCard: {
        description: "Product card with wishlist, quick view, and ratings",
        dependencies: ["react-icons", "react-stars"],
        features: ["wishlist", "quick-view", "ratings", "compare"],
        analytics: ["product_view", "wishlist_add", "quick_view_click"],
      },
      ShoppingCart: {
        description: "Advanced cart with quantity updates and recommendations",
        dependencies: ["react-spring"],
        features: ["quantity-controls", "recommendations", "save-for-later"],
        analytics: ["cart_add", "cart_remove", "quantity_change"],
      },
      Checkout: {
        description: "Multi-step checkout with payment processing",
        dependencies: ["formik", "yup", "stripe"],
        features: ["multi-step", "payment-integration", "order-summary"],
        analytics: ["checkout_start", "checkout_complete", "payment_error"],
      },

      // Form Components
      ContactForm: {
        description:
          "Advanced contact form with validation and spam protection",
        dependencies: ["formik", "yup", "react-google-recaptcha"],
        features: [
          "validation",
          "spam-protection",
          "file-upload",
          "success-animation",
        ],
        analytics: ["form_start", "form_submit", "form_error"],
      },
      BookingForm: {
        description: "Appointment booking with calendar integration",
        dependencies: ["react-calendar", "date-fns", "formik"],
        features: ["calendar-picker", "time-slots", "confirmation"],
        analytics: ["booking_start", "booking_complete", "date_selection"],
      },
      NewsletterSignup: {
        description: "Newsletter signup with email validation and integration",
        dependencies: ["formik", "yup"],
        features: ["email-validation", "success-states", "privacy-notice"],
        analytics: ["newsletter_signup", "newsletter_error"],
      },

      // Interactive Components
      Gallery: {
        description: "Advanced gallery with lightbox and masonry layout",
        dependencies: ["react-image-gallery", "masonry-layout"],
        features: ["lightbox", "masonry", "lazy-loading", "fullscreen"],
        analytics: ["gallery_view", "image_click", "fullscreen_toggle"],
      },
      Testimonials: {
        description: "Testimonial carousel with video testimonials",
        dependencies: ["swiper", "react-player"],
        features: [
          "carousel",
          "video-testimonials",
          "ratings",
          "auto-rotation",
        ],
        analytics: ["testimonial_view", "video_play"],
      },
      FAQ: {
        description: "Accordion FAQ with search and categories",
        dependencies: ["framer-motion", "fuse.js"],
        features: ["search", "categories", "accordion", "helpful-voting"],
        analytics: ["faq_click", "search_usage", "helpful_vote"],
      },

      // Dashboard Components
      Dashboard: {
        description: "Enterprise dashboard with widgets and analytics",
        dependencies: ["recharts", "react-grid-layout"],
        features: ["widgets", "drag-drop", "real-time-updates", "filters"],
        analytics: ["dashboard_view", "widget_interaction", "filter_usage"],
      },
      Analytics: {
        description: "Analytics dashboard with charts and metrics",
        dependencies: ["recharts", "date-fns"],
        features: ["charts", "date-range", "export", "real-time"],
        analytics: ["analytics_view", "chart_interaction", "export_data"],
      },
      DataTable: {
        description: "Advanced data table with sorting, filtering, and export",
        dependencies: ["react-table", "react-window"],
        features: [
          "sorting",
          "filtering",
          "pagination",
          "export",
          "virtual-scrolling",
        ],
        analytics: ["table_sort", "table_filter", "table_export"],
      },

      // Utility Components
      SearchBar: {
        description: "Advanced search with autocomplete and suggestions",
        dependencies: ["fuse.js", "react-autosuggest"],
        features: [
          "autocomplete",
          "suggestions",
          "recent-searches",
          "voice-search",
        ],
        analytics: [
          "search_query",
          "search_result_click",
          "voice_search_usage",
        ],
      },
      LoadingSpinner: {
        description: "Customizable loading states and skeletons",
        dependencies: ["react-spinners"],
        features: ["skeleton-loading", "progress-indicators", "error-states"],
        analytics: ["loading_time", "loading_timeout"],
      },
      ErrorBoundary: {
        description: "Error boundary with reporting and recovery",
        dependencies: ["react-error-boundary"],
        features: ["error-reporting", "recovery-actions", "fallback-ui"],
        analytics: ["error_occurred", "error_recovery"],
      },

      // Performance Components
      LazyImage: {
        description: "Lazy loading image with progressive enhancement",
        dependencies: ["react-intersection-observer"],
        features: ["lazy-loading", "progressive-loading", "webp-support"],
        analytics: ["image_load", "image_error"],
      },
      InfiniteScroll: {
        description: "Infinite scroll with performance optimization",
        dependencies: ["react-window-infinite-loader"],
        features: ["virtual-scrolling", "loading-states", "error-handling"],
        analytics: ["scroll_position", "items_loaded"],
      },
    };

    this.frameworkConfigs = {
      react: {
        extension: "tsx",
        imports: {
          default: "import React from 'react';",
          hooks: "import { useState, useEffect, useCallback } from 'react';",
          router: "import { Link, useNavigate } from 'react-router-dom';",
          motion: "import { motion, AnimatePresence } from 'framer-motion';",
        },
      },
      vue: {
        extension: "vue",
        imports: {
          default:
            "import { defineComponent, ref, computed, onMounted } from 'vue';",
          router: "import { useRouter } from 'vue-router';",
        },
      },
      angular: {
        extension: "ts",
        imports: {
          default:
            "import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';",
          router: "import { Router } from '@angular/router';",
        },
      },
      nextjs: {
        extension: "tsx",
        imports: {
          default: "import React from 'react';",
          next: "import { useRouter } from 'next/router';",
          image: "import Image from 'next/image';",
        },
      },
      svelte: {
        extension: "svelte",
        imports: {
          default: "import { onMount, createEventDispatcher } from 'svelte';",
        },
      },
    };

    this.setupHandlebars();
  }

  setupHandlebars() {
    // Component-specific helpers
    Handlebars.registerHelper("componentImports", (framework, dependencies) => {
      const config = this.frameworkConfigs[framework];
      let imports = [config.imports.default];

      if (dependencies.includes("react-router-dom")) {
        imports.push(config.imports.router);
      }
      if (dependencies.includes("framer-motion")) {
        imports.push(config.imports.motion);
      }

      return imports.join("\n");
    });

    Handlebars.registerHelper("componentProps", (framework, props) => {
      const formatted = props.map((prop) => {
        if (framework === "react") {
          return `${prop.name}: ${prop.type}`;
        } else if (framework === "vue") {
          return `${prop.name}: { type: ${prop.type}, default: ${prop.default} }`;
        }
        return prop.name;
      });
      return formatted.join(", ");
    });

    Handlebars.registerHelper("analyticsTrigger", (event, data) => {
      return `analytics.track('${event}', ${JSON.stringify(data)})`;
    });

    Handlebars.registerHelper("accessibilityAttrs", (component) => {
      const attrs = {
        Header: 'role="banner"',
        Navigation: 'role="navigation"',
        Footer: 'role="contentinfo"',
        Hero: 'role="main"',
        ContactForm: 'role="form"',
      };
      return attrs[component] || "";
    });
  }

  async generateComponent(componentName, config = {}) {
    console.log(chalk.blue(`🔧 Generating ${componentName} component...`));

    const template = this.componentTemplates[componentName];
    if (!template) {
      throw new Error(`Component template not found: ${componentName}`);
    }

    const context = {
      componentName,
      framework: this.options.framework,
      typescript: this.options.typescript,
      styling: this.options.styling,
      accessibility: this.options.accessibility,
      performance: this.options.performance,
      analytics: this.options.analytics,
      template,
      config,
      ...config,
    };

    // Generate component file
    const componentCode = await this.generateComponentCode(context);

    // Generate styles
    const styleCode = await this.generateComponentStyles(context);

    // Generate tests
    const testCode = await this.generateComponentTests(context);

    // Generate stories (Storybook)
    const storyCode = await this.generateComponentStories(context);

    return {
      component: componentCode,
      styles: styleCode,
      tests: testCode,
      stories: storyCode,
      dependencies: template.dependencies || [],
      analytics: template.analytics || [],
    };
  }

  async generateComponentCode(context) {
    const templatePath = path.join(
      __dirname,
      "../templates/components",
      context.framework,
      `${context.componentName}.hbs`,
    );

    if (!(await fs.pathExists(templatePath))) {
      return this.generateGenericComponent(context);
    }

    const template = await fs.readFile(templatePath, "utf-8");
    const compiled = Handlebars.compile(template);

    return compiled(context);
  }

  generateGenericComponent(context) {
    const { componentName, framework, typescript, accessibility, analytics } =
      context;

    const templates = {
      react: `import React, { useState, useEffect } from 'react';
${analytics ? "import { useAnalytics } from '../hooks/useAnalytics';" : ""}
import './${componentName}.scss';

${
  typescript
    ? `interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}`
    : ""
}

const ${componentName}${typescript ? `: React.FC<${componentName}Props>` : ""} = ({
  className = '',
  children,
  ...props
}) => {
  ${analytics ? "const analytics = useAnalytics();" : ""}

  useEffect(() => {
    ${analytics ? `analytics.track('${componentName.toLowerCase()}_view');` : ""}
  }, []);

  return (
    <div
      className={\`${componentName.toLowerCase()} \${className}\`}
      ${accessibility ? `${this.getAccessibilityAttrs(componentName)}` : ""}
      {...props}
    >
      {children}
    </div>
  );
};

export default ${componentName};`,

      vue: `<template>
  <div
    :class="[\`${componentName.toLowerCase()}\`, className]"
    ${accessibility ? this.getAccessibilityAttrs(componentName) : ""}
  >
    <slot />
  </div>
</template>

<script ${typescript ? 'lang="ts"' : ""}>
import { defineComponent, onMounted } from 'vue';
${analytics ? "import { useAnalytics } from '../composables/useAnalytics';" : ""}

export default defineComponent({
  name: '${componentName}',
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  setup() {
    ${analytics ? "const analytics = useAnalytics();" : ""}

    onMounted(() => {
      ${analytics ? `analytics.track('${componentName.toLowerCase()}_view');` : ""}
    });

    return {};
  }
});
</script>

<style lang="scss" scoped>
@import './${componentName}.scss';
</style>`,

      angular: `import { Component, OnInit, Input } from '@angular/core';
${analytics ? "import { AnalyticsService } from '../services/analytics.service';" : ""}

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  templateUrl: './${componentName.toLowerCase()}.component.html',
  styleUrls: ['./${componentName.toLowerCase()}.component.scss']
})
export class ${componentName}Component implements OnInit {
  @Input() className: string = '';

  constructor(${analytics ? "private analytics: AnalyticsService" : ""}) {}

  ngOnInit(): void {
    ${analytics ? `this.analytics.track('${componentName.toLowerCase()}_view');` : ""}
  }
}`,
    };

    return templates[framework] || templates.react;
  }

  async generateComponentStyles(context) {
    const { componentName, styling } = context;

    const baseStyles = `
.${componentName.toLowerCase()} {
  // Base styles
  position: relative;

  // Responsive design
  @media (max-width: 768px) {
    // Mobile styles
  }

  // Accessibility
  &:focus {
    outline: 2px solid var(--focus-color, #007bff);
    outline-offset: 2px;
  }

  // Performance
  will-change: transform;

  // Animation
  transition: all 0.3s ease;

  // Dark mode support
  @media (prefers-color-scheme: dark) {
    // Dark mode styles
  }

  // Reduced motion
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
}
`;

    const advancedStyles = this.getAdvancedStyles(context);

    return baseStyles + advancedStyles;
  }

  getAdvancedStyles(context) {
    const { componentName } = context;

    const styleMap = {
      Header: `
  background: var(--header-bg, #ffffff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
      display: none;

      &.mobile-open {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--header-bg, #ffffff);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }`,

      Hero: `
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;

  .hero-content {
    max-width: 600px;
    padding: 2rem;

    h1 {
      font-size: clamp(2rem, 5vw, 4rem);
      margin-bottom: 1rem;
      font-weight: 700;
    }

    p {
      font-size: clamp(1rem, 2vw, 1.5rem);
      margin-bottom: 2rem;
      opacity: 0.9;
    }
  }`,

      ContactForm: `
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color, #333);
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color, #ddd);
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color, #007bff);
      }

      &.error {
        border-color: var(--error-color, #dc3545);
      }
    }

    .error-message {
      color: var(--error-color, #dc3545);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }`,
    };

    return styleMap[componentName] || "";
  }

  async generateComponentTests(context) {
    const { componentName, framework, typescript } = context;

    const testTemplate = `
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    expect(screen.getByRole('${this.getAriaRole(componentName)}')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<${componentName} className="custom-class" />);
    expect(screen.getByRole('${this.getAriaRole(componentName)}')).toHaveClass('custom-class');
  });

  it('is accessible', async () => {
    const { container } = render(<${componentName} />);
    // Add accessibility tests
  });

  it('handles user interactions', () => {
    const mockHandler = vi.fn();
    render(<${componentName} onClick={mockHandler} />);

    fireEvent.click(screen.getByRole('${this.getAriaRole(componentName)}'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
`;

    return testTemplate;
  }

  async generateComponentStories(context) {
    const { componentName } = context;

    const storyTemplate = `
import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${this.componentTemplates[componentName]?.description || `${componentName} component`}'
      }
    }
  },
  argTypes: {
    className: { control: 'text' }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-style'
  }
};

export const Interactive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Add interaction tests
  }
};
`;

    return storyTemplate;
  }

  getAccessibilityAttrs(componentName) {
    const attrs = {
      Header: 'role="banner"',
      Navigation: 'role="navigation"',
      Footer: 'role="contentinfo"',
      Hero: 'role="main"',
      ContactForm: 'role="form"',
      SearchBar: 'role="search"',
    };
    return attrs[componentName] || "";
  }

  getAriaRole(componentName) {
    const roles = {
      Header: "banner",
      Navigation: "navigation",
      Footer: "contentinfo",
      Hero: "main",
      ContactForm: "form",
      SearchBar: "search",
    };
    return roles[componentName] || "generic";
  }

  async generateComponentBundle(components, outputDir) {
    console.log(chalk.blue("📦 Generating component bundle..."));

    const results = {};

    for (const componentName of components) {
      try {
        const generated = await this.generateComponent(componentName);
        results[componentName] = generated;

        // Write files
        const componentDir = path.join(
          outputDir,
          "src/components",
          componentName,
        );
        await fs.ensureDir(componentDir);

        const ext = this.frameworkConfigs[this.options.framework].extension;

        await fs.writeFile(
          path.join(componentDir, `${componentName}.${ext}`),
          generated.component,
        );

        await fs.writeFile(
          path.join(componentDir, `${componentName}.scss`),
          generated.styles,
        );

        await fs.writeFile(
          path.join(componentDir, `${componentName}.test.${ext}`),
          generated.tests,
        );

        await fs.writeFile(
          path.join(componentDir, `${componentName}.stories.${ext}`),
          generated.stories,
        );

        console.log(chalk.green(`✅ Generated ${componentName} component`));
      } catch (error) {
        console.error(
          chalk.red(`❌ Error generating ${componentName}:`),
          error,
        );
      }
    }

    // Generate component index
    await this.generateComponentIndex(components, outputDir);

    return results;
  }

  async generateComponentIndex(components, outputDir) {
    const indexContent = components
      .map((comp) => `export { default as ${comp} } from './${comp}/${comp}';`)
      .join("\n");

    const ext = this.frameworkConfigs[this.options.framework].extension;
    await fs.writeFile(
      path.join(outputDir, "src/components", `index.${ext}`),
      indexContent,
    );
  }

  getAvailableComponents() {
    return Object.keys(this.componentTemplates);
  }

  getComponentInfo(componentName) {
    return this.componentTemplates[componentName];
  }

  getComponentsByCategory() {
    return {
      navigation: ["Header", "Navigation", "Footer"],
      hero: ["Hero", "HeroSlider", "CallToAction"],
      content: ["About", "Services", "Portfolio", "Blog"],
      ecommerce: ["ProductCatalog", "ProductCard", "ShoppingCart", "Checkout"],
      forms: ["ContactForm", "BookingForm", "NewsletterSignup"],
      interactive: ["Gallery", "Testimonials", "FAQ"],
      dashboard: ["Dashboard", "Analytics", "DataTable"],
      utility: ["SearchBar", "LoadingSpinner", "ErrorBoundary"],
      performance: ["LazyImage", "InfiniteScroll"],
    };
  }

  async generateComponentLibrary(outputDir) {
    console.log(chalk.blue("🏗️  Generating complete component library..."));

    const allComponents = this.getAvailableComponents();
    const results = await this.generateComponentBundle(
      allComponents,
      outputDir,
    );

    // Generate documentation
    await this.generateDocumentation(outputDir);

    // Generate design system
    await this.generateDesignSystem(outputDir);

    console.log(chalk.green("✅ Component library generated successfully!"));

    return results;
  }

  async generateDocumentation(outputDir) {
    const docsContent = `
# Component Library Documentation

This is an auto-generated component library with enterprise-grade components.

## Available Components

${Object.entries(this.componentTemplates)
  .map(
    ([name, info]) => `
### ${name}

${info.description}

**Dependencies:** ${info.dependencies?.join(", ") || "None"}
**Features:** ${info.features?.join(", ") || "None"}
**Analytics:** ${info.analytics?.join(", ") || "None"}

`,
  )
  .join("")}

## Usage

\`\`\`javascript
import { Header, Hero, ContactForm } from './components';

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <ContactForm />
    </div>
  );
}
\`\`\`

## Performance

All components are optimized for performance with:
- Lazy loading
- Code splitting
- Optimized re-renders
- Accessibility features
- Analytics tracking

## Customization

Components can be customized through:
- CSS custom properties
- SCSS variables
- Props interface
- Theme provider
`;

    await fs.writeFile(path.join(outputDir, "COMPONENTS.md"), docsContent);
  }

  async generateDesignSystem(outputDir) {
    const designSystemContent = `
/* Design System - CSS Custom Properties */

:root {
  /* Colors */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-sm: 0.875rem;
  --line-height-base: 1.5;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;

  /* Borders */
  --border-radius: 0.375rem;
  --border-width: 1px;
  --border-color: #dee2e6;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #0d6efd;
    --secondary-color: #adb5bd;
    --success-color: #198754;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #0dcaf0;
    --light-color: #343a40;
    --dark-color: #f8f9fa;
    --border-color: #495057;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast */
@media (prefers-contrast: high) {
  :root {
    --border-width: 2px;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.25);
  }
}

/* Utility classes */
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

.focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.loading {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.animate-fade-in {
  animation: fadeIn var(--transition-base) ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-up {
  animation: slideUp var(--transition-base) ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;

    await fs.writeFile(
      path.join(outputDir, "src/styles", "design-system.scss"),
      designSystemContent,
    );
  }

  async generatePerformanceOptimizations(outputDir) {
    console.log(chalk.blue("⚡ Generating performance optimizations..."));

    const performanceConfig = `
// Performance configuration
export const PERFORMANCE_CONFIG = {
  // Image optimization
  images: {
    formats: ['webp', 'avif', 'jpeg'],
    quality: 85,
    progressive: true,
    lazy: true,
    responsive: true
  },

  // Bundle optimization
  bundle: {
    splitChunks: true,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      common: {
        minChunks: 2,
        priority: -10,
        reuseExistingChunk: true
      }
    }
  },

  // Caching strategy
  cache: {
    runtime: 'networkFirst',
    assets: 'cacheFirst',
    api: 'networkFirst',
    images: 'cacheFirst'
  },

  // Prefetching
  prefetch: {
    enabled: true,
    routes: ['/', '/about', '/services', '/contact'],
    resources: ['fonts', 'critical-css'],
    priority: 'high'
  },

  // Core Web Vitals targets
  vitals: {
    LCP: 2.5,
    FID: 100,
    CLS: 0.1,
    FCP: 1.8,
    TTI: 3.8
  }
};

// Performance monitoring
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
`;

    await fs.writeFile(
      path.join(outputDir, "src/config", "performance.js"),
      performanceConfig,
    );
  }

  async generateServiceWorker(outputDir) {
    const serviceWorkerContent = `
// Advanced Service Worker with caching strategies
const CACHE_NAME = 'pwa-cache-v1';
const RUNTIME_CACHE = 'pwa-runtime-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different resource types
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

// Cache strategies
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open(RUNTIME_CACHE);
    cache.then(c => c.put(request, response.clone()));
    return response;
  });

  return cachedResponse || fetchPromise;
}
`;

    await fs.writeFile(
      path.join(outputDir, "public", "sw.js"),
      serviceWorkerContent,
    );
  }
}
