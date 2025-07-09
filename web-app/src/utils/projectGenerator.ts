import JSZip from "jszip";
import { BusinessInfo } from "../store/PWAGeneratorStore";

// Generate main App component
export function generateAppComponent(
  _businessInfo: BusinessInfo,
  selectedFeatures: string[],
  typescript: boolean,
): string {
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
${selectedFeatures.includes("auth") ? `import AuthForm from './components/AuthForm';` : ""}
import './App.css';

const App${typescript ? ": React.FC" : ""} = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            ${selectedFeatures.includes("auth") ? `<Route path="/login" element={<AuthForm />} />` : ""}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
`;
}

// Generate HomePage component
export function generateHomePageComponent(
  businessInfo: BusinessInfo,
  _selectedFeatures: string[],
  typescript: boolean,
): string {
  return `import React from 'react';
import './HomePage.css';

const HomePage${typescript ? ": React.FC" : ""} = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>${businessInfo.businessName}</h1>
          <p>${businessInfo.description}</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Quality Service</h3>
              <p>We provide top-notch services tailored to your needs.</p>
            </div>
            <div className="feature-card">
              <h3>Expert Team</h3>
              <p>Our experienced professionals deliver excellence.</p>
            </div>
            <div className="feature-card">
              <h3>24/7 Support</h3>
              <p>We're here to help you whenever you need us.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
`;
}

// Generate Header component
export function generateHeaderComponent(
  businessInfo: BusinessInfo,
  selectedFeatures: string[],
  typescript: boolean,
): string {
  return `import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header${typescript ? ": React.FC" : ""} = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">${businessInfo.businessName}</Link>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          ${selectedFeatures.includes("auth") ? `<Link to="/login" className="nav-link">Login</Link>` : ""}
        </nav>
      </div>
    </header>
  );
};

export default Header;
`;
}

// Generate Footer component
export function generateFooterComponent(
  businessInfo: BusinessInfo,
  _selectedFeatures: string[],
  typescript: boolean,
): string {
  return `import React from 'react';
import './Footer.css';

const Footer${typescript ? ": React.FC" : ""} = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>${businessInfo.businessName}</h3>
            <p>${businessInfo.description}</p>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@company.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Business St, City, State 12345</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${businessInfo.businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`;
}

// Generate AuthForm component (if auth feature is selected)
export function generateAuthFormComponent(typescript: boolean): string {
  return `import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm${typescript ? ": React.FC" : ""} = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e${typescript ? ": React.ChangeEvent<HTMLInputElement>" : ""}) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e${typescript ? ": React.FormEvent" : ""}) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add authentication logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="link-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
`;
}

// Generate package.json
export function generatePackageJson(
  businessInfo: BusinessInfo,
  _framework: string,
  _selectedFeatures: string[],
  typescript: boolean,
): string {
  const dependencies = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
  };

  const devDependencies: Record<string, string> = {
    "@vitejs/plugin-react": "^4.0.0",
    vite: "^4.3.0",
    "vite-plugin-pwa": "^0.14.0",
  };

  if (typescript) {
    devDependencies["typescript"] = "^5.0.0";
    devDependencies["@types/react"] = "^18.0.0";
    devDependencies["@types/react-dom"] = "^18.0.0";
  }

  const packageJson = {
    name:
      businessInfo.businessName.toLowerCase().replace(/\s+/g, "-") || "my-pwa",
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies,
    devDependencies,
  };

  const packageJsonString = JSON.stringify(packageJson, null, 2);
  console.log(
    "📦 Generated package.json:",
    packageJsonString.substring(0, 200) + "...",
  );
  return packageJsonString;
}

// Generate main CSS
export function generateMainCSS(): string {
  return `/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #333;
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-secondary:hover {
  background-color: #007bff;
  color: white;
}

.link-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.link-button:hover {
  color: #0056b3;
}

/* Form styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
`;
}

// Generate Header CSS
export function generateHeaderCSS(): string {
  return `.header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #007bff;
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    gap: 1rem;
  }
}
`;
}

// Generate Footer CSS
export function generateFooterCSS(): string {
  return `.footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 0 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #333;
}

.footer-section p {
  margin-bottom: 0.5rem;
  color: #666;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #007bff;
}

.footer-bottom {
  border-top: 1px solid #dee2e6;
  padding: 1rem 0;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
`;
}

// Generate HomePage CSS
export function generateHomePageCSS(): string {
  return `.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 5rem 0;
  background-color: #f8f9fa;
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
`;
}

// Generate AuthForm CSS
export function generateAuthFormCSS(): string {
  return `.auth-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.auth-form p {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}
`;
}

// Generate Vite config
export function generateViteConfig(_typescript: boolean): string {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PWA App',
        short_name: 'PWA',
        description: 'A Progressive Web Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
`;
}

// Generate index.html
export function generateIndexHTML(businessInfo: BusinessInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${businessInfo.description}" />
    <title>${businessInfo.businessName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

// Generate main.tsx/main.jsx
export function generateMainFile(typescript: boolean): string {
  const ext = typescript ? "tsx" : "jsx";

  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')${typescript ? "!" : ""}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}

// Generate manifest.json
export function generateManifest(businessInfo: BusinessInfo): string {
  return JSON.stringify(
    {
      name: businessInfo.businessName,
      short_name: businessInfo.businessName.substring(0, 12),
      description: businessInfo.description,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  );
}

// Generate TypeScript config (if TypeScript is selected)
export function generateTSConfig(): string {
  return JSON.stringify(
    {
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
    },
    null,
    2,
  );
}

// Generate TypeScript Node config (for Vite)
export function generateTSConfigNode(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: "ESNext",
        moduleResolution: "bundler",
        allowSyntheticDefaultImports: true,
      },
      include: ["vite.config.ts"],
    },
    null,
    2,
  );
}

// Create downloadable ZIP file
export async function createProjectZip(
  files: Array<{ path: string; content: string; type: string }>,
  projectName: string,
  _selectedFeatures: string[] = [],
): Promise<Blob> {
  const zip = new JSZip();

  console.log(
    `Creating ZIP with ${files.length} files for project: ${projectName}`,
  );

  // Create project folder and add all files under it
  files.forEach((file) => {
    const fullPath = `${projectName}/${file.path}`;
    console.log(`Adding file to ZIP: ${fullPath}`);
    zip.file(fullPath, file.content);
  });

  // Verify package.json is included
  const packageJsonFile = files.find((f) => f.path === "package.json");
  if (packageJsonFile) {
    console.log("✅ package.json found in files list");
    console.log(
      "📋 package.json content preview:",
      packageJsonFile.content.substring(0, 100) + "...",
    );
  } else {
    console.error("❌ package.json NOT found in files list!");
  }

  // Generate and return the zip blob
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });
}

// Main function to generate all project files
export function generateProjectFiles(
  businessInfo: BusinessInfo,
  framework: string,
  selectedFeatures: string[],
  typescript: boolean,
): Array<{ path: string; content: string; type: string }> {
  const ext = typescript ? "tsx" : "jsx";
  const files: Array<{ path: string; content: string; type: string }> = [];

  // Package.json
  files.push({
    path: "package.json",
    content: generatePackageJson(
      businessInfo,
      framework,
      selectedFeatures,
      typescript,
    ),
    type: "json",
  });

  // Vite config
  files.push({
    path: `vite.config.${typescript ? "ts" : "js"}`,
    content: generateViteConfig(typescript),
    type: "config",
  });

  // Index.html
  files.push({
    path: "index.html",
    content: generateIndexHTML(businessInfo),
    type: "html",
  });

  // Main entry file
  files.push({
    path: `src/main.${ext}`,
    content: generateMainFile(typescript),
    type: "tsx",
  });

  // App component
  files.push({
    path: `src/App.${ext}`,
    content: generateAppComponent(businessInfo, selectedFeatures, typescript),
    type: "tsx",
  });

  // Components
  files.push({
    path: `src/components/HomePage.${ext}`,
    content: generateHomePageComponent(
      businessInfo,
      selectedFeatures,
      typescript,
    ),
    type: "tsx",
  });

  files.push({
    path: `src/components/Header.${ext}`,
    content: generateHeaderComponent(
      businessInfo,
      selectedFeatures,
      typescript,
    ),
    type: "tsx",
  });

  files.push({
    path: `src/components/Footer.${ext}`,
    content: generateFooterComponent(
      businessInfo,
      selectedFeatures,
      typescript,
    ),
    type: "tsx",
  });

  // CSS files
  files.push({
    path: "src/App.css",
    content: generateMainCSS(),
    type: "css",
  });

  files.push({
    path: "src/components/Header.css",
    content: generateHeaderCSS(),
    type: "css",
  });

  files.push({
    path: "src/components/Footer.css",
    content: generateFooterCSS(),
    type: "css",
  });

  files.push({
    path: "src/components/HomePage.css",
    content: generateHomePageCSS(),
    type: "css",
  });

  // Conditional features
  if (selectedFeatures.includes("auth")) {
    files.push({
      path: `src/components/AuthForm.${ext}`,
      content: generateAuthFormComponent(typescript),
      type: "tsx",
    });

    files.push({
      path: "src/components/AuthForm.css",
      content: generateAuthFormCSS(),
      type: "css",
    });
  }

  // TypeScript config
  if (typescript) {
    files.push({
      path: "tsconfig.json",
      content: generateTSConfig(),
      type: "json",
    });

    files.push({
      path: "tsconfig.node.json",
      content: generateTSConfigNode(),
      type: "json",
    });
  }

  // PWA Manifest
  files.push({
    path: "public/manifest.json",
    content: generateManifest(businessInfo),
    type: "json",
  });

  // Add README
  files.push({
    path: "README.md",
    content: `# ${businessInfo.businessName}

${businessInfo.description}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Features

${selectedFeatures.map((feature) => `- ${feature.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`).join("\n")}

## Tech Stack

- ${framework === "react" ? "React" : framework}
- ${typescript ? "TypeScript" : "JavaScript"}
- Vite
- CSS3
- PWA (Progressive Web App)
`,
    type: "md",
  });

  return files;
}
