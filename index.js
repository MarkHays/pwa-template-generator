#!/usr/bin/env node

/**
 * Enterprise PWA Generator - Phase 2 AI-Powered Solution
 * Creates enterprise-grade PWAs with advanced AI intelligence, competitive analysis,
 * content generation, and performance optimization
 */

import dotenv from "dotenv";
import { Phase2CLI } from "./src/cli/Phase2CLI.js";
import chalk from "chalk";

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  DROPBOX_TOKEN: process.env.DROPBOX_TOKEN,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.log(chalk.yellow("⚠️  Optional environment variables not set:"));
  missingEnvVars.forEach((envVar) => {
    if (envVar === "ANTHROPIC_API_KEY") {
      console.log(
        chalk.gray(
          `   ${envVar} - Claude AI features will run in fallback mode`,
        ),
      );
    } else {
      console.log(chalk.gray(`   ${envVar} - Some features may be limited`));
    }
  });
  console.log(chalk.gray("   Add these to .env file for full functionality\n"));
}

// Initialize the Phase 2 CLI
async function main() {
  try {
    const cli = new Phase2CLI();
    await cli.run();
  } catch (error) {
    console.error(chalk.red("\n💥 Fatal Error:"), error.message);

    if (error.stack) {
      console.error(chalk.gray("\nStack trace:"));
      console.error(chalk.gray(error.stack));
    }

    console.error(chalk.yellow("\n🔧 Troubleshooting:"));
    console.error(
      chalk.gray("1. Add ANTHROPIC_API_KEY to your .env file for AI features"),
    );
    console.error(chalk.gray("2. Ensure you have Node.js 16+ installed"));
    console.error(
      chalk.gray(
        "3. Claude AI features will run in fallback mode without API key",
      ),
    );
    console.error(
      chalk.gray("4. Try running with --verbose flag for more details"),
    );
    console.error(
      chalk.gray("5. Check GitHub issues: https://github.com/your-repo/issues"),
    );

    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\n👋 Generation interrupted. Cleaning up..."));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n\n👋 Generation terminated. Cleaning up..."));
  process.exit(0);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("Unhandled Rejection at:"), promise);
  console.error(chalk.red("Reason:"), reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(chalk.red("Uncaught Exception:"), error);
  process.exit(1);
});

function createProjectStructure(projectPath, answers) {
  // Create directory structure
  const dirs = [
    "public",
    "src",
    "src/components",
    "src/components/common",
    "src/components/layout",
    "src/components/sections",
    "src/pages",
    "src/assets",
    "src/assets/images",
    "src/assets/styles",
  ];

  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    console.log(chalk.blue(`Created directory: ${dir}`));
  });

  // Create public files
  fs.writeFileSync(
    path.join(projectPath, "public", "index.html"),
    `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="${answers.businessName} - Small Business Website" />
      <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
      <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      <title>${answers.businessName}</title>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root"></div>
    </body>
  </html>`,
  );

  fs.writeFileSync(
    path.join(projectPath, "public", "manifest.json"),
    `{
    "short_name": "${answers.projectName}",
    "name": "${answers.businessName} PWA",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "logo512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }`,
  );

  fs.writeFileSync(
    path.join(projectPath, "public", "robots.txt"),
    `# https://www.robotstxt.org/robotstxt.html
  User-agent: *
  Disallow:
  `,
  );

  // Create src files
  fs.writeFileSync(
    path.join(projectPath, "src", "index.js"),
    `import React from 'react';
        import ReactDOM from 'react-dom/client';
        import './assets/styles/index.scss';
        import App from './App.js';
        import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';
        import reportWebVitals from './reportWebVitals.js';

    const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
        <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want your app to work offline and load faster
serviceWorkerRegistration.register();

// Performance monitoring${
      answers.enablePerformanceMonitoring
        ? "\nreportWebVitals(console.log);"
        : "\n// If you want to start measuring performance, uncomment the line below\n// reportWebVitals(console.log);"
    }`,
  );

  fs.writeFileSync(
    path.join(projectPath, "src", "App.js"),
    `import React from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Header from './components/common/Header.js';
import Footer from './components/common/Footer.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Services from './pages/Services.js';
import Contact from './pages/Contact.js';
  import './assets/styles/index.scss';

  function App() {
    return (
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }

  export default App;
  `,
  );

  // Create service worker files
  fs.writeFileSync(
    path.join(projectPath, "src", "serviceWorkerRegistration.js"),
    `// This optional code is used to register a service worker.
  // register() is not called by default.

  // This lets the app load faster on subsequent visits in production, and gives
  // it offline capabilities. However, it also means that developers (and users)
  // will only see deployed updates on subsequent visits to a page, after all the
  // existing tabs open on the page have been closed, since previously cached
  // resources are updated in the background.

  // To learn more about the benefits of this model and instructions on how to
  // opt-in, read https://cra.link/PWA

  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        return;
      }

      window.addEventListener('load', () => {
        const swUrl = \`\${process.env.PUBLIC_URL}/service-worker.js\`;

        if (isLocalhost) {
          // This is running on localhost. Let's check if a service worker still exists or not.
          checkValidServiceWorker(swUrl, config);

          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service ' +
                'worker. To learn more, visit https://cra.link/PWA'
            );
          });
        } else {
          // Is not localhost. Just register service worker
          registerValidSW(swUrl, config);
        }
      });
    }
  }

  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the previous service worker will still serve the older
                // content until all client tabs are closed.
                console.log(
                  'New content is available and will be used when all ' +
                    'tabs for this page are closed. See https://cra.link/PWA.'
                );

                // Execute callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                console.log('Content is cached for offline use.');

                // Execute callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error during service worker registration:', error);
      });
  }

  function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // Ensure service worker exists, and that we really are getting a JS file.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No service worker found. Probably a different app. Reload the page.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found. Proceed as normal.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }

  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  `,
  );

  fs.writeFileSync(
    path.join(projectPath, "src", "reportWebVitals.js"),
    `const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  };

  export default reportWebVitals;
  `,
  );

  // Create service-worker.js
  fs.writeFileSync(
    path.join(projectPath, "src", "service-worker.js"),
    `/* eslint-disable no-restricted-globals */

  // This service worker can be customized!
  // See https://developers.google.com/web/tools/workbox/modules
  // for the list of available Workbox modules, or add any other
  // code you'd like.
  // You can also remove this file if you'd prefer not to use a
  // service worker, and the Workbox build step will be skipped.

  import { clientsClaim } from 'workbox-core';
  import { ExpirationPlugin } from 'workbox-expiration';
  import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
  import { registerRoute } from 'workbox-routing';
  import { StaleWhileRevalidate } from 'workbox-strategies';

  clientsClaim();

  // Precache all of the assets generated by your build process.
  // Their URLs are injected into the manifest variable below.
  // This variable must be present somewhere in your service worker file,
  // even if you decide not to use precaching. See https://cra.link/PWA
  precacheAndRoute(self.__WB_MANIFEST);

  // Set up App Shell-style routing, so that all navigation requests
  // are fulfilled with your index.html shell. Learn more at
  // https://developers.google.com/web/fundamentals/architecture/app-shell
  const fileExtensionRegexp = new RegExp('/[^/?]+\\\\.[^/]+$');
  registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }) => {
      // If this isn't a navigation, skip.
      if (request.mode !== 'navigate') {
        return false;
      } // If this is a URL that starts with /_, skip.

      if (url.pathname.startsWith('/_')) {
        return false;
      } // If this looks like a URL for a resource, because it contains // a file extension, skip.

      if (url.pathname.match(fileExtensionRegexp)) {
        return false;
      } // Return true to signal that we want to use the handler.

      return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
  );

  // An example runtime caching route for requests that aren't handled by the
  // precache, in this case same-origin .png requests like those from in public/
  registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        // Ensure that once this runtime cache reaches a maximum size the
        // least-recently used images are removed.
        new ExpirationPlugin({ maxEntries: 50 }),
      ],
    })
  );

  // This allows the web app to trigger skipWaiting via
  // registration.waiting.postMessage({type: 'SKIP_WAITING'})
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Any other custom service worker logic can go here.
  `,
  );

  // Create styles
  fs.writeFileSync(
    path.join(projectPath, "src", "assets", "styles", "index.scss"),
    `/* Main Styles */
  @import 'variables';
  @import 'reset';
  @import 'typography';
  @import 'layout';
  @import 'components';
  @import 'responsive';

  /* Base styles */
  body {
    font-family: 'Roboto', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  section {
    padding: 60px 0;
  }
  `,
  );

  fs.writeFileSync(
    path.join(projectPath, "src", "assets", "styles", "_variables.scss"),
    `/* Variables */
  $primary-color: #4a90e2;
  $secondary-color: #f5a623;
  $text-color: #333333;
  $light-bg: #f8f9fa;
  $dark-bg: #343a40;
  $header-height: 70px;
  `,
  );

  // Copy all SCSS files from the template directory to the new project
  const templateStylesDir = path.join(__dirname, "src", "assets", "styles");
  const projectStylesDir = path.join(projectPath, "src", "assets", "styles");

  // List of SCSS files to copy
  const scssFiles = [
    "_reset.scss",
    "_typography.scss",
    "_layout.scss",
    "_components.scss",
    "_responsive.scss",
    "_variables.scss",
    "index.scss",
  ];

  // Copy each SCSS file
  scssFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(
        path.join(templateStylesDir, file),
        "utf8",
      );
      fs.writeFileSync(path.join(projectStylesDir, file), content);
      console.log(chalk.blue(`  - Copied style file: ${file}`));
    } catch (error) {
      console.error(
        chalk.yellow(`  - Warning: Could not copy style file: ${file}`),
        error.message,
      );
    }
  });

  // Create component files based on answers
  createComponentFiles(projectPath, answers);

  // Create package.json scripts
  const packageJson = {
    name: answers.projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    dependencies: {
      "@fortawesome/fontawesome-svg-core": "^6.2.0",
      "@fortawesome/free-brands-svg-icons": "^6.2.0",
      "@fortawesome/free-solid-svg-icons": "^6.2.0",
      "@fortawesome/react-fontawesome": "^0.2.0",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.4.2",
      "react-scripts": "5.0.1",
      sass: "^1.55.0",
      "web-vitals": "^2.1.4",
      "workbox-background-sync": "^6.5.4",
      "workbox-broadcast-update": "^6.5.4",
      "workbox-cacheable-response": "^6.5.4",
      "workbox-core": "^6.5.4",
      "workbox-expiration": "^6.5.4",
      "workbox-google-analytics": "^6.5.4",
      "workbox-navigation-preload": "^6.5.4",
      "workbox-precaching": "^6.5.4",
      "workbox-range-requests": "^6.5.4",
      "workbox-routing": "^6.5.4",
      "workbox-strategies": "^6.5.4",
      "workbox-streams": "^6.5.4",
    },
    scripts: {
      start: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
      eject: "react-scripts eject",
    },
    eslintConfig: {
      extends: ["react-app", "react-app/jest"],
    },
    browserslist: {
      production: [">0.2%", "not dead", "not op_mini all"],
      development: [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version",
      ],
    },
  };

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
}

function createComponentFiles(projectPath, answers) {
  // Create Header component
  fs.writeFileSync(
    path.join(projectPath, "src", "components", "common", "Header.js"),
    `import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

  const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 10;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
      };

      document.addEventListener('scroll', handleScroll);

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }, [scrolled]);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    return (
      <header className={\`site-header \${scrolled ? 'scrolled' : ''}\`}>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <span>${answers.businessName}</span>
            </Link>
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>

          <nav className={\`main-nav \${menuOpen ? 'open' : ''}\`}>
            <ul>
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
              <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
              <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  export default Header;
  `,
  );

  // Create Footer component
  fs.writeFileSync(
    path.join(projectPath, "src", "components", "common", "Footer.js"),
    `import React from 'react';
  import { Link } from 'react-router-dom';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
  import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

  const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section about">
              <h3>${answers.businessName}</h3>
              <p>We are committed to providing the best services to our clients with quality and dedication.</p>
              <div className="contact">
                <p><FontAwesomeIcon icon={faPhone} /> (123) 456-7890</p>
                <p><FontAwesomeIcon icon={faEnvelope} /> info@${answers.projectName.replace(/-/g, "")}.com</p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Main St, Anytown, USA</p>
              </div>
              <div className="socials">
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              </div>
            </div>

            <div className="footer-section links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section contact-form">
              <h3>Contact Us</h3>
              <form>
                <input type="email" name="email" placeholder="Your email address" />
                <textarea name="message" placeholder="Your message"></textarea>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {currentYear} ${answers.businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
  `,
  );

  // Create Hero component
  fs.writeFileSync(
    path.join(projectPath, "src", "components", "sections", "Hero.js"),
    `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    try {
      // Try to import hero image
      const importAll = (r) => r.keys().map(r);
      const images = importAll(require.context('../../assets/images/hero', false, /\\.(png|jpe?g|gif)$/i));
      if (images.length > 0) {
        setHeroImage(images[0]); // Use the first hero image
      }
    } catch (error) {
      console.error('Could not load hero image:', error);
      setHeroImage(null);
    }
  }, []);

  return (
    <section
      className="hero-section"
      style={heroImage ? {
        backgroundImage: \`linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(\${heroImage})\`
      } : {}}
    >
      <div className="container">
        <div className="hero-content">
          <h1>Welcome to ${answers.businessName}</h1>
          <p>Your trusted partner for quality services and solutions</p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">Our Services</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;`,
  );

  // Create Home page
  let importStatements = `import React from 'react';\nimport Hero from '../components/sections/Hero.js';`;
  let componentInclusions = "<Hero />";

  // Add feature imports based on selected features
  if (answers.features.includes("services")) {
    importStatements += `\nimport Services from '../components/sections/Services.js';`;
    componentInclusions += "\n      <Services />";
  }

  if (answers.features.includes("gallery")) {
    importStatements += `\nimport Gallery from '../components/sections/Gallery.js';`;
    componentInclusions += "\n      <Gallery />";

    // Create Gallery component
    fs.writeFileSync(
      path.join(projectPath, "src", "components", "sections", "Gallery.js"),
      `import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Dynamically import all images from the gallery folder
    const importAll = (r) => {
  return r.keys().map((item) => ({
    id: item,
    src: r(item),
    alt: item.replace(/\.\//g, '').replace(/\.(png|jpe?g|gif)$/i, ''),
    title: item.replace(/\.\//g, '').replace(/\.(png|jpe?g|gif)$/i, '')
  }));
};

    try {
      // Use webpack's require.context to get all images from the gallery folder
      const galleryImages = importAll(require.context('../../assets/images/gallery', false, /\.(png|jpe?g|gif)$/i));
      setImages(galleryImages);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      // Fallback to placeholders if there's an error
      setImages([
        { id: 1, src: 'https://via.placeholder.com/600x400', alt: 'Project 1', title: 'Project 1' },
        { id: 2, src: 'https://via.placeholder.com/600x400', alt: 'Project 2', title: 'Project 2' }
      ]);
    }
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <h2>Our Work</h2>
          <p>Take a look at some of our recent projects</p>
        </div>
        <div className="gallery-grid">
          {images.map((image) => (
            <div className="gallery-item" key={image.id} onClick={() => openModal(image)}>
              <img src={image.src} alt={image.alt} />
              <div className="gallery-overlay">
                <h3>{image.title}</h3>
                <p>Click to view</p>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content">
              <span className="close-button" onClick={closeModal}>&times;</span>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <h3>{selectedImage.title}</h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;`,
    );
  }

  if (answers.features.includes("contactForm")) {
    importStatements += `\nimport ContactForm from '../components/sections/ContactForm.js';`;
    componentInclusions += "\n      <ContactForm />";

    // Create ContactForm component
    fs.writeFileSync(
      path.join(projectPath, "src", "components", "sections", "ContactForm.js"),
      `import React, { useState } from 'react';

  const ContactForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    const [formStatus, setFormStatus] = useState({
      submitted: false,
      error: false,
      message: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        setFormStatus({
          submitted: false,
          error: true,
          message: 'Please fill in all required fields.'
        });
        return;
      }

      // Here you would typically send the data to your backend
      // For demonstration, we'll just simulate a successful submission
      setTimeout(() => {
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Thank you for your message! We will get back to you soon.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 1000);
    };

    return (
      <section className="contact-form-section" id="contact-form">
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <p>Send us a message and we'll get back to you as soon as possible</p>
          </div>
          <div className="form-container">
            {formStatus.submitted ? (
              <div className="success-message">
                <p>{formStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
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
                  <label htmlFor="email">Email Address *</label>
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
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {formStatus.error && (
                  <div className="error-message">
                    <p>{formStatus.message}</p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  };

  export default ContactForm;`,
    );
  }
  // Create Team component
  if (answers.features.includes("team") || answers.useDropboxPhotos) {
    fs.writeFileSync(
      path.join(projectPath, "src", "components", "sections", "Team.js"),
      `import React, { useState, useEffect } from 'react';

const Team = () => {
  const [teamImages, setTeamImages] = useState([]);

  useEffect(() => {
    try {
      // Try to import team member images
      const importAll = (r) => r.keys().map(r);
      const images = importAll(require.context('../../assets/images/team', false, /\\.(png|jpe?g|gif)$/i));
      setTeamImages(images);
    } catch (error) {
      console.error('Could not load team images:', error);
      setTeamImages([]);
    }
  }, []);

  // Team member data - adjust names based on available images
  const teamMembers = [
    {
      name: 'John Doe',
      position: 'CEO / Founder',
      bio: 'With over 15 years of industry experience, John leads our team with passion and expertise.'
    },
    {
      name: 'Jane Smith',
      position: 'Creative Director',
      bio: 'Jane brings creativity and innovation to every project, ensuring clients receive exceptional designs.'
    },
    {
      name: 'Michael Johnson',
      position: 'Technical Lead',
      bio: 'Michael oversees all technical aspects of our projects, implementing cutting-edge solutions.'
    },
    {
      name: 'Sarah Williams',
      position: 'Client Relations',
      bio: 'Sarah ensures that all our clients receive personalized attention and outstanding service.'
    }
  ];

  // Use only as many team members as we have images, or all if we have enough images
  const displayedMembers = teamMembers.slice(0, Math.max(teamImages.length, teamMembers.length));

  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="section-header">
          <h2>Our Team</h2>
          <p>Meet the experts behind our success</p>
        </div>
        <div className="team-grid">
          {displayedMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <div className="member-image">
                {index < teamImages.length ? (
                  <img src={teamImages[index]} alt={member.name} />
                ) : (
                  <div className="placeholder-image">{member.name.charAt(0)}</div>
                )}
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;`,
    );

    // Add Team component to Home page
    importStatements += `\nimport Team from '../components/sections/Team.js';`;
    componentInclusions += "\n      <Team />";
  }

  // Create Home page with all included components
  fs.writeFileSync(
    path.join(projectPath, "src", "pages", "Home.js"),
    `${importStatements}

  const Home = () => {
    return (
      <div className="home-page">
        ${componentInclusions}
      </div>
    );
  };

  export default Home;`,
  );

  // Create other pages
  fs.writeFileSync(
    path.join(projectPath, "src", "pages", "About.js"),
    `import React from 'react';

  const About = () => {
    return (
      <div className="about-page">
        <div className="page-header">
          <div className="container">
            <h1>About Us</h1>
          </div>
        </div>

        <section className="about-content">
          <div className="container">
            <div className="about-info">
              <h2>Our Story</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in metus at est lobortis
                pharetra ac id nunc. Nulla facilisi. Donec vitae ex id nulla fermentum feugiat.
              </p>
              <p>
                Maecenas eu magna sed est volutpat vehicula vitae eu est. Fusce ullamcorper
                interdum risus, sed convallis est feugiat in. Vestibulum ante ipsum primis in
                faucibus orci luctus et ultrices posuere cubilia curae.
              </p>
            </div>

            <div className="about-mission">
              <h2>Our Mission</h2>
              <p>
                Our mission is to provide high-quality services that help small businesses thrive
                in the digital world. We are committed to:
              </p>
              <ul>
                <li>Building responsive and user-friendly websites</li>
                <li>Maintaining close communication with clients</li>
                <li>Delivering projects on time and within budget</li>
                <li>Providing ongoing support and maintenance</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  };

  export default About;`,
  );
  // Create Services page
  fs.writeFileSync(
    path.join(projectPath, "src", "pages", "Services.js"),
    `import React from 'react';
import ServicesSection from '../components/sections/Services.js';

const Services = () => {
  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Services</h1>
        </div>
      </div>

      <ServicesSection />

      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>How we work with you from start to finish</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Discovery & Planning</h3>
              <p>We start by understanding your business needs, goals, and target audience.</p>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Design & Development</h3>
              <p>Our team creates a custom design and builds your website with the latest technologies.</p>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Testing & Launch</h3>
              <p>We rigorously test your website and ensure everything works perfectly before launch.</p>
            </div>

            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Support & Maintenance</h3>
              <p>Our relationship doesn't end at launch - we provide ongoing support as needed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;`,
  );
  // Create Services component
  fs.writeFileSync(
    path.join(projectPath, "src", "components", "sections", "Services.js"),
    `import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faPaintBrush, faCogs, faChartBar } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [serviceImages, setServiceImages] = useState([]);

  useEffect(() => {
    try {
      // Try to import service images
      const importAll = (r) => r.keys().map(r);
      const images = importAll(require.context('../../assets/images/services', false, /\\.(png|jpe?g|gif)$/i));
      setServiceImages(images);
    } catch (error) {
      console.error('Could not load service images:', error);
      setServiceImages([]);
    }
  }, []);

  const servicesList = [
    {
      icon: faLaptop,
      title: 'Web Development',
      description: 'Custom website development tailored to your business needs with responsive design.'
    },
    {
      icon: faPaintBrush,
      title: 'Design Services',
      description: 'Creative and professional designs that represent your brand identity.'
    },
    {
      icon: faCogs,
      title: 'Technical Support',
      description: 'Ongoing maintenance and support to keep your website running smoothly.'
    },
    {
      icon: faChartBar,
      title: 'Digital Marketing',
      description: 'Strategies to increase your online presence and reach more customers.'
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>We offer a range of services to help your business grow</p>
        </div>
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <div className="service-card" key={index}>
              {index < serviceImages.length ? (
                <div className="service-image">
                  <img src={serviceImages[index]} alt={service.title} />
                </div>
              ) : (
                <div className="service-icon">
                  <FontAwesomeIcon icon={service.icon} />
                </div>
              )}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;`,
  );

  fs.writeFileSync(
    path.join(projectPath, "src", "pages", "Contact.js"),
    `import React from 'react';
    ${answers.features.includes("contactForm") ? "import ContactForm from '../components/sections/ContactForm.js';" : ""}
    ${answers.features.includes("businessInfo") ? "import BusinessInfo from '../components/sections/BusinessInfo.js';" : ""}

    const Contact = () => {
      return (
        <div className="contact-page">
          <div className="page-header">
            <div className="container">
              <h1>Contact Us</h1>
            </div>
          </div>

          ${answers.features.includes("contactForm") ? "<ContactForm />" : ""}
          ${answers.features.includes("businessInfo") ? "<BusinessInfo />" : ""}

          ${
            !answers.features.includes("contactForm") &&
            !answers.features.includes("businessInfo")
              ? `
          <section className="simple-contact-section">
            <div className="container">
              <div className="contact-info">
                <h2>Get In Touch</h2>
                <p>We'd love to hear from you. Feel free to reach out using the information below:</p>
                <ul>
                  <li>Phone: (123) 456-7890</li>
                  <li>Email: info@${answers.projectName.replace(/-/g, "")}.com</li>
                  <li>Address: 123 Main St, Anytown, USA</li>
                </ul>
              </div>
            </div>
          </section>
          `
              : ""
          }
        </div>
      );
    };

    export default Contact;`,
  );

  if (answers.features.includes("testimonials")) {
    importStatements += `\nimport Testimonials from '../components/sections/Testimonials.js';`;
    componentInclusions += "\n      <Testimonials />";

    // Create Testimonials component
    fs.writeFileSync(
      path.join(
        projectPath,
        "src",
        "components",
        "sections",
        "Testimonials.js",
      ),
      `import React from 'react';

  const Testimonials = () => {
    const testimonialsList = [
      {
        name: 'John Doe',
        position: 'CEO, Company XYZ',
        text: 'Working with ${answers.businessName} has been an absolute pleasure. They delivered a website that exceeded our expectations and helped grow our business.',
        rating: 5
      },
      {
        name: 'Jane Smith',
        position: 'Marketing Director, ABC Inc',
        text: 'The team at ${answers.businessName} is highly professional and responsive. They truly understand our needs and delivered on time and within budget.',
        rating: 5
      },
      {
        name: 'Michael Johnson',
        position: 'Small Business Owner',
        text: 'As a small business owner, finding the right partner for our website was crucial. ${answers.businessName} provided exceptional service and results.',
        rating: 4
      }
    ];

    // Generate stars based on rating
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
        );
      }
      return stars;
    };

    return (
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Client Testimonials</h2>
            <p>See what our clients have to say about our services</p>
          </div>
          <div className="testimonials-grid">
            {testimonialsList.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                </div>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default Testimonials;`,
    );
  }

  if (answers.features.includes("businessInfo")) {
    importStatements += `\nimport BusinessInfo from '../components/sections/BusinessInfo.js';`;
    componentInclusions += "\n      <BusinessInfo />";

    // Create BusinessInfo component
    fs.writeFileSync(
      path.join(
        projectPath,
        "src",
        "components",
        "sections",
        "BusinessInfo.js",
      ),
      `import React from 'react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faClock, faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

  const BusinessInfo = () => {
    const businessHours = [
      { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ];

    return (
      <section className="business-info-section" id="business-info">
        <div className="container">
          <div className="section-header">
            <h2>Business Information</h2>
            <p>Where to find us and when we're open</p>
          </div>
          <div className="business-info-grid">
            <div className="business-hours">
              <h3><FontAwesomeIcon icon={faClock} /> Business Hours</h3>
              <ul>
                {businessHours.map((item, index) => (
                  <li key={index}>
                    <span className="day">{item.day}:</span>
                    <span className="hours">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="business-location">
              <h3><FontAwesomeIcon icon={faMapMarkerAlt} /> Location</h3>
              <address>
                123 Main Street<br />
                Anytown, State 12345<br />
                United States
              </address>
              <div className="map-container">
                {/* Placeholder for Google Maps - would be replaced with actual implementation */}
                <div className="map-placeholder">
                  <p>Google Maps would be embedded here</p>
                </div>
              </div>
              <div className="contact-info">
                <p><FontAwesomeIcon icon={faPhone} /> (123) 456-7890</p>
                <p><FontAwesomeIcon icon={faEnvelope} /> info@${answers.projectName.replace(/-/g, "")}.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default BusinessInfo;`,
    );
  }
}
async function configureDeployment(projectPath, deployTarget, projectName) {
  console.log(chalk.blue("Configuring deployment..."));

  if (deployTarget.includes("Netlify")) {
    // Create netlify.toml configuration
    fs.writeFileSync(
      path.join(projectPath, "netlify.toml"),
      `[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
    );
    console.log(chalk.blue("  - Added Netlify configuration (netlify.toml)"));

    // Install Netlify CLI as a dev dependency
    console.log(
      chalk.blue("  - Installing Netlify CLI as a dev dependency..."),
    );
    await runCommand("npm", ["install", "--save-dev", "netlify-cli"]);

    // Create Netlify setup script
    fs.writeFileSync(
      path.join(projectPath, "setup-netlify.js"),
      `// Netlify Setup Script
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\\nNetlify Setup Wizard');
console.log('====================');

// Ask if user wants to create a new site or use existing one
rl.question('\\nDo you want to create a new Netlify site? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\\nCreating a new Netlify site...');
    try {
      // Create new site
      execSync('npx netlify sites:create', { stdio: 'inherit' });
      console.log('\\nSite created successfully!');

      // Link site
      console.log('\\nLinking site to this project...');
      execSync('npx netlify link', { stdio: 'inherit' });

      console.log('\\nNetlify setup complete! You can now deploy using:');
      console.log('npm run deployNetlify');
    } catch (error) {
      console.error('\\nError setting up Netlify:', error.message);
    }
  } else {
    console.log('\\nLinking to an existing Netlify site...');
    try {
      execSync('npx netlify link', { stdio: 'inherit' });
      console.log('\\nSite linked successfully!');
      console.log('\\nNetlify setup complete! You can now deploy using:');
      console.log('npm run deployNetlify');
    } catch (error) {
      console.error('\\nError linking to Netlify site:', error.message);
    }
  }

  rl.close();
});
`,
    );
    console.log(
      chalk.blue("  - Created Netlify setup script (setup-netlify.js)"),
    );

    // Add Netlify deploy script to package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.scripts.setupNetlify = "node setup-netlify.js";
    packageJson.scripts.deployNetlify =
      "npm run build && netlify deploy --prod";
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies["netlify-cli"] = "^12.0.0";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(
      chalk.blue("  - Added Netlify deployment scripts to package.json"),
    );
  }

  if (deployTarget.includes("Dreamhost")) {
    // Install ftp-deploy as dev dependency
    console.log(chalk.blue("  - Installing deployment dependencies..."));
    await runCommand("npm", [
      "install",
      "--save-dev",
      "ftp-deploy",
      "dotenv",
      "inquirer",
    ]);

    // Create .env.example file for FTP credentials
    fs.writeFileSync(
      path.join(projectPath, ".env.example"),
      `# Dreamhost FTP Credentials - Copy to .env and fill in your values
FTP_HOST=ftp.example.com
FTP_USER=your_username
FTP_PASSWORD=your_password
FTP_REMOTE_ROOT=/path/to/your/website/
`,
    );

    // Add .env to .gitignore
    let gitignorePath = path.join(projectPath, ".gitignore");
    let gitignoreContent = "";
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    }
    if (!gitignoreContent.includes(".env")) {
      gitignoreContent += "\n# Environment variables\n.env\n";
      fs.writeFileSync(gitignorePath, gitignoreContent);
    }

    // Create setup script for Dreamhost
    fs.writeFileSync(
      path.join(projectPath, "setup-dreamhost.js"),
      `// Dreamhost FTP Setup Script
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

async function setupDreamhost() {
  console.log('\\nDreamhost FTP Setup Wizard');
  console.log('========================');
  console.log('This script will help you configure your Dreamhost FTP deployment settings.');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'ftpHost',
      message: 'Enter your Dreamhost FTP host:',
      default: 'ftp.example.com'
    },
    {
      type: 'input',
      name: 'ftpUser',
      message: 'Enter your Dreamhost FTP username:'
    },
    {
      type: 'password',
      name: 'ftpPassword',
      message: 'Enter your Dreamhost FTP password:',
      mask: '*'
    },
    {
      type: 'input',
      name: 'remoteRoot',
      message: 'Enter the remote directory path:',
      default: '/home/username/example.com/'
    }
  ]);

  // Create .env file with FTP credentials
  const envContent = \`FTP_HOST=\${answers.ftpHost}
FTP_USER=\${answers.ftpUser}
FTP_PASSWORD=\${answers.ftpPassword}
FTP_REMOTE_ROOT=\${answers.remoteRoot}
\`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('\\n✅ FTP configuration saved to .env file!');
  console.log('\\nYou can now deploy your site using:');
  console.log('npm run deployDreamhost');
}

setupDreamhost().catch(err => console.error('Error:', err));
`,
    );
    console.log(
      chalk.blue("  - Created Dreamhost setup script (setup-dreamhost.js)"),
    );

    // Create improved deployment script
    fs.writeFileSync(
      path.join(projectPath, "setup-dreamhost.js"),
      `// Dreamhost FTP Setup Script
        import fs from 'fs';
        import path from 'path';
        import inquirer from 'inquirer';
        import { fileURLToPath } from 'url';

const ftpDeploy = new FtpDeploy();

// Check if environment variables are set
if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD || !process.env.FTP_REMOTE_ROOT) {
  console.error('❌ Missing FTP configuration!');
  console.error('Please run "npm run setupDreamhost" first to configure your FTP settings.');
  process.exit(1);
}

const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: 21,
  localRoot: path.join(__dirname, 'build'),
  remoteRoot: process.env.FTP_REMOTE_ROOT,
  include: ['*', '**/*'],
  exclude: [],
  deleteRemote: false, // Set to true if you want to delete files on server
  forcePasv: true
};

console.log('📤 Starting deployment to Dreamhost...');
console.log(\`• Server: \${config.host}\`);
console.log(\`• Remote path: \${config.remoteRoot}\`);

ftpDeploy
  .deploy(config)
  .then(res => {
    console.log('\\n✅ Deployment to Dreamhost completed successfully!');
  })
  .catch(err => {
    console.error('\\n❌ Deployment error:', err);
  });
`,
    );
    console.log(
      chalk.blue(
        "  - Created improved Dreamhost deployment script (deploy-dreamhost.js)",
      ),
    );

    // Add Dreamhost deploy script to package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.scripts.setupDreamhost = "node setup-dreamhost.js";
    packageJson.scripts.deployDreamhost =
      "npm run build && node deploy-dreamhost.js";
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies["ftp-deploy"] = "^2.4.3";
    packageJson.devDependencies["dotenv"] = "^16.0.3";
    packageJson.devDependencies["inquirer"] = "^8.2.4";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(
      chalk.blue("  - Added Dreamhost deployment scripts to package.json"),
    );
  }

  if (deployTarget.includes("Netlify")) {
    console.log(chalk.yellow("\nTo set up Netlify deployment:"));
    console.log(
      chalk.white(`  1. Run: cd ${projectName} && npm run setupNetlify`),
    );
    console.log(
      chalk.white(
        "  2. Follow the prompts to create or link your Netlify site",
      ),
    );
    console.log(chalk.white("  3. Deploy anytime with: npm run deployNetlify"));
  }

  if (deployTarget.includes("Dreamhost")) {
    console.log(chalk.yellow("\nTo set up Dreamhost FTP deployment:"));
    console.log(
      chalk.white(`  1. Run: cd ${projectName} && npm run setupDreamhost`),
    );
    console.log(
      chalk.white("  2. Enter your Dreamhost FTP credentials when prompted"),
    );
    console.log(
      chalk.white("  3. Deploy anytime with: npm run deployDreamhost"),
    );
  }
}
// Run the generator
main();
