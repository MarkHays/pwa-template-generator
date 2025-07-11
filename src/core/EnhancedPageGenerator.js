/**
 * Enhanced Page Generator - Production-Ready PWA Pages
 * Creates comprehensive, professional pages with multiple sections and rich content
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { CompleteFeatureGenerator } from "./CompleteFeatureGenerator.js";

export class EnhancedPageGenerator {
  constructor(contentGenerator = null) {
    this.contentGenerator = contentGenerator;
    this.completeFeatureGenerator = new CompleteFeatureGenerator();

    // Professional page templates with comprehensive content
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
    };
  }

  /**
   * Generate all pages with comprehensive content
   */
  async generatePages(context) {
    console.log(chalk.blue("📄 Generating production-ready pages..."));

    const { framework, selectedFeatures, outputDir } = context;
    const template = this.pageTemplates[framework];

    if (!template) {
      throw new Error(`Unsupported framework: ${framework}`);
    }

    // Always create comprehensive core pages
    const corePages = ["home", "about", "services"];
    const featurePages = this.getFeaturePages(selectedFeatures);
    const allPages = [...new Set([...corePages, ...featurePages])];

    console.log(
      chalk.gray(`  Creating production pages: ${allPages.join(", ")}`),
    );

    // Generate comprehensive content for all pages
    const pageContent = await this.generateComprehensivePageContent(
      context,
      allPages,
    );

    // Create page files with enhanced templates
    for (const pageName of allPages) {
      await this.createEnhancedPageFile(
        pageName,
        pageContent[pageName],
        template,
        context,
      );
    }

    // Generate all feature-specific pages and components
    await this.completeFeatureGenerator.generateAllFeatures(context);

    // Generate enhanced CSS
    await this.generateEnhancedCSS(context);

    // Generate routing and navigation
    await this.generateRouting(allPages, template, context);
    await this.generateNavigation(allPages, context);

    console.log(chalk.green("✅ Production-ready pages generated!"));
  }

  /**
   * Generate comprehensive page content with multiple sections
   */
  async generateComprehensivePageContent(context, pages) {
    const { businessName, industry, aiContent } = context;
    const content = aiContent || this.getDefaultContent(context);
    const pageContent = {};

    for (const pageName of pages) {
      pageContent[pageName] = await this.getPageContent(
        pageName,
        content,
        context,
      );
    }

    return pageContent;
  }

  /**
   * Get comprehensive content for each page type
   */
  async getPageContent(pageName, content, context) {
    const { businessName, industry } = context;

    switch (pageName) {
      case "home":
        return {
          hero: {
            title:
              content.hero?.title || `${businessName} - Innovation at Scale`,
            subtitle:
              content.hero?.subtitle ||
              "Cutting-edge technology solutions for modern businesses",
            cta: "Get Started Today",
            secondaryCta: "Learn More",
            backgroundImage: "/images/hero-bg.jpg",
          },
          features: {
            title: "Why Choose Us",
            subtitle:
              "We deliver exceptional results with cutting-edge solutions",
            items: [
              {
                icon: "🚀",
                title: "Fast Delivery",
                description:
                  "Quick turnaround times without compromising quality",
              },
              {
                icon: "🎯",
                title: "Precision Focus",
                description: "Laser-focused on your specific business needs",
              },
              {
                icon: "💡",
                title: "Innovation",
                description: "Latest technologies and creative solutions",
              },
              {
                icon: "🛡️",
                title: "Reliability",
                description: "Dependable service you can count on",
              },
            ],
          },
          services: {
            title: "Our Services",
            subtitle: "Comprehensive solutions tailored to your needs",
            items: [
              {
                icon: "💻",
                title: "Software Development",
                description: "Custom software solutions tailored to your needs",
                features: [
                  "Web Applications",
                  "Mobile Apps",
                  "API Development",
                ],
              },
              {
                icon: "☁️",
                title: "Cloud Solutions",
                description: "Scalable cloud infrastructure and services",
                features: ["Cloud Migration", "DevOps", "Infrastructure"],
              },
              {
                icon: "🤖",
                title: "AI & Machine Learning",
                description: "Intelligent automation and data-driven insights",
                features: ["AI Integration", "Data Analytics", "Automation"],
              },
            ],
          },
          stats: {
            title: "Our Impact",
            items: [
              { number: "500+", label: "Projects Completed" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "5 Years", label: "Industry Experience" },
              { number: "24/7", label: "Support Available" },
            ],
          },
          testimonials: {
            title: "What Our Clients Say",
            items: [
              {
                text: "Exceptional service and outstanding results. They exceeded our expectations in every way.",
                author: "Sarah Johnson",
                company: "Tech Corp",
                rating: 5,
              },
              {
                text: "Professional, reliable, and innovative. Our project was delivered on time and within budget.",
                author: "Michael Chen",
                company: "StartupXYZ",
                rating: 5,
              },
              {
                text: "The team's expertise and attention to detail made all the difference. Highly recommended!",
                author: "Emily Rodriguez",
                company: "Growth LLC",
                rating: 5,
              },
            ],
          },
          faq: {
            title: "Frequently Asked Questions",
            items: [
              {
                question: "What is your typical project timeline?",
                answer:
                  "Project timelines vary based on complexity, but most projects are completed within 2-8 weeks.",
              },
              {
                question: "Do you provide ongoing support?",
                answer:
                  "Yes, we offer comprehensive support and maintenance packages for all our solutions.",
              },
              {
                question: "What industries do you serve?",
                answer:
                  "We work with businesses across various industries including tech, healthcare, finance, and retail.",
              },
              {
                question: "How do you ensure project quality?",
                answer:
                  "We follow rigorous testing procedures and maintain regular communication throughout the project.",
              },
            ],
          },
          cta: {
            title: "Ready to Get Started?",
            subtitle:
              "Let's discuss your project and bring your vision to life",
            buttonText: "Contact Us Today",
            secondaryText: "Free consultation available",
          },
        };

      case "about":
        return {
          hero: {
            title: `About ${businessName}`,
            subtitle:
              "Learn more about our story, mission, and the team behind our success",
          },
          story: {
            title: "Our Story",
            content: `${businessName} was founded with a simple mission: to provide exceptional services that exceed our clients' expectations. With years of experience in the technology industry, we've built a reputation for quality, reliability, and innovation.`,
            timeline: [
              {
                year: "2019",
                event: "Company Founded",
                description:
                  "Started with a vision to transform digital experiences",
              },
              {
                year: "2020",
                event: "First Major Client",
                description: "Secured our first enterprise-level partnership",
              },
              {
                year: "2021",
                event: "Team Expansion",
                description: "Grew our team to 15+ skilled professionals",
              },
              {
                year: "2022",
                event: "Innovation Award",
                description: "Recognized for excellence in digital innovation",
              },
              {
                year: "2023",
                event: "Global Reach",
                description: "Expanded services to international markets",
              },
            ],
          },
          mission: {
            title: "Our Mission",
            content:
              "We are committed to delivering outstanding results while maintaining the highest standards of professionalism and customer service. Our team of experts works tirelessly to ensure your success.",
            vision:
              "To be the leading provider of innovative digital solutions that empower businesses to thrive in the modern economy.",
            values: [
              {
                title: "Integrity",
                description:
                  "We maintain the highest ethical standards in all our interactions",
              },
              {
                title: "Excellence",
                description:
                  "We strive for perfection in every project we undertake",
              },
              {
                title: "Innovation",
                description:
                  "We embrace new technologies and creative problem-solving",
              },
              {
                title: "Customer Focus",
                description: "Your success is our primary objective",
              },
            ],
          },
          team: {
            title: "Meet Our Team",
            subtitle: "The talented individuals who make our success possible",
            members: [
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                bio: "Visionary leader with 15+ years in technology and business development",
                image: "/images/team-ceo.jpg",
                social: {
                  linkedin: "#",
                  twitter: "#",
                },
              },
              {
                name: "Sarah Martinez",
                role: "CTO",
                bio: "Technology expert passionate about innovation and scalable solutions",
                image: "/images/team-cto.jpg",
                social: {
                  linkedin: "#",
                  github: "#",
                },
              },
              {
                name: "Michael Chen",
                role: "Head of Design",
                bio: "Creative designer focused on user experience and visual excellence",
                image: "/images/team-design.jpg",
                social: {
                  linkedin: "#",
                  dribbble: "#",
                },
              },
              {
                name: "Emily Rodriguez",
                role: "Project Manager",
                bio: "Results-driven professional ensuring projects are delivered on time",
                image: "/images/team-pm.jpg",
                social: {
                  linkedin: "#",
                },
              },
            ],
          },
          awards: {
            title: "Recognition & Awards",
            items: [
              {
                year: "2023",
                award: "Digital Innovation Excellence Award",
                organization: "Tech Industry Association",
              },
              {
                year: "2022",
                award: "Best Small Business Technology Provider",
                organization: "Business Excellence Council",
              },
              {
                year: "2021",
                award: "Customer Service Excellence",
                organization: "Service Quality Institute",
              },
            ],
          },
          cta: {
            title: "Want to Work With Us?",
            subtitle: "Join our growing list of satisfied clients",
            buttonText: "Start Your Project",
          },
        };

      case "services":
        return {
          hero: {
            title: "Our Services",
            subtitle:
              "Comprehensive solutions designed to drive your business forward",
          },
          services: [
            {
              icon: "💻",
              title: "Software Development",
              description:
                "Custom software solutions tailored to your unique business requirements",
              features: [
                "Web Application Development",
                "Mobile App Development",
                "API Development & Integration",
                "Database Design & Optimization",
                "Legacy System Modernization",
              ],
              pricing: "Starting at $5,000",
              timeline: "4-12 weeks",
            },
            {
              icon: "☁️",
              title: "Cloud Solutions",
              description:
                "Scalable cloud infrastructure and services for modern businesses",
              features: [
                "Cloud Migration & Strategy",
                "DevOps & CI/CD Pipeline",
                "Infrastructure as Code",
                "Cloud Security & Compliance",
                "Performance Monitoring",
              ],
              pricing: "Starting at $3,000",
              timeline: "2-8 weeks",
            },
            {
              icon: "🤖",
              title: "AI & Machine Learning",
              description:
                "Intelligent automation and data-driven insights for competitive advantage",
              features: [
                "AI Strategy & Implementation",
                "Machine Learning Models",
                "Natural Language Processing",
                "Computer Vision Solutions",
                "Data Analytics & Insights",
              ],
              pricing: "Starting at $8,000",
              timeline: "6-16 weeks",
            },
            {
              icon: "🎨",
              title: "UI/UX Design",
              description:
                "User-centered design that creates exceptional digital experiences",
              features: [
                "User Research & Analysis",
                "Wireframing & Prototyping",
                "Visual Design & Branding",
                "Usability Testing",
                "Design System Development",
              ],
              pricing: "Starting at $2,500",
              timeline: "3-6 weeks",
            },
          ],
          process: {
            title: "Our Process",
            subtitle: "How we deliver exceptional results",
            steps: [
              {
                step: "01",
                title: "Discovery",
                description:
                  "We start by understanding your business goals and requirements",
              },
              {
                step: "02",
                title: "Planning",
                description:
                  "Detailed project planning and strategy development",
              },
              {
                step: "03",
                title: "Design",
                description:
                  "Creating wireframes, mockups, and user experience designs",
              },
              {
                step: "04",
                title: "Development",
                description: "Building your solution with clean, scalable code",
              },
              {
                step: "05",
                title: "Testing",
                description:
                  "Rigorous testing to ensure quality and performance",
              },
              {
                step: "06",
                title: "Launch",
                description: "Deployment and go-live support",
              },
            ],
          },
          testimonials: {
            title: "Success Stories",
            items: [
              {
                text: "Their software development team delivered exactly what we needed. The solution has improved our efficiency by 40%.",
                author: "David Park",
                company: "Innovation Corp",
                service: "Software Development",
              },
              {
                text: "The cloud migration was seamless. Our applications are now faster and more reliable than ever.",
                author: "Lisa Thompson",
                company: "Growth Enterprises",
                service: "Cloud Solutions",
              },
            ],
          },
          cta: {
            title: "Ready to Start Your Project?",
            subtitle: "Let's discuss how we can help achieve your goals",
            buttonText: "Get Free Consultation",
            features: [
              "Free initial consultation",
              "Detailed project proposal",
              "Transparent pricing",
              "Flexible engagement models",
            ],
          },
        };

      case "contact":
        return {
          hero: {
            title: "Get in Touch",
            subtitle:
              "Ready to start your next project? We'd love to hear from you.",
          },
          contactInfo: {
            phone: "+1 (555) 123-4567",
            email: "hello@company.com",
            address: "123 Business St, Suite 100, City, State 12345",
            hours: "Monday - Friday: 9AM - 6PM",
          },
          form: {
            title: "Send us a message",
            fields: ["name", "email", "phone", "service", "message"],
          },
          social: {
            title: "Follow Us",
            links: [
              { platform: "LinkedIn", url: "#", icon: "linkedin" },
              { platform: "Twitter", url: "#", icon: "twitter" },
              { platform: "GitHub", url: "#", icon: "github" },
            ],
          },
        };

      default:
        return {
          title: this.capitalize(pageName),
          subtitle: `Welcome to our ${pageName} page`,
          content: `This is the comprehensive ${pageName} page content.`,
        };
    }
  }

  /**
   * Get default content when AI content is not available
   */
  getDefaultContent(context) {
    const { businessName, industry } = context;

    return {
      hero: {
        title: `${businessName} - Professional Services`,
        subtitle: "Quality solutions for your business needs",
        cta: "Get Started",
      },
      about: {
        title: `About ${businessName}`,
        content: `${businessName} is dedicated to providing exceptional service with a focus on quality and customer satisfaction.`,
        benefits: [
          "Quality Service",
          "Professional Team",
          "Customer Focused",
          "Reliable Solutions",
        ],
      },
      services: [
        {
          title: "Professional Services",
          description:
            "High-quality professional services tailored to your needs",
          features: ["Expert Team", "Quality Results", "Timely Delivery"],
        },
        {
          title: "Consultation",
          description:
            "Expert consultation to help you make informed decisions",
          features: ["Strategic Planning", "Expert Advice", "Custom Solutions"],
        },
        {
          title: "Support",
          description: "Ongoing support to ensure your continued success",
          features: ["24/7 Support", "Regular Updates", "Maintenance"],
        },
      ],
      testimonials: [
        {
          text: "Excellent service and professional results. Highly recommended!",
          author: "Satisfied Customer",
          company: "Business Inc",
        },
        {
          text: "Professional team that delivers on their promises.",
          author: "Happy Client",
          company: "Company LLC",
        },
      ],
    };
  }

  /**
   * React page wrapper with comprehensive sections
   */
  getReactPageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    switch (pageName) {
      case "home":
        return `import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">${content.hero.title}</h1>
          <p className="hero-subtitle">${content.hero.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">${content.hero.cta}</button>
            <button className="btn btn-secondary">${content.hero.secondaryCta}</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🚀</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>${content.features.title}</h2>
            <p>${content.features.subtitle}</p>
          </div>
          <div className="features-grid">
            ${content.features.items
              .map(
                (feature) => `
            <div className="feature-card">
              <div className="feature-icon">${feature.icon}</div>
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>${content.services.title}</h2>
            <p>${content.services.subtitle}</p>
          </div>
          <div className="services-grid">
            ${content.services.items
              .map(
                (service) => `
            <div className="service-card">
              <div className="service-icon">${service.icon}</div>
              <h3>${service.title}</h3>
              <p>${service.description}</p>
              <ul className="service-features">
                ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2>${content.stats.title}</h2>
          <div className="stats-grid">
            ${content.stats.items
              .map(
                (stat) => `
            <div className="stat-card">
              <div className="stat-number">${stat.number}</div>
              <div className="stat-label">${stat.label}</div>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>${content.testimonials.title}</h2>
          <div className="testimonials-grid">
            ${content.testimonials.items
              .map(
                (testimonial) => `
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ${"★".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"${testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>${testimonial.author}</strong>
                <span>${testimonial.company}</span>
              </div>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>${content.faq.title}</h2>
          <div className="faq-grid">
            ${content.faq.items
              .map(
                (faq) => `
            <div className="faq-item">
              <h3 className="faq-question">${faq.question}</h3>
              <p className="faq-answer">${faq.answer}</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>${content.cta.title}</h2>
            <p>${content.cta.subtitle}</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">${content.cta.buttonText}</Link>
              <span className="cta-note">${content.cta.secondaryText}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ${componentName};`;

      case "about":
        return `import React from 'react';
import './About.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>${content.hero.title}</h1>
          <p>${content.hero.subtitle}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>${content.story.title}</h2>
              <p>${content.story.content}</p>
            </div>
            <div className="story-timeline">
              <h3>Our Journey</h3>
              <div className="timeline">
                ${content.story.timeline
                  .map(
                    (item) => `
                <div className="timeline-item">
                  <div className="timeline-year">${item.year}</div>
                  <div className="timeline-content">
                    <h4>${item.event}</h4>
                    <p>${item.description}</p>
                  </div>
                </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <h2>${content.mission.title}</h2>
              <p>${content.mission.content}</p>
              <div className="vision-box">
                <h3>Our Vision</h3>
                <p>${content.mission.vision}</p>
              </div>
            </div>
            <div className="values-grid">
              <h3>Our Values</h3>
              ${content.mission.values
                .map(
                  (value) => `
              <div className="value-card">
                <h4>${value.title}</h4>
                <p>${value.description}</p>
              </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>${content.team.title}</h2>
            <p>${content.team.subtitle}</p>
          </div>
          <div className="team-grid">
            ${content.team.members
              .map(
                (member) => `
            <div className="team-card">
              <div className="team-image">
                <div className="team-placeholder">👤</div>
              </div>
              <div className="team-info">
                <h3>${member.name}</h3>
                <p className="team-role">${member.role}</p>
                <p className="team-bio">${member.bio}</p>
                <div className="team-social">
                  ${Object.entries(member.social)
                    .map(
                      ([platform, url]) => `
                  <a href="${url}" className="social-link">${platform}</a>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="awards-section">
        <div className="container">
          <h2>${content.awards.title}</h2>
          <div className="awards-grid">
            ${content.awards.items
              .map(
                (award) => `
            <div className="award-card">
              <div className="award-year">${award.year}</div>
              <h3>${award.award}</h3>
              <p>${award.organization}</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>${content.cta.title}</h2>
            <p>${content.cta.subtitle}</p>
            <a href="/contact" className="btn btn-primary">${content.cta.buttonText}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ${componentName};`;

      case "services":
        return `import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1>${content.hero.title}</h1>
          <p>${content.hero.subtitle}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            ${content.services
              .map(
                (service) => `
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon">${service.icon}</div>
                <h3>${service.title}</h3>
              </div>
              <p className="service-description">${service.description}</p>
              <ul className="service-features">
                ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
              <div className="service-meta">
                <div className="service-pricing">${service.pricing}</div>
                <div className="service-timeline">${service.timeline}</div>
              </div>
              <Link to="/contact" className="btn btn-outline">Get Quote</Link>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>${content.process.title}</h2>
            <p>${content.process.subtitle}</p>
          </div>
          <div className="process-steps">
            ${content.process.steps
              .map(
                (step) => `
            <div className="process-step">
              <div className="step-number">${step.step}</div>
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>${content.testimonials.title}</h2>
          <div className="testimonials-grid">
            ${content.testimonials.items
              .map(
                (testimonial) => `
            <div className="testimonial-card">
              <p className="testimonial-text">"${testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>${testimonial.author}</strong>
                <span>${testimonial.company}</span>
                <small>Used: ${testimonial.service}</small>
              </div>
            </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>${content.cta.title}</h2>
            <p>${content.cta.subtitle}</p>
            <div className="cta-features">
              ${content.cta.features
                .map(
                  (feature) => `
              <div className="cta-feature">✓ ${feature}</div>
              `,
                )
                .join("")}
            </div>
            <Link to="/contact" className="btn btn-primary">${content.cta.buttonText}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ${componentName};`;

      case "contact":
        return `import React, { useState } from 'react';
import './Contact.css';

const ${componentName}: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>${content.hero.title}</h1>
          <p>${content.hero.subtitle}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>${content.contactInfo.phone}</p>
              </div>
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>${content.contactInfo.email}</p>
              </div>
              <div className="contact-item">
                <h3>📍 Address</h3>
                <p>${content.contactInfo.address}</p>
              </div>
              <div className="contact-item">
                <h3>🕒 Hours</h3>
                <p>${content.contactInfo.hours}</p>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>${content.social.title}</h3>
                <div className="social-links">
                  ${content.social.links
                    .map(
                      (link) => `
                  <a href="${link.url}" className="social-link">${link.platform}</a>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h2>${content.form.title}</h2>
              <form onSubmit={handleSubmit}>
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
                  <label htmlFor="service">Service Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Select a service</option>
                    <option value="software">Software Development</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="ai">AI & Machine Learning</option>
                    <option value="design">UI/UX Design</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ${componentName};`;

      default:
        return `import React from 'react';
import './Page.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="${pageName}-page">
      <div className="container">
        <h1>${content.title}</h1>
        <p>${content.subtitle}</p>
        <div className="page-content">
          <p>${content.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;
    }
  }

  /**
   * Generate enhanced CSS for production-ready styling
   */
  async generateEnhancedCSS(context) {
    const { outputDir } = context;
    const cssContent = await this.getProductionReadyCSS();

    // Create individual CSS files for each page
    const pageStyles = {
      "Home.css": this.getHomePageCSS(),
      "About.css": this.getAboutPageCSS(),
      "Services.css": this.getServicesPageCSS(),
      "Contact.css": this.getContactPageCSS(),
      "Page.css": this.getGenericPageCSS(),
      "Navigation.css": this.getNavigationCSS(),
    };

    // Write main CSS file
    await fs.writeFile(path.join(outputDir, "src/styles/main.css"), cssContent);

    // Write individual page CSS files
    for (const [filename, content] of Object.entries(pageStyles)) {
      await fs.writeFile(path.join(outputDir, "src/pages", filename), content);
    }
  }

  /**
   * Get production-ready CSS content
   */
  async getProductionReadyCSS() {
    const cssPath = path.join(
      process.cwd(),
      "src/core/production-ready-styles.css",
    );
    try {
      return await fs.readFile(cssPath, "utf8");
    } catch (error) {
      console.warn("Production CSS file not found, using fallback styles");
      return this.getFallbackCSS();
    }
  }

  /**
   * Get Home page specific CSS
   */
  getHomePageCSS() {
    return `@import '../styles/main.css';

/* Home Page Specific Styles */
.home-page {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
  gap: 4rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-placeholder {
  font-size: 8rem;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Service cards hover effects */
.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Stats counter animation */
.stat-number {
  counter-reset: stat-counter;
  animation: countUp 2s ease-out;
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`;
  }

  /**
   * Get About page specific CSS
   */
  getAboutPageCSS() {
    return `@import '../styles/main.css';

/* About Page Specific Styles */
.about-page {
  min-height: 100vh;
}

.timeline-item {
  opacity: 0;
  animation: slideInLeft 0.6s ease forwards;
}

.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.2s; }
.timeline-item:nth-child(3) { animation-delay: 0.3s; }
.timeline-item:nth-child(4) { animation-delay: 0.4s; }
.timeline-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.value-card {
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.team-card {
  transition: all 0.3s ease;
}

.team-card:hover .team-placeholder {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}`;
  }

  /**
   * Get Services page specific CSS
   */
  getServicesPageCSS() {
    return `@import '../styles/main.css';

/* Services Page Specific Styles */
.services-page {
  min-height: 100vh;
}

.service-card {
  position: relative;
  overflow: hidden;
}

.service-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.service-card:hover::after {
  left: 100%;
}

.process-step {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.process-step:nth-child(1) { animation-delay: 0.1s; }
.process-step:nth-child(2) { animation-delay: 0.2s; }
.process-step:nth-child(3) { animation-delay: 0.3s; }
.process-step:nth-child(4) { animation-delay: 0.4s; }
.process-step:nth-child(5) { animation-delay: 0.5s; }
.process-step:nth-child(6) { animation-delay: 0.6s; }

.step-number {
  position: relative;
  overflow: hidden;
}

.step-number::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.process-step:hover .step-number::before {
  left: 100%;
}`;
  }

  /**
   * Get Contact page specific CSS
   */
  getContactPageCSS() {
    return `@import '../styles/main.css';

/* Contact Page Specific Styles */
.contact-page {
  min-height: 100vh;
}

.contact-form {
  position: relative;
}

.form-group {
  position: relative;
}

.form-group input:focus + label,
.form-group textarea:focus + label,
.form-group select:focus + label {
  transform: translateY(-20px) scale(0.8);
  color: #667eea;
}

.form-group input,
.form-group textarea,
.form-group select {
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.contact-item {
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 8px;
}

.contact-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(5px);
}

.social-link {
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}`;
  }

  /**
   * Get Navigation CSS
   */
  getNavigationCSS() {
    return `/* Navigation Component Styles */
.navbar {
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
position: sticky;
top: 0;
z-index: 1000;
transition: all 0.3s ease;
}

.navbar .container {
display: flex;
justify-content: space-between;
align-items: center;
padding: 1rem 20px;
}

.nav-brand {
font-size: 1.5rem;
font-weight: 700;
color: #1a1a1a;
}

.brand-link {
text-decoration: none;
color: inherit;
transition: color 0.3s ease;
}

.brand-link:hover {
color: #667eea;
}

.nav-menu {
display: flex;
align-items: center;
gap: 2rem;
margin: 0;
padding: 0;
list-style: none;
}

.nav-link {
text-decoration: none;
color: #333;
font-weight: 500;
padding: 0.5rem 1rem;
border-radius: 6px;
transition: all 0.3s ease;
position: relative;
font-size: 0.95rem;
}

.nav-link:hover,
.nav-link.active {
color: #667eea;
background: rgba(102, 126, 234, 0.1);
}

.nav-toggle {
display: none;
flex-direction: column;
cursor: pointer;
padding: 0.5rem;
gap: 4px;
border-radius: 4px;
transition: all 0.3s ease;
}

.nav-toggle span {
width: 25px;
height: 3px;
background: #333;
transition: all 0.3s ease;
border-radius: 2px;
}

@media (max-width: 768px) {
.nav-toggle {
  display: flex;
}

.nav-menu {
  position: fixed;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  gap: 1rem;
  transform: translateY(-100vh);
  transition: transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.nav-menu.active {
  transform: translateY(0);
}

.nav-link {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  width: 200px;
  text-align: center;
  border-radius: 8px;
}
}`;
  }

  /**
   * Get generic page CSS
   */
  getGenericPageCSS() {
    return `@import '../styles/main.css';

/* Generic Page Styles */
.page-content {
  padding: 2rem 0;
}

.page-content h1 {
  margin-bottom: 1.5rem;
}

.page-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}`;
  }

  /**
   * Get fallback CSS if production CSS file is not found
   */
  getFallbackCSS() {
    return `/* Fallback CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.hero-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

section {
  padding: 80px 0;
}

.features-grid,
.services-grid,
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card,
.service-card,
.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}`;
  }

  /**
   * Get feature pages from selected features
   */
  getFeaturePages(selectedFeatures) {
    const pages = [];

    if (selectedFeatures.includes("contact-form")) pages.push("contact");
    if (selectedFeatures.includes("gallery")) pages.push("gallery");
    if (selectedFeatures.includes("testimonials")) pages.push("testimonials");
    if (selectedFeatures.includes("auth"))
      pages.push("login", "register", "profile");
    if (selectedFeatures.includes("reviews")) pages.push("reviews");
    if (selectedFeatures.includes("portfolio")) pages.push("portfolio");
    if (selectedFeatures.includes("chat")) pages.push("chat");
    if (selectedFeatures.includes("booking")) pages.push("booking");
    if (selectedFeatures.includes("blog")) pages.push("blog");
    if (selectedFeatures.includes("ecommerce")) pages.push("ecommerce");
    if (selectedFeatures.includes("security")) pages.push("security");

    return pages;
  }

  /**
   * Create enhanced page file
   */
  async createEnhancedPageFile(pageName, content, template, context) {
    const { framework, outputDir } = context;
    const fileName = `${this.capitalize(pageName)}.${template.extension}`;
    const filePath = path.join(outputDir, "src/pages", fileName);

    const pageCode = template.wrapper(pageName, content, context);
    await fs.writeFile(filePath, pageCode);
  }

  /**
   * Generate routing configuration
   */
  async generateRouting(pages, template, context) {
    const { framework, outputDir } = context;

    if (framework === "react") {
      const routingCode = this.getReactRoutingCode(pages);
      await fs.writeFile(
        path.join(outputDir, "src/components/AppRouter.tsx"),
        routingCode,
      );
    }
  }

  /**
   * Generate React routing code
   */
  getReactRoutingCode(pages) {
    const imports = pages
      .map(
        (page) =>
          `import ${this.capitalize(page)} from '../pages/${this.capitalize(page)}';`,
      )
      .join("\n");

    const routes = pages
      .map(
        (page) =>
          `        <Route path="${page === "home" ? "/" : `/${page}`}" element={<${this.capitalize(page)} />} />`,
      )
      .join("\n");

    return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
${imports}

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
${routes}
      </Routes>
    </Router>
  );
};

export default AppRouter;`;
  }

  /**
   * Generate navigation component
   */
  async generateNavigation(pages, context) {
    const { framework, outputDir } = context;

    if (framework === "react") {
      const navCode = this.getReactNavigationCode(pages, context);
      await fs.writeFile(
        path.join(outputDir, "src/components/Navigation.tsx"),
        navCode,
      );
    }
  }

  /**
   * Generate React navigation code
   */
  getReactNavigationCode(pages, context) {
    const { businessName } = context;

    const navItems = pages.map((page) => ({
      name: this.capitalize(page),
      path: page === "home" ? "/" : `/${page}`,
    }));

    return `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = ${JSON.stringify(navItems, null, 2)};

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            ${businessName}
          </Link>
        </div>

        <div className={\`nav-menu \${isOpen ? 'active' : ''}\`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={\`nav-link \${location.pathname === item.path ? 'active' : ''}\`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;`;
  }

  /**
   * Capitalize first letter of string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Vue page wrapper (placeholder)
   */
  getVuePageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    return `<template>
  <div class="${pageName}-page">
    <div class="container">
      <h1>{{ content.title }}</h1>
      <p>{{ content.subtitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      content: ${JSON.stringify(content, null, 2)}
    };
  }
};
</script>

<style scoped>
@import '../styles/main.css';
</style>`;
  }

  /**
   * Next.js page wrapper (placeholder)
   */
  getNextPageWrapper(pageName, content, context) {
    const componentName = this.capitalize(pageName);

    return `import React from 'react';
import Head from 'next/head';

const ${componentName}: React.FC = () => {
  return (
    <>
      <Head>
        <title>${content.title || componentName}</title>
        <meta name="description" content="${content.subtitle || ""}" />
      </Head>
      <div className="${pageName}-page">
        <div className="container">
          <h1>${content.title || componentName}</h1>
          <p>${content.subtitle || ""}</p>
        </div>
      </div>
    </>
  );
};

export default ${componentName};`;
  }
}
