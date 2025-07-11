/**
 * Page Generator - Creates functional pages with actual content
 * Ensures every page has proper content and functionality
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export class PageGenerator {
  constructor(contentGenerator = null) {
    this.contentGenerator = contentGenerator;

    // Define which features create which pages
    this.featurePageMapping = {
      "contact-form": ["contact"],
      gallery: ["gallery"],
      testimonials: ["testimonials"],
      auth: ["login", "register", "profile"],
      reviews: ["reviews"],
      services: ["services"],
      about: ["about"],
      portfolio: ["portfolio", "projects"],
    };

    // Define page templates for different frameworks
    this.pageTemplates = {
      react: {
        extension: "tsx",
        wrapper: this.getReactPageWrapper.bind(this),
        router: "react-router-dom",
      },
      vue: {
        extension: "vue",
        wrapper: this.getVuePageWrapper.bind(this),
        router: "vue-router",
      },
      nextjs: {
        extension: "tsx",
        wrapper: this.getNextPageWrapper.bind(this),
        router: "built-in",
      },
      angular: {
        extension: "ts",
        wrapper: this.getAngularPageWrapper.bind(this),
        router: "@angular/router",
      },
      svelte: {
        extension: "svelte",
        wrapper: this.getSveltePageWrapper.bind(this),
        router: "svelte-routing",
      },
      astro: {
        extension: "astro",
        wrapper: this.getAstroPageWrapper.bind(this),
        router: "built-in",
      },
    };
  }

  /**
   * Generate all pages based on selected features
   */
  async generatePages(context) {
    console.log(chalk.blue("📄 Generating pages with content..."));

    const { framework, selectedFeatures, outputDir } = context;
    const template = this.pageTemplates[framework];

    if (!template) {
      throw new Error(
        `Unsupported framework for page generation: ${framework}`,
      );
    }

    // Always create core pages
    const corePages = ["home", "about"];
    const featurePages = this.getFeaturePages(selectedFeatures);
    const allPages = [...new Set([...corePages, ...featurePages])];

    console.log(chalk.gray(`  Creating pages: ${allPages.join(", ")}`));

    // Generate content for all pages
    const pageContent = await this.generatePageContent(context, allPages);

    // Create page files
    for (const pageName of allPages) {
      await this.createPageFile(
        pageName,
        pageContent[pageName],
        template,
        context,
      );
    }

    // Generate routing configuration
    await this.generateRouting(allPages, template, context);

    // Generate navigation component
    await this.generateNavigation(allPages, context);

    // Generate CSS files for pages
    await this.generatePageCSS(allPages, context);

    console.log(
      chalk.green(`✅ Generated ${allPages.length} pages successfully`),
    );

    return allPages;
  }

  /**
   * Get pages that should be created based on selected features
   */
  getFeaturePages(selectedFeatures) {
    const pages = [];

    selectedFeatures.forEach((feature) => {
      const featurePages = this.featurePageMapping[feature];
      if (featurePages) {
        pages.push(...featurePages);
      }
    });

    return pages;
  }

  /**
   * Generate content for all pages
   */
  async generatePageContent(context, pages) {
    const content = context.aiContent || this.getDefaultContent(context);
    const pageContent = {};

    for (const pageName of pages) {
      pageContent[pageName] = this.getPageSpecificContent(
        pageName,
        content,
        context,
      );
    }

    return pageContent;
  }

  /**
   * Get content specific to each page
   */
  getPageSpecificContent(pageName, content, context) {
    const { businessData } = context;

    switch (pageName) {
      case "home":
        return {
          title: content.hero?.title || businessData.name,
          subtitle: content.hero?.subtitle || `Welcome to ${businessData.name}`,
          cta: content.hero?.cta || "Get Started",
          features: content.about?.benefits || [
            "Quality Service",
            "Professional Team",
            "Customer Focused",
          ],
          testimonials: content.testimonials?.slice(0, 3) || [],
        };

      case "about":
        return {
          title: content.about?.title || `About ${businessData.name}`,
          content:
            content.about?.content ||
            `${businessData.name} is dedicated to providing exceptional service with a focus on quality and customer satisfaction.`,
          mission:
            "Our mission is to deliver outstanding results while building lasting relationships with our clients.",
          vision:
            "To be the leading provider of innovative solutions in our industry.",
          values: ["Integrity", "Excellence", "Innovation", "Customer Focus"],
          team: [
            {
              name: "John Smith",
              role: "CEO",
              bio: "Experienced leader with 15+ years in the industry",
            },
            {
              name: "Sarah Johnson",
              role: "CTO",
              bio: "Technology expert passionate about innovation",
            },
            {
              name: "Mike Davis",
              role: "Head of Sales",
              bio: "Results-driven professional focused on client success",
            },
          ],
        };

      case "services":
        return {
          title: "Our Services",
          subtitle: "Comprehensive solutions tailored to your needs",
          services:
            content.services?.map((service, index) => ({
              id: index + 1,
              name: service,
              description: `Professional ${service.toLowerCase()} services designed to help your business succeed.`,
              features: [
                "Expert consultation",
                "Custom solutions",
                "Ongoing support",
              ],
              price: "Contact for pricing",
            })) || [],
        };

      case "contact":
        return {
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          contactInfo: content.contact || {
            phone: "(555) 123-4567",
            email: "contact@example.com",
            address: "123 Main Street, Your City",
            hours: "Mon-Fri: 9AM-6PM",
          },
          office: {
            description: "Visit our office for in-person consultations",
            directions:
              "Located in the heart of downtown with easy parking access",
          },
        };

      case "gallery":
        return {
          title: "Gallery",
          subtitle: "Explore our work and achievements",
          categories: ["All", "Projects", "Team", "Events", "Office"],
          images: Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            src: `/images/gallery/image${i + 1}.jpg`,
            alt: `Gallery image ${i + 1}`,
            title: `Gallery Item ${i + 1}`,
            category: ["Projects", "Team", "Events", "Office"][i % 4],
          })),
        };

      case "testimonials":
        return {
          title: "What Our Clients Say",
          subtitle: "Hear from satisfied customers",
          testimonials:
            content.testimonials?.map((testimonial, index) => ({
              id: index + 1,
              content: testimonial,
              author:
                ["Sarah Johnson", "Michael Chen", "Emily Rodriguez"][index] ||
                "Anonymous",
              role:
                ["CEO", "Marketing Director", "Project Manager"][index] ||
                "Client",
              company:
                ["Tech Innovations", "Growth Co", "Solutions Inc"][index] ||
                "Company",
              rating: 5,
            })) || [],
        };

      case "login":
        return {
          title: "Sign In",
          subtitle: "Access your account",
          features: [
            "Secure authentication",
            "Remember me option",
            "Password recovery",
          ],
        };

      case "register":
        return {
          title: "Create Account",
          subtitle: "Join our community",
          benefits: [
            "Exclusive access",
            "Personalized experience",
            "Priority support",
          ],
        };

      case "profile":
        return {
          title: "My Profile",
          subtitle: "Manage your account settings",
          sections: [
            "Personal Information",
            "Security",
            "Preferences",
            "History",
          ],
        };

      case "reviews":
        return {
          title: "Customer Reviews",
          subtitle: "See what others are saying",
          averageRating: 4.8,
          totalReviews: 127,
        };

      default:
        return {
          title: this.capitalize(pageName),
          subtitle: `Welcome to our ${pageName} page`,
          content: `This is the ${pageName} page content.`,
        };
    }
  }

  /**
   * Create individual page file
   */
  async createPageFile(pageName, pageContent, template, context) {
    const { framework, outputDir } = context;
    const fileName = `${this.capitalize(pageName)}.${template.extension}`;
    const filePath = path.join(outputDir, "src/pages", fileName);

    const pageCode = template.wrapper(pageName, pageContent, context);

    await fs.writeFile(filePath, pageCode);
  }

  /**
   * React page wrapper
   */
  getReactPageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    switch (pageName) {
      case "home":
        return `import React from 'react';
import './pages.css';

interface HomeProps {}

const ${componentName}: React.FC<HomeProps> = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">${content.title}</h1>
          <p className="hero-subtitle">${content.subtitle}</p>
          <button className="cta-button">${content.cta}</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            ${content.features
              .map(
                (feature) => `
            <div className="feature-card">
              <h3>${feature}</h3>
              <p>We excel in providing ${feature.toLowerCase()} that exceeds expectations.</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      ${
        content.testimonials.length > 0
          ? `
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            ${content.testimonials
              .map(
                (testimonial) => `
            <div className="testimonial-card">
              <p>"${testimonial}"</p>
              <cite>- Satisfied Customer</cite>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }
    </div>
  );
};

export default ${componentName};`;

      case "about":
        return `import React from 'react';
import './pages.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${content.title}</h1>
        <p className="page-subtitle">Learn more about our company and mission</p>
      </div>

      <div className="container">
        {/* Main Content */}
        <section className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>${content.content}</p>

            <h3>Our Mission</h3>
            <p>${content.mission}</p>

            <h3>Our Vision</h3>
            <p>${content.vision}</p>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            ${content.values
              .map(
                (value) => `
            <div className="value-card">
              <h3>${value}</h3>
              <p>We believe in ${value.toLowerCase()} as a core principle of our business.</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            ${content.team
              .map(
                (member) => `
            <div className="team-card">
              <div className="team-avatar"></div>
              <h3>${member.name}</h3>
              <p className="team-role">${member.role}</p>
              <p className="team-bio">${member.bio}</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ${componentName};`;

      case "contact":
        return `import React, { useState } from 'react';
import './pages.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ${componentName}: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${content.title}</h1>
        <p className="page-subtitle">${content.subtitle}</p>
      </div>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Phone:</strong> ${content.contactInfo.phone}
              </div>
              <div className="contact-item">
                <strong>Email:</strong> ${content.contactInfo.email}
              </div>
              <div className="contact-item">
                <strong>Address:</strong> ${content.contactInfo.address}
              </div>
              <div className="contact-item">
                <strong>Hours:</strong> ${content.contactInfo.hours}
              </div>
            </div>

            <div className="office-info">
              <h3>Visit Our Office</h3>
              <p>${content.office.description}</p>
              <p>${content.office.directions}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            {submitted ? (
              <div className="success-message">
                <h3>Thank you for your message!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>Send us a Message</h2>

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;

      case "services":
        return `import React from 'react';
import './pages.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${content.title}</h1>
        <p className="page-subtitle">${content.subtitle}</p>
      </div>

      <div className="container">
        <div className="services-grid">
          ${content.services
            .map(
              (service) => `
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <ul className="service-features">
              ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
            <div className="service-price">${service.price}</div>
            <button className="service-cta">Learn More</button>
          </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;

      default:
        return `import React from 'react';
import './pages.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${content.title}</h1>
        <p className="page-subtitle">${content.subtitle}</p>
      </div>

      <div className="container">
        <div className="page-content">
          <p>${content.content || `Welcome to the ${pageName} page.`}</p>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;
    }
  }

  /**
   * Vue page wrapper
   */
  getVuePageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    return `<template>
  <div class="page-container">
    <div class="page-header">
      <h1>${content.title}</h1>
      <p class="page-subtitle">${content.subtitle || ""}</p>
    </div>

    <div class="container">
      <div class="page-content">
        <p>${content.content || `Welcome to the ${pageName} page.`}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ${componentName} page component
</script>

<style scoped>
@import './pages.css';
</style>`;
  }

  /**
   * Next.js page wrapper
   */
  getNextPageWrapper(pageName, content, context) {
    return this.getReactPageWrapper(pageName, content, context);
  }

  /**
   * Angular page wrapper
   */
  getAngularPageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${pageName}',
  template: \`
    <div class="page-container">
      <div class="page-header">
        <h1>${content.title}</h1>
        <p class="page-subtitle">${content.subtitle || ""}</p>
      </div>

      <div class="container">
        <div class="page-content">
          <p>${content.content || `Welcome to the ${pageName} page.`}</p>
        </div>
      </div>
    </div>
  \`,
  styleUrls: ['./pages.css']
})
export class ${componentName}Component {
  constructor() {}
}`;
  }

  /**
   * Svelte page wrapper
   */
  getSveltePageWrapper(pageName, content, context) {
    return `<script lang="ts">
  // ${this.capitalize(pageName)} page component
</script>

<div class="page-container">
  <div class="page-header">
    <h1>${content.title}</h1>
    <p class="page-subtitle">${content.subtitle || ""}</p>
  </div>

  <div class="container">
    <div class="page-content">
      <p>${content.content || `Welcome to the ${pageName} page.`}</p>
    </div>
  </div>
</div>

<style>
  @import './pages.css';
</style>`;
  }

  /**
   * Astro page wrapper
   */
  getAstroPageWrapper(pageName, content, context) {
    return `---
title: "${content.title}"
---

<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <div class="page-container">
      <div class="page-header">
        <h1>${content.title}</h1>
        <p class="page-subtitle">${content.subtitle || ""}</p>
      </div>

      <div class="container">
        <div class="page-content">
          <p>${content.content || `Welcome to the ${pageName} page.`}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
  }

  /**
   * Generate routing configuration
   */
  async generateRouting(pages, template, context) {
    const { framework, outputDir } = context;

    let routingContent = "";

    switch (framework) {
      case "react":
        routingContent = this.generateReactRouting(pages);
        await fs.writeFile(path.join(outputDir, "src/App.tsx"), routingContent);
        break;

      case "vue":
        routingContent = this.generateVueRouting(pages);
        await fs.writeFile(
          path.join(outputDir, "src/router/index.ts"),
          routingContent,
        );
        break;

      case "nextjs":
        // Next.js uses file-based routing, no additional config needed
        break;

      case "angular":
        routingContent = this.generateAngularRouting(pages);
        await fs.writeFile(
          path.join(outputDir, "src/app/app-routing.module.ts"),
          routingContent,
        );
        break;
    }
  }

  /**
   * Generate React routing
   */
  generateReactRouting(pages) {
    const imports = pages
      .map(
        (page) =>
          `import ${this.capitalize(page)} from './pages/${this.capitalize(page)}';`,
      )
      .join("\n");

    const routes = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        return `        <Route path="${path}" element={<${this.capitalize(page)} />} />`;
      })
      .join("\n");

    return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
${imports}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
${routes}
        </Routes>
      </div>
    </Router>
  );
}

export default App;`;
  }

  /**
   * Generate Vue routing
   */
  generateVueRouting(pages) {
    const routes = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        return `  {
    path: '${path}',
    name: '${page}',
    component: () => import('../pages/${this.capitalize(page)}.vue')
  }`;
      })
      .join(",\n");

    return `import { createRouter, createWebHistory } from 'vue-router';

const routes = [
${routes}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;`;
  }

  /**
   * Generate Angular routing
   */
  generateAngularRouting(pages) {
    const routes = pages
      .map((page) => {
        const path = page === "home" ? "" : page;
        return `  { path: '${path}', component: ${this.capitalize(page)}Component }`;
      })
      .join(",\n");

    const imports = pages
      .map(
        (page) =>
          `import { ${this.capitalize(page)}Component } from './pages/${page}.component';`,
      )
      .join("\n");

    return `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
${imports}

const routes: Routes = [
${routes}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }`;
  }

  /**
   * Generate navigation component
   */
  async generateNavigation(pages, context) {
    const { framework, outputDir } = context;

    let navContent = "";

    switch (framework) {
      case "react":
      case "nextjs":
        navContent = this.generateReactNavigation(pages, context);
        await fs.writeFile(
          path.join(outputDir, "src/components/Navigation.tsx"),
          navContent,
        );
        break;

      case "vue":
        navContent = this.generateVueNavigation(pages, context);
        await fs.writeFile(
          path.join(outputDir, "src/components/Navigation.vue"),
          navContent,
        );
        break;
    }
  }

  /**
   * Generate React navigation
   */
  generateReactNavigation(pages, context) {
    const navItems = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        const label = this.capitalize(page);
        return `          <Link to="${path}" className="nav-link">${label}</Link>`;
      })
      .join("\n");

    return `import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ${context.businessData.name}
        </Link>

        <div className="nav-menu">
${navItems}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;`;
  }

  /**
   * Generate Vue navigation
   */
  generateVueNavigation(pages, context) {
    const navItems = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        const label = this.capitalize(page);
        return `          <router-link to="${path}" class="nav-link">${label}</router-link>`;
      })
      .join("\n");

    return `<template>
  <nav class="navigation">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        ${context.businessData.name}
      </router-link>

      <div class="nav-menu">
${navItems}
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Navigation component
</script>

<style scoped>
@import './Navigation.css';
</style>`;
  }

  /**
   * Get default content when AI is not available
   */
  getDefaultContent(context) {
    const businessName = context.businessData?.name || "Your Business";

    return {
      hero: {
        title: businessName,
        subtitle: `Welcome to ${businessName} - Your trusted partner`,
        cta: "Get Started",
      },
      about: {
        title: `About ${businessName}`,
        content: `${businessName} is dedicated to providing exceptional service with a focus on quality and customer satisfaction.`,
        benefits: [
          "Professional Service",
          "Quality Solutions",
          "Customer Focused",
        ],
      },
      services: [
        "Professional Consulting",
        "Quality Solutions",
        "Customer Support",
      ],
      testimonials: [
        "Excellent service and professional team!",
        "Highly recommend for quality work.",
        "Outstanding results and great communication.",
      ],
      contact: {
        phone: "(555) 123-4567",
        email: "contact@example.com",
        address: "123 Main Street, Your City",
        hours: "Mon-Fri: 9AM-6PM",
      },
    };
  }

  /**
   * Utility function to capitalize strings
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate CSS files for pages
   */
  async generatePageCSS(pages, context) {
    const { outputDir, framework } = context;
    const fs = (await import("fs-extra")).default;
    const path = (await import("path")).default;

    // Generate shared pages.css file
    const sharedCSS = this.generateSharedPagesCSS();
    const pagesDir = path.join(outputDir, "src/pages");
    await fs.ensureDir(pagesDir);
    await fs.writeFile(path.join(pagesDir, "pages.css"), sharedCSS);

    // Generate individual page CSS files for complex pages
    for (const pageName of pages) {
      if (this.pageNeedsIndividualCSS(pageName)) {
        const pageCSS = this.generateIndividualPageCSS(pageName);
        await fs.writeFile(
          path.join(pagesDir, `${this.capitalize(pageName)}.css`),
          pageCSS,
        );
      }
    }
  }

  /**
   * Check if a page needs its own CSS file
   */
  pageNeedsIndividualCSS(pageName) {
    const complexPages = [
      "gallery",
      "booking",
      "chat",
      "payments",
      "reviews",
      "analytics",
      "search",
    ];
    return complexPages.includes(pageName);
  }

  /**
   * Generate shared CSS for all pages
   */
  generateSharedPagesCSS() {
    return `/* Shared Page Styles */

.page-container {
  min-height: 100vh;
  padding: 2rem 0;
  padding-top: 100px; /* Account for fixed navigation */
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: white;
  color: #667eea;
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

/* About Page Styles */
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.about-text h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.about-text h3 {
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.values-section {
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.value-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.team-section {
  margin-bottom: 3rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.team-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.team-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #667eea;
  margin: 0 auto 1rem;
}

.team-role {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.team-bio {
  color: #666;
  font-size: 0.9rem;
}

/* Contact Form Styles */
.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Contact Info */
.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.contact-icon {
  color: #667eea;
  font-size: 1.2rem;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.service-features li {
  padding: 0.25rem 0;
  color: #666;
}

.service-features li::before {
  content: "✓";
  color: #28a745;
  font-weight: bold;
  margin-right: 0.5rem;
}

.service-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;
}

/* Testimonials */
.testimonials-section {
  background: #f8f9fa;
  padding: 4rem 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.testimonial-content {
  font-style: italic;
  margin-bottom: 1.5rem;
  color: #555;
}

.testimonial-author {
  font-weight: 600;
  color: #333;
}

.testimonial-role {
  color: #666;
  font-size: 0.9rem;
}

.testimonial-rating {
  color: #ffc107;
  margin-bottom: 1rem;
}

/* Auth Forms */
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.auth-form h2 {
  text-align: center;
  color: #667eea;
  margin-bottom: 2rem;
}

.auth-links {
  text-align: center;
  margin-top: 1rem;
}

.auth-links a {
  color: #667eea;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem 0;
    padding-top: 80px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .features-grid,
  .services-grid,
  .testimonials-grid,
  .values-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .container {
    padding: 0 1rem;
  }
}`;
  }

  /**
   * Generate individual page CSS
   */
  generateIndividualPageCSS(pageName) {
    switch (pageName) {
      case "gallery":
        return `/* Gallery Page Specific Styles */
.gallery-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
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
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.modal-content img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
}`;

      default:
        return `/* ${this.capitalize(pageName)} Page Styles */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-section {
  margin-bottom: 3rem;
}

.content-section h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.content-section p {
  line-height: 1.6;
  color: #666;
  margin-bottom: 1rem;
}`;
    }
  }
}

export default PageGenerator;
