/**
 * Direct Project Generator - Bypasses Broken Templates
 * Generates working PWA projects directly without relying on Handlebars templates
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { ContentGenerator } from "../ai/ContentGenerator.js";
import { EnhancedPageGenerator } from "./EnhancedPageGenerator.js";

export class DirectProjectGenerator {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || "./generated-pwa",
      typescript: options.typescript !== false,
      ...options,
    };

    this.contentGenerator = new ContentGenerator();
    this.enhancedPageGenerator = new EnhancedPageGenerator(
      this.contentGenerator,
    );
  }

  /**
   * Generate complete project directly
   */
  async generateProject(config) {
    console.log(chalk.blue("🚀 Production-Ready PWA Generation Starting..."));

    try {
      const context = await this.buildContext(config);

      // Create directory structure
      await this.createDirectoryStructure(context);

      // Generate enhanced pages with comprehensive content
      await this.enhancedPageGenerator.generatePages(context);

      // Generate all other files directly
      await this.generateAllFiles(context);

      console.log(
        chalk.green("✅ Production-Ready PWA generated successfully!"),
      );

      return {
        success: true,
        path: this.options.outputDir,
        framework: context.framework,
        features: context.selectedFeatures,
        pages: context.pages,
        components: context.components,
      };
    } catch (error) {
      console.error(chalk.red("❌ Error in direct generation:"), error);
      throw error;
    }
  }

  /**
   * Build context for generation
   */
  async buildContext(config) {
    // Generate AI content if available
    let aiContent = null;
    try {
      aiContent = await this.contentGenerator.generateDemoContent(
        config.industry || "small-business",
        {
          name: config.businessName || "My Business",
          location: config.location || "Your City",
        },
      );
    } catch (error) {
      aiContent = this.getDefaultContent(config);
    }

    const selectedFeatures = config.features || config.selectedFeatures || [];
    const pages = this.determinePagesFromFeatures(selectedFeatures);
    const components = this.determineComponentsFromFeatures(selectedFeatures);

    return {
      projectName: config.projectName || "my-pwa-app",
      businessName: config.businessName || "My Business",
      description: config.description || "An AI-powered PWA application",
      framework: config.framework || "react",
      industry: config.industry || "small-business",
      selectedFeatures,
      pages,
      components,
      aiContent,
      outputDir: this.options.outputDir,
    };
  }

  /**
   * Determine pages based on selected features
   */
  determinePagesFromFeatures(features) {
    const pages = ["home", "about", "services"]; // Always include these

    if (features.includes("contact-form")) pages.push("contact");
    if (features.includes("gallery")) pages.push("gallery");
    if (features.includes("testimonials")) pages.push("testimonials");
    if (features.includes("auth")) pages.push("login", "register", "profile");
    if (features.includes("reviews")) pages.push("reviews");

    return [...new Set(pages)];
  }

  /**
   * Determine components based on selected features
   */
  determineComponentsFromFeatures(features) {
    const components = ["Navigation", "LoadingSpinner", "ErrorFallback"]; // Always include these

    if (features.includes("contact-form")) components.push("ContactForm");
    if (features.includes("gallery")) components.push("Gallery");
    if (features.includes("testimonials"))
      components.push("TestimonialSection");
    if (features.includes("auth")) components.push("LoginForm", "RegisterForm");
    if (features.includes("reviews")) components.push("ReviewList");

    return [...new Set(components)];
  }

  /**
   * Create directory structure
   */
  async createDirectoryStructure(context) {
    const dirs = [
      "src",
      "src/components",
      "src/pages",
      "src/styles",
      "src/utils",
      "src/hooks",
      "src/types",
      "public",
      "public/images",
      "public/icons",
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.options.outputDir, dir));
    }
  }

  /**
   * Generate all files
   */
  async generateAllFiles(context) {
    // Generate package.json
    await this.generatePackageJson(context);

    // Generate main App file
    await this.generateAppFile(context);

    // Generate all pages
    await this.generatePages(context);

    // Generate all components
    await this.generateComponents(context);

    // Generate styles
    await this.generateStyles(context);

    // Generate config files
    await this.generateConfigFiles(context);

    // Generate public files
    await this.generatePublicFiles(context);

    // Generate service worker
    await this.generateServiceWorker(context);

    // Generate PWA icons
    await this.generatePWAIcons(context);
  }

  /**
   * Generate package.json
   */
  async generatePackageJson(context) {
    const packageJson = {
      name: context.projectName,
      version: "1.0.0",
      description: context.description,
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.20.0",
        "react-error-boundary": "^4.0.11",
      },
      devDependencies: {
        "@types/react": "^18.2.37",
        "@types/react-dom": "^18.2.15",
        "@typescript-eslint/eslint-plugin": "^6.10.0",
        "@typescript-eslint/parser": "^6.10.0",
        "@vitejs/plugin-react": "^4.1.0",
        eslint: "^8.53.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.4",
        typescript: "^5.2.2",
        vite: "^4.5.0",
      },
    };

    await fs.writeJSON(
      path.join(this.options.outputDir, "package.json"),
      packageJson,
      { spaces: 2 },
    );
  }

  /**
   * Generate main App.tsx file
   */
  async generateAppFile(context) {
    const appContent = this.generateReactApp(context);
    await fs.writeFile(
      path.join(this.options.outputDir, "src/App.tsx"),
      appContent,
    );
  }

  /**
   * Generate React App component
   */
  generateReactApp(context) {
    const { pages, selectedFeatures } = context;

    const imports = pages
      .map(
        (page) =>
          `const ${this.capitalize(page)} = lazy(() => import('./pages/${this.capitalize(page)}'));`,
      )
      .join("\n");

    const routes = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        return `            <Route path="${path}" element={<${this.capitalize(page)} />} />`;
      })
      .join("\n");

    return `import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorFallback from './components/ErrorFallback';
import './styles/main.css';

// Lazy load pages
${imports}

const App: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
${routes}
                <Route path="*" element={
                  <div className="not-found">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;`;
  }

  /**
   * Generate all pages
   */
  async generatePages(context) {
    for (const pageName of context.pages) {
      const pageContent = this.generatePageContent(pageName, context);
      await fs.writeFile(
        path.join(
          this.options.outputDir,
          `src/pages/${this.capitalize(pageName)}.tsx`,
        ),
        pageContent,
      );

      // Generate CSS file for pages that need them
      if (this.pageNeedsCSS(pageName, context)) {
        const cssContent = this.generatePageCSS(pageName, context);
        await fs.writeFile(
          path.join(
            this.options.outputDir,
            `src/pages/${this.capitalize(pageName)}.css`,
          ),
          cssContent,
        );
      }
    }

    // Generate shared pages.css file for PageGenerator compatibility
    const sharedPagesCSS = this.generateSharedPagesCSS(context);
    await fs.writeFile(
      path.join(this.options.outputDir, "src/pages/pages.css"),
      sharedPagesCSS,
    );
  }

  /**
   * Generate page content
   */
  generatePageContent(pageName, context) {
    const { aiContent } = context;
    const businessName = context.businessName;

    switch (pageName) {
      case "home":
        return this.generateHomePage(aiContent, businessName);
      case "about":
        return this.generateAboutPage(aiContent, businessName);
      case "services":
        return this.generateServicesPage(aiContent, businessName);
      case "contact":
        return this.generateContactPage(aiContent, businessName);
      case "gallery":
        return this.generateGalleryPage(aiContent, businessName);
      case "testimonials":
        return this.generateTestimonialsPage(aiContent, businessName);
      case "login":
        return this.generateLoginPage(businessName);
      case "register":
        return this.generateRegisterPage(businessName);
      case "reviews":
        return this.generateReviewsPage(aiContent, businessName);
      default:
        return this.generateGenericPage(pageName, businessName);
    }
  }

  /**
   * Generate Home page
   */
  generateHomePage(content, businessName) {
    const heroTitle = content?.hero?.title || businessName;
    const heroSubtitle =
      content?.hero?.subtitle || `Welcome to ${businessName}`;
    const services = content?.services || [
      "Quality Service",
      "Professional Team",
      "Customer Focused",
    ];

    return `import React from 'react';
import './pages.css';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">${heroTitle}</h1>
          <p className="hero-subtitle">${heroSubtitle}</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            ${services
              .map(
                (service) => `
            <div className="feature-card">
              <h3>${service}</h3>
              <p>We excel in providing ${service.toLowerCase()} that exceeds expectations.</p>
            </div>`,
              )
              .join("")}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;`;
  }

  /**
   * Generate About page
   */
  generateAboutPage(content, businessName) {
    const aboutContent =
      content?.about?.content ||
      `${businessName} is dedicated to providing exceptional service.`;

    return `import React from 'react';
import './pages.css';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About ${businessName}</h1>
        <p className="page-subtitle">Learn more about our company and mission</p>
      </div>

      <div className="container">
        <section className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>${aboutContent}</p>

            <h3>Our Mission</h3>
            <p>To deliver outstanding results while building lasting relationships with our clients.</p>

            <h3>Our Vision</h3>
            <p>To be the leading provider of innovative solutions in our industry.</p>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Integrity</h3>
              <p>We believe in integrity as a core principle of our business.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We embrace innovation to serve our clients better.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;`;
  }

  /**
   * Generate Services page
   */
  generateServicesPage(content, businessName) {
    const services = content?.services || [
      "Professional Consulting",
      "Quality Solutions",
      "Customer Support",
    ];

    return `import React from 'react';
import './pages.css';
import './Services.css';

const Services: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Our Services</h1>
        <p className="page-subtitle">Comprehensive solutions tailored to your needs</p>
      </div>

      <div className="container">
        <div className="services-grid">
          ${services
            .map(
              (service, index) => `
          <div className="service-card">
            <div className="service-icon"></div>
            <h3>${service}</h3>
            <p>Professional ${service.toLowerCase()} services designed to help your business succeed.</p>
            <ul className="service-features">
              <li>Expert consultation</li>
              <li>Custom solutions</li>
              <li>Ongoing support</li>
            </ul>
            <div className="service-price">Contact for pricing</div>
            <button className="service-cta">Learn More</button>
          </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  );
};

export default Services;`;
  }

  /**
   * Generate Contact page
   */
  generateContactPage(content, businessName) {
    const contact = content?.contact || {
      phone: "(555) 123-4567",
      email: "contact@example.com",
      address: "123 Main Street, Your City",
      hours: "Mon-Fri: 9AM-6PM",
    };

    return `import React, { useState } from 'react';
import './pages.css';
import './Contact.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
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
        <h1>Contact Us</h1>
        <p className="page-subtitle">Get in touch with our team</p>
      </div>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Phone:</strong> ${contact.phone}
              </div>
              <div className="contact-item">
                <strong>Email:</strong> ${contact.email}
              </div>
              <div className="contact-item">
                <strong>Address:</strong> ${contact.address}
              </div>
              <div className="contact-item">
                <strong>Hours:</strong> ${contact.hours}
              </div>
            </div>
          </div>

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

export default Contact;`;
  }

  /**
   * Generate Gallery page
   */
  generateGalleryPage(content, businessName) {
    return `import React, { useState } from 'react';
import './pages.css';
import './Gallery.css';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const sampleImages: GalleryItem[] = [
  { id: 1, src: '/images/gallery/image1.jpg', alt: 'Gallery Image 1', title: 'Project 1', category: 'work' },
  { id: 2, src: '/images/gallery/image2.jpg', alt: 'Gallery Image 2', title: 'Project 2', category: 'work' },
  { id: 3, src: '/images/gallery/image3.jpg', alt: 'Gallery Image 3', title: 'Team Photo', category: 'team' },
  { id: 4, src: '/images/gallery/image4.jpg', alt: 'Gallery Image 4', title: 'Office Space', category: 'office' },
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'work', 'team', 'office'];
  const filteredImages = filter === 'all' ? sampleImages : sampleImages.filter(img => img.category === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gallery</h1>
        <p className="page-subtitle">Explore our work and achievements</p>
      </div>

      <div className="container">
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
              <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <h3>{selectedImage.title}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;`;
  }

  /**
   * Generate Navigation component
   */
  async generateNavigation(context) {
    const { pages, businessName } = context;

    const navLinks = pages
      .map((page) => {
        const path = page === "home" ? "/" : `/${page}`;
        const label = this.capitalize(page);
        return `          <Link to="${path}" className="nav-link">${label}</Link>`;
      })
      .join("\n");

    const navigationContent = `import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ${businessName}
        </Link>

        <div className="nav-menu">
${navLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/components/Navigation.tsx"),
      navigationContent,
    );

    // Generate Navigation.css
    const navigationCSS = `/* Navigation Component Styles */
.navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-link.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/components/Navigation.css"),
      navigationCSS,
    );
  }

  /**
   * Generate components
   */
  async generateComponents(context) {
    // Generate Navigation
    await this.generateNavigation(context);

    // Generate LoadingSpinner
    await this.generateLoadingSpinner();

    // Generate ErrorFallback
    await this.generateErrorFallback();
  }

  /**
   * Generate LoadingSpinner component
   */
  async generateLoadingSpinner() {
    const spinnerContent = `import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...'
}) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/components/LoadingSpinner.tsx"),
      spinnerContent,
    );
  }

  /**
   * Generate ErrorFallback component
   */
  async generateErrorFallback() {
    const errorContent = `import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We're sorry, but something unexpected happened.</p>
      <button onClick={resetErrorBoundary} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/components/ErrorFallback.tsx"),
      errorContent,
    );
  }

  /**
   * Generate styles
   */
  async generateStyles(context) {
    const mainCSS = `/* Main Application Styles */

/* Reset and base styles */
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

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation */
.navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* Main content */
.main-content {
  flex: 1;
  margin-top: 70px;
}

/* Page containers */
.page-container {
  min-height: calc(100vh - 70px);
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

/* Hero section */
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
.values-section,
.about-content,
.services-section {
  padding: 4rem 0;
}

.features-section h2,
.values-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

/* Grids */
.features-grid,
.values-grid,
.services-grid {
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

/* Cards */
.feature-card,
.value-card,
.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover,
.value-card:hover,
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.feature-card h3,
.value-card h3,
.service-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
}

/* Contact page */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 3rem;
}

.contact-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.contact-item {
  margin-bottom: 1rem;
  color: #555;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  border-radius: 8px;
  font-size: 1rem;
}

.submit-button {
  background: #667eea;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background: #5a6fd8;
}

/* Gallery */
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
  background: #667eea;
  color: white;
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
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem;
}

/* Loading spinner */
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error fallback */
.error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
}

/* Success message */
.success-message {
  background: #d4edda;
  color: #155724;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }

  .nav-container {
    padding: 1rem;
  }
}`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/styles/main.css"),
      mainCSS,
    );
  }

  /**
   * Generate config files
   */
  async generateConfigFiles(context) {
    // Generate tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }],
    };

    await fs.writeJSON(
      path.join(this.options.outputDir, "tsconfig.json"),
      tsConfig,
      { spaces: 2 },
    );

    // Generate vite.config.ts
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;

    await fs.writeFile(
      path.join(this.options.outputDir, "vite.config.ts"),
      viteConfig,
    );

    // Generate index.html
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${context.description}" />
    <meta name="theme-color" content="#667eea" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icon-192x192.png" />
    <title>${context.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    await fs.writeFile(
      path.join(this.options.outputDir, "index.html"),
      indexHtml,
    );

    // Generate main.tsx
    const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Register service worker with development-friendly error handling
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    // Clear old service worker caches first
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes('pwa-cache') || cacheName.includes('pwa-generator')) {
            caches.delete(cacheName);
            console.log('🧹 Cleared old cache:', cacheName);
          }
        });
      });
    }

    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
        });
      })
      .catch((error) => {
        // Only log as warning in development, not as error
        if (window.location.hostname === 'localhost') {
          console.warn('⚠️ Service Worker registration failed (development):', error.message);
        } else {
          console.error('❌ Service Worker registration failed:', error);
        }
      });
  });
} else if ('serviceWorker' in navigator) {
  console.info('ℹ️ Service Worker not registered (requires HTTPS or localhost)');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    await fs.writeFile(
      path.join(this.options.outputDir, "src/main.tsx"),
      mainTsx,
    );
  }

  /**
   * Generate public files
   */
  async generatePublicFiles(context) {
    // Generate basic manifest.json
    const manifest = {
      name: context.projectName,
      short_name: context.businessName,
      description: context.description,
      start_url: "/",
      display: "standalone",
      theme_color: "#667eea",
      background_color: "#ffffff",
      icons: [
        {
          src: "/favicon.png",
          sizes: "32x32",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    };

    await fs.writeJSON(
      path.join(this.options.outputDir, "public/manifest.json"),
      manifest,
      { spaces: 2 },
    );

    // Generate basic README
    const readme = `# ${context.projectName}

${context.description}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Features

${context.selectedFeatures.map((feature) => `- ${feature}`).join("\n")}

## Pages

${context.pages.map((page) => `- ${this.capitalize(page)}`).join("\n")}

Generated with PWA Template Generator v2.0
`;

    await fs.writeFile(path.join(this.options.outputDir, "README.md"), readme);
  }

  /**
   * Generate service worker
   */
  async generateServiceWorker(context) {
    const serviceWorkerContent = `// Minimal Development-Only Service Worker
// This SW is designed to not interfere with development

self.addEventListener('install', () => {
  // Install immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip ALL development-related requests to avoid interference
  const url = event.request.url;

  // Skip Vite development files
  if (url.includes('/@vite/') ||
      url.includes('/@react-refresh') ||
      url.includes('/@fs/') ||
      url.includes('?import') ||
      url.includes('?direct') ||
      url.includes('?worker') ||
      url.includes('hot-update') ||
      url.includes('node_modules') ||
      url.includes('.vite/')) {
    return; // Let browser handle these normally
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For everything else, just pass through to network
  // No caching in development to avoid conflicts
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return; // Skip all caching in development
  }

  // Only cache in production
  event.respondWith(
    fetch(event.request).catch(() => {
      // Simple offline fallback only for navigation
      if (event.request.mode === 'navigate') {
        return new Response('App offline', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    })
  );
});`;

    await fs.writeFile(
      path.join(this.options.outputDir, "public/sw.js"),
      serviceWorkerContent,
    );
  }

  /**
   * Generate PWA icons
   */
  async generatePWAIcons(context) {
    // Create simple placeholder icons using SVG
    const createSVGIcon = (size, color = "#667eea") => {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" fill="white" text-anchor="middle" dy="0.35em">${context.businessName.charAt(0).toUpperCase()}</text>
</svg>`;
    };

    // Create proper PNG placeholders with color
    const createPNGIcon = (size) => {
      // Use a minimal but valid 1x1 transparent PNG
      const pngData =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hzyku1wAAAABJRU5ErkJggg==";
      return Buffer.from(pngData, "base64");
    };

    // Generate favicon.svg
    await fs.writeFile(
      path.join(this.options.outputDir, "public/favicon.svg"),
      createSVGIcon(32),
    );

    // Generate proper PNG icon files
    const iconPNG = createPNGIcon(32);

    await fs.writeFile(
      path.join(this.options.outputDir, "public/favicon.png"),
      iconPNG,
    );

    await fs.writeFile(
      path.join(this.options.outputDir, "public/icon-192x192.png"),
      iconPNG,
    );

    await fs.writeFile(
      path.join(this.options.outputDir, "public/icon-512x512.png"),
      iconPNG,
    );

    // Generate icon-144x144.png for additional PWA compatibility
    await fs.writeFile(
      path.join(this.options.outputDir, "public/icon-144x144.png"),
      iconPNG,
    );
  }

  /**
   * Generate remaining page types
   */
  generateTestimonialsPage(content, businessName) {
    const testimonials = content?.testimonials || [
      "Excellent service and professional team!",
      "Highly recommend for quality work.",
      "Outstanding results and great communication.",
    ];

    return `import React from 'react';
import './pages.css';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const testimonialData = [
    ${testimonials
      .map(
        (testimonial, index) => `
    {
      id: ${index + 1},
      content: "${testimonial}",
      author: "Customer ${index + 1}",
      role: "Satisfied Client",
      rating: 5
    }`,
      )
      .join(",")}
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>What Our Clients Say</h1>
        <p className="page-subtitle">Hear from satisfied customers</p>
      </div>

      <div className="container">
        <div className="testimonials-grid">
          {testimonialData.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="stars">{'★'.repeat(testimonial.rating)}</div>
              <p>"{testimonial.content}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;`;
  }

  generateLoginPage(businessName) {
    return `import React, { useState } from 'react';
import './pages.css';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sign In</h1>
        <p className="page-subtitle">Access your account</p>
      </div>

      <div className="container">
        <div className="auth-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;`;
  }

  generateRegisterPage(businessName) {
    return `import React, { useState } from 'react';
import './pages.css';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create Account</h1>
        <p className="page-subtitle">Join our community</p>
      </div>

      <div className="container">
        <div className="auth-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
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
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;`;
  }

  generateReviewsPage(content, businessName) {
    return `import React from 'react';
import './pages.css';
import './Reviews.css';

const Reviews: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Customer Reviews</h1>
        <p className="page-subtitle">See what others are saying</p>
      </div>

      <div className="container">
        <div className="reviews-stats">
          <div className="stat-card">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">127</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>

        <div className="reviews-list">
          <div className="review-card">
            <div className="review-header">
              <span className="review-rating">★★★★★</span>
              <span className="review-date">2 days ago</span>
            </div>
            <p className="review-content">Excellent service and professional team!</p>
            <div className="review-author">John Smith</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;`;
  }

  generateGenericPage(pageName, businessName) {
    return `import React from 'react';
import './pages.css';
import './${this.capitalize(pageName)}.css';

const ${this.capitalize(pageName)}: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${this.capitalize(pageName)}</h1>
        <p className="page-subtitle">Welcome to our ${pageName} page</p>
      </div>

      <div className="container">
        <div className="page-content">
          <p>This is the ${pageName} page content.</p>
        </div>
      </div>
    </div>
  );
};

export default ${this.capitalize(pageName)};`;
  }

  /**
   * Get default content when AI is not available
   */
  getDefaultContent(config) {
    const businessName =
      config.businessName || config.projectName || "My Business";
    const industry = config.industry || "default";

    const contentMap = {
      "cyber-security": {
        hero: {
          title: `${businessName} - Advanced Cybersecurity Solutions`,
          subtitle: "Protecting your digital assets with cutting-edge security technology",
          cta: "Secure Your Business",
        },
        about: {
          title: `About ${businessName}`,
          content: `${businessName} is a leading cybersecurity firm dedicated to protecting organizations from digital threats through innovative security solutions and expert consultation.`,
          benefits: [
            "Advanced Threat Detection",
            "24/7 Security Monitoring",
            "Compliance Expertise",
          ],
        },
        services: [
          "Security Audits",
          "Penetration Testing",
          "Compliance Solutions",
          "Incident Response",
          "Security Training",
        ],
        testimonials: [
          "Their security audit revealed critical vulnerabilities we didn't know existed. Excellent work!",
          "Professional team that takes cybersecurity seriously. Our data is now completely secure.",
          "Best cybersecurity consultants in the business. Highly recommended for enterprise security.",
        ],
        contact: {
          phone: "(555) SEC-URITY",
          email: "security@cybersecurepro.com",
          address: "123 Cyber Lane, Tech City",
          hours: "24/7 Emergency Response",
        },
      },
      restaurant: {
        hero: {
          title: `Welcome to ${businessName}`,
          subtitle: "Exceptional dining experience with fresh, locally-sourced ingredients",
          cta: "Make Reservation",
        },
        about: {
          title: `About ${businessName}`,
          content: `${businessName} offers an exceptional dining experience with fresh, locally-sourced ingredients and expertly crafted dishes in a warm, welcoming atmosphere.`,
          benefits: [
            "Fresh Local Ingredients",
            "Expert Culinary Team",
            "Memorable Dining Experience",
          ],
        },
        services: [
          "Fine Dining",
          "Catering Services",
          "Private Events",
          "Wine Selection",
        ],
        testimonials: [
          "The food was absolutely incredible! Best dining experience in town.",
          "Amazing atmosphere and exceptional service. Highly recommend!",
          "Every dish was a masterpiece. Can't wait to come back!",
        ],
        contact: {
          phone: "(555) DINE-HERE",
          email: "reservations@restaurant.com",
          address: "123 Culinary Street, Food City",
          hours: "Tue-Sun: 5PM-10PM",
        },
      },
      technology: {
        hero: {
          title: `${businessName} - Innovation at Scale`,
          subtitle: "Cutting-edge technology solutions for modern businesses",
          cta: "Start Your Project",
        },
        about: {
          title: `About ${businessName}`,
          content: `${businessName} delivers innovative technology solutions that help businesses scale and succeed in the digital age through expert development and cutting-edge tools.`,
          benefits: [
            "Innovative Solutions",
            "Scalable Architecture",
            "Expert Development Team",
          ],
        },
        services: [
          "Software Development",
          "Cloud Solutions",
          "AI & Machine Learning",
          "DevOps Services",
        ],
        testimonials: [
          "Their technical expertise transformed our business operations.",
          "Outstanding development team with innovative solutions.",
          "Reliable, efficient, and always ahead of the curve.",
        ],
        contact: {
          phone: "(555) TECH-NOW",
          email: "hello@techcompany.com",
          address: "123 Innovation Drive, Tech Valley",
          hours: "Mon-Fri: 9AM-6PM",
        },
      },
      healthcare: {
        hero: {
          title: `${businessName} - Your Health, Our Priority`,
          subtitle: "Comprehensive healthcare services with compassionate care",
          cta: "Schedule Appointment",
        },
        about: {
          title: `About ${businessName}`,
          content: `${businessName} provides comprehensive healthcare services with a focus on compassionate, patient-centered care and the latest medical innovations.`,
          benefits: [
            "Compassionate Care",
            "Latest Medical Technology",
            "Experienced Professionals",
          ],
        },
        services: [
          "Primary Care",
          "Specialist Services",
          "Preventive Care",
          "Emergency Services",
        ],
        testimonials: [
          "Excellent care and very professional staff.",
          "They truly care about their patients' wellbeing.",
          "Best healthcare experience I've ever had.",
        ],
        contact: {
          phone: "(555) HEALTH-1",
          email: "appointments@healthcare.com",
          address: "123 Medical Center Blvd, Health City",
          hours: "Mon-Fri: 8AM-5PM, Emergency: 24/7",
        },
      },
      default: {
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
      },
    };

    return contentMap[industry] || contentMap.default;
  }

  /**
   * Utility function to capitalize strings
   */
  /**
   * Get generated files in web app format
   */
  async getGeneratedFiles() {
    const files = [];
    const outputPath = path.resolve(this.options.outputDir);

    if (!(await fs.pathExists(outputPath))) {
      return files;
    }

    const walkDir = async (dir, basePath = "") => {
      const items = await fs.readdir(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and other build directories
          if (!["node_modules", ".git", "dist", "build"].includes(item)) {
            await walkDir(fullPath, path.join(basePath, item));
          }
        } else {
          // Read file content
          const content = await fs.readFile(fullPath, "utf8");
          const relativePath = path.join(basePath, item);

          // Determine file type
          const ext = path.extname(item).toLowerCase();
          let type = "text";

          if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
            type = "tsx";
          } else if ([".css", ".scss", ".sass"].includes(ext)) {
            type = "css";
          } else if ([".json"].includes(ext)) {
            type = "json";
          } else if ([".html"].includes(ext)) {
            type = "html";
          } else if ([".md"].includes(ext)) {
            type = "md";
          }

          files.push({
            path: relativePath.replace(/\\/g, "/"), // Normalize path separators
            content,
            type,
          });
        }
      }
    };

    await walkDir(outputPath);
    return files;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Determine if a page needs its own CSS file
   */
  pageNeedsCSS(pageName, context) {
    const featuresRequiringCSS = [
      "gallery",
      "booking",
      "chat",
      "payments",
      "reviews",
      "analytics",
      "search",
    ];
    return (
      featuresRequiringCSS.includes(pageName) ||
      context.selectedFeatures.some((feature) =>
        featuresRequiringCSS.includes(feature),
      )
    );
  }

  /**
   * Generate CSS content for a specific page
   */
  generatePageCSS(pageName, context) {
    const pageSpecificCSS = this.getPageSpecificCSS(pageName);
    return `/* ${this.capitalize(pageName)} Page Styles */

${pageSpecificCSS}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
`;
  }

  /**
   * Generate shared pages.css file for PageGenerator compatibility
   */
  generateSharedPagesCSS(context) {
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

/* Form Styles */
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

/* Grid Layouts */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Contact Form */
.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

/* Testimonial Card */
.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.card h3 {
  color: #667eea;
  margin-bottom: 1rem;
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

  .features-grid {
    grid-template-columns: 1fr;
  }

  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
`;
  }

  /**
   * Get page-specific CSS styles
   */
  getPageSpecificCSS(pageName) {
    switch (pageName) {
      case "gallery":
        return `
/* Gallery Page Styles */
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

      case "booking":
        return `
/* Booking Page Styles */
.booking-calendar {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-nav {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-day {
  background: white;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.available {
  background: #d4edda;
  color: #155724;
}

.calendar-day.booked {
  background: #f8d7da;
  color: #721c24;
  cursor: not-allowed;
}

.calendar-day.selected {
  background: #667eea;
  color: white;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.time-slot {
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-slot:hover {
  background: #e9ecef;
}

.time-slot.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.time-slot.unavailable {
  background: #f8d7da;
  color: #721c24;
  cursor: not-allowed;
}

.booking-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.booking-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.booking-summary h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.booking-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}`;

      case "chat":
        return `
/* Chat Page Styles */
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background: #667eea;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #28a745;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  position: relative;
}

.message.user {
  background: #667eea;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message.bot {
  background: #f8f9fa;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ddd;
  gap: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
}

.chat-input button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.chat-input button:hover {
  background: #5a6fd8;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 18px;
  max-width: 70%;
  align-self: flex-start;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccc;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}`;

      case "payments":
        return `
/* Payments Page Styles */
.payment-container {
  max-width: 800px;
  margin: 0 auto;
}

.payment-method-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-method {
  padding: 1.5rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #667eea;
}

.payment-method.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.payment-method-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.payment-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.security-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.payment-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-total {
  font-weight: 700;
  font-size: 1.2rem;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
  margin-top: 1rem;
}

.payment-status {
  text-align: center;
  padding: 2rem;
}

.payment-status.success {
  color: #28a745;
}

.payment-status.error {
  color: #dc3545;
}

.payment-status.processing {
  color: #ffc107;
}

.status-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.processing-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

      case "reviews":
        return `
/* Reviews Page Styles */
.reviews-header {
  text-align: center;
  margin-bottom: 3rem;
}

.reviews-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.review-stat {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  color: #666;
  margin-top: 0.5rem;
}

.stars {
  color: #ffc107;
  margin-bottom: 1rem;
}

.review-filters {
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

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.review-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.reviewer-details h4 {
  margin: 0;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #666;
}

.review-rating {
  color: #ffc107;
  font-size: 1.2rem;
}

.review-content {
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
}

.review-helpful {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.helpful-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.helpful-btn:hover {
  background: #f8f9fa;
}

.helpful-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.write-review-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.write-review-btn:hover {
  background: #5a6fd8;
  transform: scale(1.05);
}`;

      case "analytics":
        return `
/* Analytics Page Styles */
.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.analytics-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.analytics-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.analytics-number {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.analytics-change {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.analytics-change.positive {
  background: #d4edda;
  color: #155724;
}

.analytics-change.negative {
  background: #f8d7da;
  color: #721c24;
}

.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-filters {
  display: flex;
  gap: 0.5rem;
}

.chart-filter {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-filter:hover,
.chart-filter.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chart-placeholder {
  height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
}

.metric-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.metric-trend {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.trend-up {
  color: #28a745;
}

.trend-down {
  color: #dc3545;
}

.data-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.export-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.export-btn:hover {
  background: #218838;
}`;

      case "search":
        return `
/* Search Page Styles */
.search-container {
  max-width: 1000px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 50px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.2rem;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.search-suggestion {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-suggestion:hover {
  background: #f8f9fa;
}

.search-suggestion.active {
  background: #667eea;
  color: white;
}

.search-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-filter {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-filter:hover,
.search-filter.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.search-results {
  margin-top: 2rem;
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-option {
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.sort-option:hover,
.sort-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.search-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.search-result-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.search-result-card:hover {
  transform: translateY(-2px);
}

.result-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.result-title a {
  color: #667eea;
  text-decoration: none;
}

.result-title a:hover {
  text-decoration: underline;
}

.result-snippet {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.result-category {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.search-loading {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.recent-searches {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.recent-searches h3 {
  margin-bottom: 1rem;
  color: #333;
}

.recent-search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recent-search-tag {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-search-tag:hover {
  background: #667eea;
  color: white;
}`;

      case "about":
        return `
/* About Page Styles */
.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.about-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin: 2rem 0 1rem 0;
}

.about-text p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.values-section {
  background: #f8f9fa;
  padding: 4rem 0;
  margin: 4rem -2rem 0 -2rem;
  border-radius: 12px;
}

.values-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 3rem;
  letter-spacing: -0.02em;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.value-card:hover::before {
  transform: scaleX(1);
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.value-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.value-card p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .about-text h2 {
    font-size: 2rem;
  }

  .values-section {
    margin: 2rem -1rem 0 -1rem;
    padding: 3rem 0;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .value-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .about-text h2 {
    font-size: 1.75rem;
  }

  .about-text h3 {
    font-size: 1.25rem;
  }

  .about-text p {
    font-size: 1rem;
  }

  .values-section h2 {
    font-size: 2rem;
  }
}`;

      case "services":
        return `
/* Services Page Styles */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.service-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.75rem;
  color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.service-card h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.375rem;
  font-weight: 600;
}

.service-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  font-size: 1rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  text-align: left;
}

.service-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.service-features li::before {
  content: '✓';
  color: #48bb78;
  font-weight: 600;
  width: 1rem;
  text-align: center;
}

.service-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
}

.service-cta {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  margin-top: auto;
}

.service-cta:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-card {
    padding: 1.5rem;
  }

  .service-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .service-card {
    padding: 1.25rem;
  }

  .service-card h3 {
    font-size: 1.25rem;
  }

  .service-features {
    text-align: center;`
/* Generic Page Styles */
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
}
`;
    }
  }
}

export default DirectProjectGenerator;
