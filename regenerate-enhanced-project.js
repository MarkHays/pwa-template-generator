#!/usr/bin/env node

/**
 * Regenerate Enhanced Project Script
 * Regenerates the existing digital-ghost-protocol-420 project with enhanced production-ready pages
 */

import { EnhancedPageGenerator } from "./src/core/EnhancedPageGenerator.js";
import { CompleteFeatureGenerator } from "./src/core/CompleteFeatureGenerator.js";
import { ContentGenerator } from "./src/ai/ContentGenerator.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

class ProjectRegenerator {
  constructor() {
    this.projectPath = "/Users/designer/Downloads/digital-ghost-protocol-420";
    this.contentGenerator = new ContentGenerator();
    this.enhancedPageGenerator = new EnhancedPageGenerator(
      this.contentGenerator,
    );
    this.completeFeatureGenerator = new CompleteFeatureGenerator();
  }

  async regenerateProject() {
    console.log(chalk.blue("🚀 Regenerating Project with Enhanced Pages..."));

    try {
      // Verify project exists
      const projectExists = await fs.pathExists(this.projectPath);
      if (!projectExists) {
        throw new Error(`Project not found at ${this.projectPath}`);
      }

      // Create context for the existing project
      const context = {
        businessName: "Digital Ghost Protocol #420",
        description:
          "this is a digital ghost protocol, we ghost your digital presence",
        framework: "react",
        industry: "technology",
        selectedFeatures: [
          "contact-form",
          "gallery",
          "testimonials",
          "auth",
          "reviews",
          "chat",
        ],
        outputDir: this.projectPath,
        aiContent: null,
      };

      // Ensure directory structure exists
      await this.ensureDirectoryStructure();

      // Generate enhanced pages
      console.log(chalk.cyan("📄 Generating enhanced pages..."));
      await this.enhancedPageGenerator.generatePages(context);

      // Generate all complete feature components with CSS
      console.log(chalk.cyan("🔧 Generating complete feature components..."));
      await this.completeFeatureGenerator.generateAllFeatures(context);

      // Update App.tsx to use AppRouter
      await this.updateAppComponent();

      // Update main.tsx to include enhanced styles
      await this.updateMainTsx();

      // Copy navigation styles
      await this.copyNavigationStyles();

      // Update package.json if needed
      await this.updatePackageJson();

      console.log(chalk.green("✅ Project regeneration complete!"));
      console.log(chalk.yellow("\n📊 Enhanced Features Added:"));
      console.log(chalk.gray("   - Comprehensive Home page with 7 sections"));
      console.log(chalk.gray("   - Detailed About page with timeline & team"));
      console.log(chalk.gray("   - Professional Services page with process"));
      console.log(chalk.gray("   - Feature-rich Contact page with form"));
      console.log(chalk.gray("   - Production-ready CSS with animations"));
      console.log(chalk.gray("   - Responsive navigation with mobile support"));
      console.log(chalk.gray("   - React Router integration"));
      console.log(chalk.gray("   - Professional styling and typography"));
      console.log(chalk.gray("   - Complete feature components with CSS"));
      console.log(chalk.gray("   - All selected features fully functional"));

      console.log(chalk.blue("\n🎯 Next Steps:"));
      console.log(
        chalk.gray(
          '   1. cd "/Users/designer/Downloads/digital-ghost-protocol-420"',
        ),
      );
      console.log(chalk.gray("   2. npm install (if needed)"));
      console.log(chalk.gray("   3. npm run dev"));
      console.log(chalk.gray("   4. View the enhanced site at localhost:3000"));
    } catch (error) {
      console.error(chalk.red("❌ Regeneration failed:"), error);
      throw error;
    }
  }

  async ensureDirectoryStructure() {
    const dirs = ["src/pages", "src/styles", "src/components"];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }
  }

  async updateAppComponent() {
    const appPath = path.join(this.projectPath, "src/App.tsx");

    const newAppContent = `import React from 'react';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;`;

    await fs.writeFile(appPath, newAppContent);
    console.log(chalk.gray("   ✓ Updated App.tsx to use AppRouter"));
  }

  async updateMainTsx() {
    const mainPath = path.join(this.projectPath, "src/main.tsx");

    const newMainContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    await fs.writeFile(mainPath, newMainContent);
    console.log(chalk.gray("   ✓ Updated main.tsx to include enhanced styles"));
  }

  async copyNavigationStyles() {
    const navCSSPath = path.join(
      process.cwd(),
      "src/core/navigation-styles.css",
    );
    const targetPath = path.join(
      this.projectPath,
      "src/components/Navigation.css",
    );

    try {
      const navCSS = await fs.readFile(navCSSPath, "utf8");
      await fs.writeFile(targetPath, navCSS);
      console.log(chalk.gray("   ✓ Added Navigation.css"));
    } catch (error) {
      console.warn(
        chalk.yellow("   ⚠️  Navigation CSS not found, using fallback"),
      );

      // Fallback navigation CSS
      const fallbackNavCSS = `/* Navigation Styles */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
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
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #333;
  transition: all 0.3s ease;
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
    background: white;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    transform: translateY(-100vh);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    transform: translateY(0);
  }
}`;

      await fs.writeFile(targetPath, fallbackNavCSS);
    }
  }

  async updatePackageJson() {
    const packagePath = path.join(this.projectPath, "package.json");

    try {
      const packageContent = await fs.readFile(packagePath, "utf8");
      const packageObj = JSON.parse(packageContent);

      // Ensure react-router-dom is included
      if (!packageObj.dependencies["react-router-dom"]) {
        packageObj.dependencies["react-router-dom"] = "^6.8.0";
        await fs.writeFile(packagePath, JSON.stringify(packageObj, null, 2));
        console.log(chalk.gray("   ✓ Added react-router-dom to dependencies"));
      }
    } catch (error) {
      console.warn(chalk.yellow("   ⚠️  Could not update package.json"));
    }
  }
}

// Run the regeneration
const regenerator = new ProjectRegenerator();
regenerator.regenerateProject().catch(console.error);
