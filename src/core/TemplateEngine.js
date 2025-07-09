/**
 * Advanced Template Engine - Enterprise PWA Generator
 * Supports multi-framework generation with AI-powered customization
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import chalk from 'chalk';
import { glob } from 'glob';
import { minify } from 'terser';
import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TemplateEngine {
  constructor(options = {}) {
    this.options = {
      templatesDir: path.join(__dirname, '../../templates'),
      outputDir: options.outputDir || process.cwd(),
      framework: options.framework || 'react',
      typescript: options.typescript || true,
      minify: options.minify || false,
      ...options
    };

    this.frameworks = {
      react: {
        name: 'React',
        version: '18.2.0',
        dependencies: ['react', 'react-dom', 'react-router-dom'],
        devDependencies: ['@types/react', '@types/react-dom', '@vitejs/plugin-react'],
        extensions: ['.jsx', '.tsx'],
        buildTool: 'vite'
      },
      vue: {
        name: 'Vue',
        version: '3.3.0',
        dependencies: ['vue', 'vue-router', 'pinia'],
        devDependencies: ['@vitejs/plugin-vue', '@vue/tsconfig'],
        extensions: ['.vue'],
        buildTool: 'vite'
      },
      angular: {
        name: 'Angular',
        version: '17.0.0',
        dependencies: ['@angular/core', '@angular/common', '@angular/router'],
        devDependencies: ['@angular/cli', '@angular/compiler-cli'],
        extensions: ['.ts'],
        buildTool: 'angular-cli'
      },
      nextjs: {
        name: 'Next.js',
        version: '14.0.0',
        dependencies: ['next', 'react', 'react-dom'],
        devDependencies: ['@types/node', '@types/react', '@types/react-dom'],
        extensions: ['.jsx', '.tsx'],
        buildTool: 'next'
      },
      svelte: {
        name: 'Svelte',
        version: '4.0.0',
        dependencies: ['svelte'],
        devDependencies: ['@sveltejs/kit', '@sveltejs/adapter-auto'],
        extensions: ['.svelte'],
        buildTool: 'vite'
      },
      astro: {
        name: 'Astro',
        version: '4.0.0',
        dependencies: ['astro'],
        devDependencies: ['@astrojs/react', '@astrojs/tailwind'],
        extensions: ['.astro'],
        buildTool: 'astro'
      }
    };

    this.industryTemplates = {
      'small-business': {
        name: 'Small Business',
        components: ['Hero', 'About', 'Services', 'Contact', 'Gallery'],
        features: ['contact-form', 'gallery', 'testimonials', 'business-info'],
        colorScheme: 'professional',
        layout: 'standard'
      },
      'e-commerce': {
        name: 'E-commerce',
        components: ['ProductCatalog', 'Cart', 'Checkout', 'UserAccount'],
        features: ['payments', 'inventory', 'reviews', 'wishlist'],
        colorScheme: 'vibrant',
        layout: 'product-focused'
      },
      'saas': {
        name: 'SaaS Platform',
        components: ['Dashboard', 'Analytics', 'Settings', 'Billing'],
        features: ['authentication', 'multi-tenant', 'analytics', 'payments'],
        colorScheme: 'modern',
        layout: 'dashboard'
      },
      'portfolio': {
        name: 'Portfolio',
        components: ['ProjectShowcase', 'About', 'Skills', 'Contact'],
        features: ['gallery', 'blog', 'contact-form'],
        colorScheme: 'creative',
        layout: 'showcase'
      },
      'restaurant': {
        name: 'Restaurant',
        components: ['Menu', 'Reservations', 'Location', 'Reviews'],
        features: ['booking', 'menu-display', 'location', 'reviews'],
        colorScheme: 'warm',
        layout: 'hospitality'
      },
      'healthcare': {
        name: 'Healthcare',
        components: ['Services', 'Appointments', 'Staff', 'Contact'],
        features: ['appointment-booking', 'HIPAA-compliance', 'patient-portal'],
        colorScheme: 'medical',
        layout: 'professional'
      }
    };

    this.setupHandlebars();
  }

  setupHandlebars() {
    // Register custom helpers
    Handlebars.registerHelper('json', (obj) => JSON.stringify(obj, null, 2));

    Handlebars.registerHelper('uppercase', (str) => str.toUpperCase());

    Handlebars.registerHelper('lowercase', (str) => str.toLowerCase());

    Handlebars.registerHelper('camelCase', (str) => {
      return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    });

    Handlebars.registerHelper('pascalCase', (str) => {
      const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    });

    Handlebars.registerHelper('kebabCase', (str) => {
      return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, '');
    });

    Handlebars.registerHelper('if_eq', function(a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this);
    });

    Handlebars.registerHelper('if_includes', function(array, value, opts) {
      return array.includes(value) ? opts.fn(this) : opts.inverse(this);
    });

    Handlebars.registerHelper('frameworkExt', (framework) => {
      const ext = this.frameworks[framework]?.extensions[0] || '.js';
      return this.options.typescript ? ext.replace('.js', '.ts') : ext;
    });

    Handlebars.registerHelper('importStatement', (framework, module) => {
      const statements = {
        react: `import ${module} from '${module}';`,
        vue: `import ${module} from '${module}';`,
        angular: `import { ${module} } from '${module}';`,
        nextjs: `import ${module} from '${module}';`,
        svelte: `import ${module} from '${module}';`,
        astro: `import ${module} from '${module}';`
      };
      return statements[framework] || statements.react;
    });
  }

  async generateProject(config) {
    console.log(chalk.blue('🚀 Starting enterprise PWA generation...'));

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

      console.log(chalk.green('✅ Enterprise PWA generated successfully!'));

      return {
        success: true,
        path: this.options.outputDir,
        framework: context.framework,
        features: context.features,
        components: context.components
      };

    } catch (error) {
      console.error(chalk.red('❌ Error generating PWA:'), error);
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
        camelCase: (str) => str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''),
        pascalCase: (str) => {
          const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
          return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        },
        kebabCase: (str) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, '')
      }
    };

    return context;
  }

  async createProjectStructure(context) {
    const dirs = [
      'src',
      'src/components',
      'src/components/common',
      'src/components/layout',
      'src/components/sections',
      'src/pages',
      'src/hooks',
      'src/utils',
      'src/services',
      'src/store',
      'src/styles',
      'src/assets',
      'src/assets/images',
      'src/assets/icons',
      'src/types',
      'src/config',
      'public',
      'docs',
      'tests',
      'tests/unit',
      'tests/integration',
      'tests/e2e'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(context.outputDir, dir));
    }
  }

  async generateFrameworkFiles(context) {
    const templateDir = path.join(this.options.templatesDir, context.framework);

    if (!await fs.pathExists(templateDir)) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }

    const files = await glob('**/*', { cwd: templateDir });

    for (const file of files) {
      const sourcePath = path.join(templateDir, file);
      const stat = await fs.stat(sourcePath);

      if (stat.isFile()) {
        await this.processTemplate(sourcePath, file, context);
      }
    }
  }

  async generateComponents(context) {
    const componentDir = path.join(this.options.templatesDir, 'components');

    for (const componentName of context.components) {
      const componentPath = path.join(componentDir, `${componentName}.hbs`);

      if (await fs.pathExists(componentPath)) {
        await this.processTemplate(
          componentPath,
          `src/components/sections/${componentName}.${this.getFileExtension(context)}`,
          context
        );
      }
    }
  }

  async generateStyles(context) {
    const styleDir = path.join(this.options.templatesDir, 'styles');
    const outputStyleDir = path.join(context.outputDir, 'src/styles');

    // Generate main stylesheet
    const mainStylePath = path.join(styleDir, 'main.scss.hbs');
    if (await fs.pathExists(mainStylePath)) {
      await this.processTemplate(
        mainStylePath,
        'src/styles/main.scss',
        context
      );
    }

    // Generate component styles
    for (const component of context.components) {
      const componentStylePath = path.join(styleDir, 'components', `${component}.scss.hbs`);
      if (await fs.pathExists(componentStylePath)) {
        await this.processTemplate(
          componentStylePath,
          `src/styles/components/${component}.scss`,
          context
        );
      }
    }
  }

  async generateConfigFiles(context) {
    const configTemplates = [
      'tsconfig.json.hbs',
      'vite.config.js.hbs',
      'tailwind.config.js.hbs',
      'postcss.config.js.hbs',
      '.env.example.hbs',
      '.gitignore.hbs',
      'README.md.hbs'
    ];

    for (const template of configTemplates) {
      const templatePath = path.join(this.options.templatesDir, 'config', template);
      if (await fs.pathExists(templatePath)) {
        await this.processTemplate(
          templatePath,
          template.replace('.hbs', ''),
          context
        );
      }
    }
  }

  async generatePackageJson(context) {
    const framework = context.frameworkConfig;

    const packageJson = {
      name: context.projectName,
      version: '1.0.0',
      description: context.description,
      private: true,
      type: 'module',
      scripts: {
        dev: this.getBuildCommand(context, 'dev'),
        build: this.getBuildCommand(context, 'build'),
        preview: this.getBuildCommand(context, 'preview'),
        test: 'vitest',
        'test:e2e': 'playwright test',
        lint: 'eslint . --ext .js,.jsx,.ts,.tsx,.vue',
        'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx,.vue --fix',
        format: 'prettier --write .',
        'type-check': context.typescript ? 'tsc --noEmit' : undefined
      },
      dependencies: {
        ...this.getFrameworkDependencies(framework),
        ...this.getFeatureDependencies(context.features)
      },
      devDependencies: {
        ...this.getFrameworkDevDependencies(framework),
        ...this.getCommonDevDependencies(context)
      },
      engines: {
        node: '>=16.0.0',
        npm: '>=8.0.0'
      },
      keywords: [
        'pwa',
        'progressive-web-app',
        context.framework,
        context.industry,
        'enterprise'
      ],
      author: '',
      license: 'MIT'
    };

    await fs.writeJson(
      path.join(context.outputDir, 'package.json'),
      packageJson,
      { spaces: 2 }
    );
  }

  async generatePWAFiles(context) {
    const pwaTemplates = [
      'manifest.json.hbs',
      'sw.js.hbs',
      'offline.html.hbs'
    ];

    for (const template of pwaTemplates) {
      const templatePath = path.join(this.options.templatesDir, 'pwa', template);
      if (await fs.pathExists(templatePath)) {
        const outputPath = template.replace('.hbs', '');
        await this.processTemplate(
          templatePath,
          `public/${outputPath}`,
          context
        );
      }
    }
  }

  async generateDeploymentFiles(context) {
    for (const deployment of context.deployment) {
      const deploymentDir = path.join(this.options.templatesDir, 'deployment', deployment);

      if (await fs.pathExists(deploymentDir)) {
        const files = await glob('**/*', { cwd: deploymentDir });

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
      'vitest.config.js.hbs',
      'playwright.config.js.hbs',
      'jest.config.js.hbs'
    ];

    for (const template of testTemplates) {
      const templatePath = path.join(this.options.templatesDir, 'testing', template);
      if (await fs.pathExists(templatePath)) {
        await this.processTemplate(
          templatePath,
          template.replace('.hbs', ''),
          context
        );
      }
    }
  }

  async processTemplate(sourcePath, outputPath, context) {
    try {
      const template = await fs.readFile(sourcePath, 'utf-8');
      const compiled = Handlebars.compile(template);
      let content = compiled(context);

      // Post-process based on file type
      if (outputPath.endsWith('.js') || outputPath.endsWith('.ts')) {
        content = await this.processJavaScript(content, context);
      } else if (outputPath.endsWith('.css') || outputPath.endsWith('.scss')) {
        content = await this.processStyles(content, context);
      }

      const fullOutputPath = path.join(context.outputDir, outputPath);
      await fs.ensureDir(path.dirname(fullOutputPath));
      await fs.writeFile(fullOutputPath, content);

      console.log(chalk.green(`✅ Generated: ${outputPath}`));

    } catch (error) {
      console.error(chalk.red(`❌ Error processing template ${sourcePath}:`), error);
      throw error;
    }
  }

  async processJavaScript(content, context) {
    if (context.minify) {
      const result = await minify(content, {
        mangle: false,
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      });
      return result.code;
    }
    return content;
  }

  async processStyles(content, context) {
    if (content.includes('@') || content.includes('$')) {
      // Process SCSS
      const result = sass.compileString(content, {
        style: context.minify ? 'compressed' : 'expanded'
      });

      // Process with PostCSS
      const postcssResult = await postcss([
        autoprefixer(),
        ...(context.minify ? [cssnano()] : [])
      ]).process(result.css, { from: undefined });

      return postcssResult.css;
    }

    return content;
  }

  getBuildCommand(context, command) {
    const commands = {
      vite: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      next: {
        dev: 'next dev',
        build: 'next build',
        preview: 'next start'
      },
      'angular-cli': {
        dev: 'ng serve',
        build: 'ng build',
        preview: 'ng serve --prod'
      },
      astro: {
        dev: 'astro dev',
        build: 'astro build',
        preview: 'astro preview'
      }
    };

    return commands[context.buildTool]?.[command] || `npm run ${command}`;
  }

  getFrameworkDependencies(framework) {
    const deps = {};
    framework.dependencies.forEach(dep => {
      deps[dep] = 'latest';
    });
    return deps;
  }

  getFrameworkDevDependencies(framework) {
    const deps = {};
    framework.devDependencies.forEach(dep => {
      deps[dep] = 'latest';
    });
    return deps;
  }

  getFeatureDependencies(features) {
    const deps = {};
    const featureMap = {
      'contact-form': ['formik', 'yup'],
      'payments': ['stripe'],
      'analytics': ['@google-analytics/gtag'],
      'authentication': ['firebase', 'auth0'],
      'database': ['prisma'],
      'cms': ['contentful'],
      'real-time': ['socket.io-client']
    };

    features.forEach(feature => {
      if (featureMap[feature]) {
        featureMap[feature].forEach(dep => {
          deps[dep] = 'latest';
        });
      }
    });

    return deps;
  }

  getCommonDevDependencies(context) {
    const deps = {
      'vite': 'latest',
      'vitest': 'latest',
      'playwright': 'latest',
      'eslint': 'latest',
      'prettier': 'latest',
      'sass': 'latest',
      'postcss': 'latest',
      'autoprefixer': 'latest',
      'cssnano': 'latest',
      'terser': 'latest'
    };

    if (context.typescript) {
      deps['typescript'] = 'latest';
      deps['@types/node'] = 'latest';
    }

    return deps;
  }

  getFileExtension(context) {
    const extensions = {
      react: context.typescript ? 'tsx' : 'jsx',
      vue: 'vue',
      angular: 'ts',
      nextjs: context.typescript ? 'tsx' : 'jsx',
      svelte: 'svelte',
      astro: 'astro'
    };

    return extensions[context.framework] || 'js';
  }
}

export default TemplateEngine;
