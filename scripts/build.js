#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import chalk from 'chalk';
import ora from 'ora';
import { glob } from 'glob';
import { minify } from 'terser';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');

class PWATemplateBuilder {
  constructor() {
    this.spinner = ora();
  }

  async build() {
    console.log(chalk.cyan.bold('🚀 Building PWA Template Generator...\n'));

    try {
      await this.cleanup();
      await this.createDistStructure();
      await this.copySourceFiles();
      await this.buildTemplates();
      await this.optimizeAssets();
      await this.generatePackageJson();
      await this.copyStaticFiles();
      await this.validateBuild();

      console.log(chalk.green.bold('\n✅ Build completed successfully!'));
      console.log(chalk.gray(`📦 Output: ${DIST_DIR}`));

    } catch (error) {
      console.error(chalk.red.bold('\n❌ Build failed:'), error.message);
      process.exit(1);
    }
  }

  async cleanup() {
    this.spinner.start('Cleaning up previous build...');
    await fs.remove(DIST_DIR);
    this.spinner.succeed('Cleaned up previous build');
  }

  async createDistStructure() {
    this.spinner.start('Creating distribution structure...');

    const dirs = [
      'src',
      'templates',
      'assets',
      'bin'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(DIST_DIR, dir));
    }

    this.spinner.succeed('Created distribution structure');
  }

  async copySourceFiles() {
    this.spinner.start('Copying source files...');

    // Copy main index.js
    await fs.copy(path.join(ROOT_DIR, 'index.js'), path.join(DIST_DIR, 'index.js'));

    // Copy src directory
    if (await fs.pathExists(SRC_DIR)) {
      await fs.copy(SRC_DIR, path.join(DIST_DIR, 'src'));
    }

    this.spinner.succeed('Copied source files');
  }

  async buildTemplates() {
    this.spinner.start('Building and optimizing templates...');

    if (await fs.pathExists(TEMPLATES_DIR)) {
      await fs.copy(TEMPLATES_DIR, path.join(DIST_DIR, 'templates'));

      // Optimize template files
      const templateFiles = await glob('**/*.{js,ts,jsx,tsx,html,css,scss}', {
        cwd: path.join(DIST_DIR, 'templates'),
        absolute: true
      });

      for (const file of templateFiles) {
        await this.optimizeTemplateFile(file);
      }
    }

    this.spinner.succeed('Built and optimized templates');
  }

  async optimizeTemplateFile(filePath) {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath, 'utf8');

    if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      // Only minify if it's not a template file (contains handlebars syntax)
      if (!content.includes('{{') && !content.includes('{{{')) {
        try {
          const result = await minify(content, {
            compress: {
              drop_console: false, // Keep console for debugging
              drop_debugger: true
            },
            mangle: false, // Don't mangle names to keep readability
            format: {
              beautify: true,
              indent_level: 2
            }
          });

          if (result.code) {
            await fs.writeFile(filePath, result.code);
          }
        } catch (error) {
          // If minification fails, keep original content
          console.warn(chalk.yellow(`⚠️  Could not optimize ${filePath}: ${error.message}`));
        }
      }
    }
  }

  async optimizeAssets() {
    this.spinner.start('Optimizing assets...');

    // Copy web-app directory if it exists
    const webAppDir = path.join(ROOT_DIR, 'web-app');
    if (await fs.pathExists(webAppDir)) {
      await fs.copy(webAppDir, path.join(DIST_DIR, 'web-app'));
    }

    // Copy any other asset directories
    const assetDirs = ['assets', 'public', 'static'];
    for (const dir of assetDirs) {
      const srcPath = path.join(ROOT_DIR, dir);
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, path.join(DIST_DIR, dir));
      }
    }

    this.spinner.succeed('Optimized assets');
  }

  async generatePackageJson() {
    this.spinner.start('Generating package.json...');

    const originalPkg = await fs.readJson(path.join(ROOT_DIR, 'package.json'));

    const distPkg = {
      ...originalPkg,
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'node index.js'
      },
      // Remove dev dependencies from distribution
      devDependencies: undefined,
      // Add files field to specify what gets included
      files: [
        'index.js',
        'src/**/*',
        'templates/**/*',
        'assets/**/*',
        'web-app/**/*'
      ]
    };

    await fs.writeJson(path.join(DIST_DIR, 'package.json'), distPkg, { spaces: 2 });

    this.spinner.succeed('Generated package.json');
  }

  async copyStaticFiles() {
    this.spinner.start('Copying static files...');

    const staticFiles = [
      'README.md',
      'LICENSE',
      'ROADMAP.md',
      'TROUBLESHOOTING.md',
      'FIXES.md',
      '.gitignore'
    ];

    for (const file of staticFiles) {
      const srcPath = path.join(ROOT_DIR, file);
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, path.join(DIST_DIR, file));
      }
    }

    this.spinner.succeed('Copied static files');
  }

  async validateBuild() {
    this.spinner.start('Validating build...');

    // Check if main entry point exists
    const mainFile = path.join(DIST_DIR, 'index.js');
    if (!await fs.pathExists(mainFile)) {
      throw new Error('Main entry point (index.js) not found in dist');
    }

    // Check if package.json exists
    const pkgFile = path.join(DIST_DIR, 'package.json');
    if (!await fs.pathExists(pkgFile)) {
      throw new Error('package.json not found in dist');
    }

    // Check if templates exist
    const templatesDir = path.join(DIST_DIR, 'templates');
    if (!await fs.pathExists(templatesDir)) {
      console.warn(chalk.yellow('⚠️  Templates directory not found - this might be expected'));
    }

    this.spinner.succeed('Build validation passed');
  }
}

// Execute build if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new PWATemplateBuilder();
  builder.build().catch(error => {
    console.error(chalk.red('Build failed:'), error);
    process.exit(1);
  });
}

export default PWATemplateBuilder;
