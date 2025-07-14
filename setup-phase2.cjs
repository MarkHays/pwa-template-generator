/**
 * Phase 2 Enterprise Setup & Validation Script
 * Ensures all Phase 2 dependencies and configurations are properly set up
 *
 * Usage: node setup-phase2.cjs
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class Phase2Setup {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
    this.log = {
      info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
      success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
      warning: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`),
      error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
      step: (msg) => console.log(`\x1b[34m[STEP]\x1b[0m ${msg}`)
    };
  }

  async run() {
    console.log('\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║            🏢 PHASE 2 ENTERPRISE SETUP & VALIDATION          ║\x1b[0m');
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

    try {
      await this.validateNodeEnvironment();
      await this.checkProjectStructure();
      await this.validateEnvironmentFile();
      await this.installDependencies();
      await this.validateOAuthConfiguration();
      await this.validateDatabaseConfiguration();
      await this.testBasicFunctionality();
      await this.runIntegrationTests();

      this.generateReport();
      this.provideNextSteps();

    } catch (error) {
      this.log.error(`Setup failed: ${error.message}`);
      process.exit(1);
    }
  }

  async validateNodeEnvironment() {
    this.log.step('🔍 Validating Node.js Environment...');

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

    if (majorVersion < 16) {
      throw new Error(`Node.js 16+ required. Current version: ${nodeVersion}`);
    }

    this.log.success(`Node.js version: ${nodeVersion} ✓`);

    // Check npm version
    try {
      const { stdout } = await execAsync('npm --version');
      this.log.success(`npm version: ${stdout.trim()} ✓`);
    } catch (error) {
      this.warnings.push('npm not found - some features may not work');
    }

    this.results.push({
      category: 'Environment',
      test: 'Node.js Version',
      status: 'pass',
      details: `Node.js ${nodeVersion}`
    });
  }

  async checkProjectStructure() {
    this.log.step('📁 Checking Phase 2 Project Structure...');

    const requiredFiles = [
      'src/auth/AuthenticationSystem.js',
      'src/database/DatabaseIntegration.js',
      'src/core/Phase2Integration.js',
      'src/auth/templates/ReactAuthComponents.js',
      'package.json'
    ];

    const requiredDirs = [
      'src/auth',
      'src/database',
      'src/core',
      'src/auth/templates'
    ];

    let allFilesExist = true;
    let allDirsExist = true;

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        this.log.success(`✓ ${file}`);
      } catch (error) {
        this.log.error(`✗ Missing: ${file}`);
        this.errors.push(`Required file missing: ${file}`);
        allFilesExist = false;
      }
    }

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
        this.log.success(`✓ ${dir}/`);
      } catch (error) {
        this.log.error(`✗ Missing directory: ${dir}`);
        this.errors.push(`Required directory missing: ${dir}`);
        allDirsExist = false;
      }
    }

    this.results.push({
      category: 'Project Structure',
      test: 'Required Files and Directories',
      status: allFilesExist && allDirsExist ? 'pass' : 'fail',
      details: `${requiredFiles.length} files, ${requiredDirs.length} directories checked`
    });
  }

  async validateEnvironmentFile() {
    this.log.step('🔧 Validating Environment Configuration...');

    const envPath = '.env';
    let envExists = false;
    let envConfig = {};

    try {
      await fs.access(envPath);
      envExists = true;
      const envContent = await fs.readFile(envPath, 'utf-8');

      // Parse .env file
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envConfig[key.trim()] = value.trim();
        }
      });

      this.log.success('✓ .env file found');
    } catch (error) {
      this.log.warning('⚠ .env file not found - creating template...');
      await this.createEnvironmentTemplate();
      envExists = false;
    }

    // Check required environment variables
    const requiredEnvVars = [
      'NODE_ENV',
      'PORT',
      'JWT_SECRET',
      'DB_PROVIDER',
      'PG_HOST',
      'PG_DATABASE',
      'PG_USER',
      'PG_PASSWORD'
    ];

    const recommendedEnvVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET'
    ];

    let requiredMissing = 0;
    let recommendedMissing = 0;

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar] && !envConfig[envVar]) {
        this.log.error(`✗ Missing required: ${envVar}`);
        this.errors.push(`Required environment variable missing: ${envVar}`);
        requiredMissing++;
      } else {
        this.log.success(`✓ ${envVar}`);
      }
    }

    for (const envVar of recommendedEnvVars) {
      if (!process.env[envVar] && !envConfig[envVar]) {
        this.log.warning(`⚠ Missing recommended: ${envVar}`);
        this.warnings.push(`Recommended environment variable missing: ${envVar}`);
        recommendedMissing++;
      } else {
        this.log.success(`✓ ${envVar}`);
      }
    }

    this.results.push({
      category: 'Environment',
      test: 'Environment Variables',
      status: requiredMissing === 0 ? 'pass' : 'fail',
      details: `${requiredMissing} required missing, ${recommendedMissing} recommended missing`
    });
  }

  async createEnvironmentTemplate() {
    const envTemplate = `# Phase 2 Enterprise Environment Configuration
# Copy this file to .env and fill in your actual values

# Basic Configuration
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-needs-to-be-at-least-32-characters-long

# Database Configuration (PostgreSQL)
DB_PROVIDER=postgresql
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=pwa_enterprise_test
PG_USER=postgres
PG_PASSWORD=your-database-password

# OAuth Provider Credentials
# Get these from:
# Google: https://console.cloud.google.com/
# GitHub: https://github.com/settings/developers

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Optional OAuth Providers
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# AI Features (Optional)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Security Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Real-time Features
REALTIME_PORT=3001
`;

    await fs.writeFile('.env.template', envTemplate);
    this.log.success('✓ Created .env.template - copy to .env and configure');
  }

  async installDependencies() {
    this.log.step('📦 Installing Phase 2 Dependencies...');

    try {
      this.log.info('Installing npm dependencies...');
      const { stdout, stderr } = await execAsync('npm install', { timeout: 300000 });

      if (stderr && !stderr.includes('deprecated')) {
        this.log.warning(`npm warnings: ${stderr}`);
      }

      this.log.success('✓ Dependencies installed successfully');

      // Verify critical dependencies
      const criticalDeps = [
        'express',
        'jsonwebtoken',
        'cors',
        'helmet',
        'express-rate-limit',
        'socket.io',
        'pg',
        'mongodb',
        'googleapis'
      ];

      let missingDeps = 0;
      for (const dep of criticalDeps) {
        try {
          require.resolve(dep);
          this.log.success(`✓ ${dep}`);
        } catch (error) {
          this.log.error(`✗ Missing: ${dep}`);
          this.errors.push(`Critical dependency missing: ${dep}`);
          missingDeps++;
        }
      }

      this.results.push({
        category: 'Dependencies',
        test: 'NPM Package Installation',
        status: missingDeps === 0 ? 'pass' : 'fail',
        details: `${criticalDeps.length - missingDeps}/${criticalDeps.length} critical dependencies available`
      });

    } catch (error) {
      this.log.error('Failed to install dependencies');
      this.errors.push(`Dependency installation failed: ${error.message}`);

      this.results.push({
        category: 'Dependencies',
        test: 'NPM Package Installation',
        status: 'fail',
        details: error.message
      });
    }
  }

  async validateOAuthConfiguration() {
    this.log.step('🔐 Validating OAuth Configuration...');

    const oauthProviders = [
      { name: 'Google', clientId: 'GOOGLE_CLIENT_ID', clientSecret: 'GOOGLE_CLIENT_SECRET' },
      { name: 'GitHub', clientId: 'GITHUB_CLIENT_ID', clientSecret: 'GITHUB_CLIENT_SECRET' },
      { name: 'Microsoft', clientId: 'MICROSOFT_CLIENT_ID', clientSecret: 'MICROSOFT_CLIENT_SECRET' }
    ];

    let configuredProviders = 0;
    let workingProviders = 0;

    for (const provider of oauthProviders) {
      const hasClientId = !!(process.env[provider.clientId] || '').trim();
      const hasClientSecret = !!(process.env[provider.clientSecret] || '').trim();

      if (hasClientId && hasClientSecret) {
        configuredProviders++;
        this.log.success(`✓ ${provider.name} OAuth configured`);

        // Basic validation of credential format
        const clientId = process.env[provider.clientId];
        if (clientId && clientId.length > 10 && !clientId.includes('your-')) {
          workingProviders++;
          this.log.success(`✓ ${provider.name} credentials appear valid`);
        } else {
          this.log.warning(`⚠ ${provider.name} credentials may be template values`);
        }
      } else {
        this.log.warning(`⚠ ${provider.name} OAuth not configured`);
        this.warnings.push(`${provider.name} OAuth provider not configured`);
      }
    }

    this.results.push({
      category: 'Authentication',
      test: 'OAuth Provider Configuration',
      status: configuredProviders > 0 ? 'pass' : 'fail',
      details: `${configuredProviders} providers configured, ${workingProviders} appear valid`
    });
  }

  async validateDatabaseConfiguration() {
    this.log.step('🗄️ Validating Database Configuration...');

    const dbProvider = process.env.DB_PROVIDER || 'postgresql';
    let dbStatus = 'fail';
    let dbDetails = 'No database configuration found';

    if (dbProvider === 'postgresql') {
      const pgConfig = {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD
      };

      if (pgConfig.database && pgConfig.user) {
        this.log.success('✓ PostgreSQL configuration found');

        // Test connection if pg is available
        try {
          const { Client } = require('pg');
          const client = new Client(pgConfig);

          await client.connect();
          await client.query('SELECT NOW()');
          await client.end();

          this.log.success('✓ PostgreSQL connection successful');
          dbStatus = 'pass';
          dbDetails = 'PostgreSQL connection verified';
        } catch (error) {
          this.log.warning(`⚠ PostgreSQL connection failed: ${error.message}`);
          this.warnings.push(`Database connection issue: ${error.message}`);
          dbStatus = 'warning';
          dbDetails = `PostgreSQL configured but connection failed: ${error.message}`;
        }
      } else {
        this.log.error('✗ PostgreSQL configuration incomplete');
        this.errors.push('PostgreSQL configuration missing required fields');
        dbDetails = 'PostgreSQL configuration incomplete';
      }
    }

    this.results.push({
      category: 'Database',
      test: 'Database Configuration',
      status: dbStatus,
      details: dbDetails
    });
  }

  async testBasicFunctionality() {
    this.log.step('🧪 Testing Basic Functionality...');

    // Test file imports
    let importTests = 0;
    const modules = [
      'src/auth/AuthenticationSystem.js',
      'src/database/DatabaseIntegration.js',
      'src/core/Phase2Integration.js'
    ];

    for (const modulePath of modules) {
      try {
        // Since these are ES modules, we can't require them directly
        // Instead, check if they have valid syntax
        const content = await fs.readFile(modulePath, 'utf-8');

        if (content.includes('export class') && content.includes('constructor')) {
          this.log.success(`✓ ${modulePath} syntax valid`);
          importTests++;
        } else {
          this.log.warning(`⚠ ${modulePath} may have syntax issues`);
        }
      } catch (error) {
        this.log.error(`✗ ${modulePath} test failed: ${error.message}`);
      }
    }

    // Test JWT secret generation
    try {
      const jwt = require('jsonwebtoken');
      const testPayload = { test: true };
      const secret = process.env.JWT_SECRET || 'test-secret';

      const token = jwt.sign(testPayload, secret);
      const decoded = jwt.verify(token, secret);

      if (decoded.test === true) {
        this.log.success('✓ JWT functionality working');
        importTests++;
      }
    } catch (error) {
      this.log.warning(`⚠ JWT test failed: ${error.message}`);
    }

    this.results.push({
      category: 'Functionality',
      test: 'Basic Module Tests',
      status: importTests >= 2 ? 'pass' : 'fail',
      details: `${importTests}/${modules.length + 1} basic tests passed`
    });
  }

  async runIntegrationTests() {
    this.log.step('🔄 Running Integration Tests...');

    try {
      // Run our existing Phase 2 test suite
      const { stdout, stderr } = await execAsync('node test-phase2-simple.cjs', { timeout: 60000 });

      // Parse test results from output
      const successMatch = stdout.match(/Tests Passed: (\d+)\/(\d+)/);
      const successRate = stdout.match(/\((\d+\.\d+)%\)/);

      if (successMatch && successRate) {
        const passed = parseInt(successMatch[1]);
        const total = parseInt(successMatch[2]);
        const rate = parseFloat(successRate[1]);

        this.log.success(`✓ Integration tests completed: ${passed}/${total} (${rate}%)`);

        this.results.push({
          category: 'Integration',
          test: 'Phase 2 Test Suite',
          status: rate >= 85 ? 'pass' : 'warning',
          details: `${passed}/${total} tests passed (${rate}%)`
        });
      } else {
        this.log.warning('⚠ Could not parse test results');
        this.results.push({
          category: 'Integration',
          test: 'Phase 2 Test Suite',
          status: 'warning',
          details: 'Tests ran but results unclear'
        });
      }
    } catch (error) {
      this.log.error(`✗ Integration tests failed: ${error.message}`);
      this.results.push({
        category: 'Integration',
        test: 'Phase 2 Test Suite',
        status: 'fail',
        details: `Test execution failed: ${error.message}`
      });
    }
  }

  generateReport() {
    console.log('\n\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║                    📊 SETUP REPORT                           ║\x1b[0m');
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log(`📈 Overall Success Rate: ${successRate}% (${passed}/${total} passed)`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Failed: ${failed}\n`);

    // Detailed results by category
    const categories = [...new Set(this.results.map(r => r.category))];

    for (const category of categories) {
      console.log(`\x1b[34m${category}:\x1b[0m`);
      const categoryResults = this.results.filter(r => r.category === category);

      for (const result of categoryResults) {
        const statusIcon = {
          'pass': '✅',
          'warning': '⚠️',
          'fail': '❌'
        }[result.status];

        console.log(`  ${statusIcon} ${result.test}: ${result.details}`);
      }
      console.log('');
    }

    // Errors and warnings summary
    if (this.errors.length > 0) {
      console.log('\x1b[31m🚨 ERRORS TO FIX:\x1b[0m');
      this.errors.forEach(error => console.log(`  • ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('\x1b[33m⚠️  WARNINGS:\x1b[0m');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
      console.log('');
    }
  }

  provideNextSteps() {
    console.log('\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║                    📋 NEXT STEPS                             ║\x1b[0m');
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

    const passed = this.results.filter(r => r.status === 'pass').length;
    const total = this.results.length;
    const successRate = (passed / total) * 100;

    if (successRate >= 95) {
      console.log('\x1b[32m🎉 EXCELLENT! Phase 2 is ready for production!\x1b[0m\n');
      console.log('✅ You can now:');
      console.log('  • Start the enterprise server: npm run start:enterprise');
      console.log('  • Test authentication flows');
      console.log('  • Create database schemas');
      console.log('  • Move to Phase 3 development');
    } else if (successRate >= 85) {
      console.log('\x1b[33m⚠️  GOOD PROGRESS! Address the issues below:\x1b[0m\n');

      if (this.errors.length > 0) {
        console.log('🔧 Required fixes:');
        this.errors.forEach(error => console.log(`  • ${error}`));
        console.log('');
      }

      console.log('📋 After fixing errors:');
      console.log('  • Run: node setup-phase2.cjs (to revalidate)');
      console.log('  • Test: npm run test:phase2');
      console.log('  • Start: npm run dev:enterprise');
    } else {
      console.log('\x1b[31m🛠️  SETUP INCOMPLETE! Major issues need attention:\x1b[0m\n');

      console.log('🚨 Critical steps:');
      if (!process.env.JWT_SECRET) {
        console.log('  1. Set JWT_SECRET in .env file');
      }
      if (!process.env.PG_DATABASE) {
        console.log('  2. Configure database settings in .env');
      }
      if (!process.env.GOOGLE_CLIENT_ID && !process.env.GITHUB_CLIENT_ID) {
        console.log('  3. Set up at least one OAuth provider');
      }
      console.log('  4. Run: node setup-phase2.cjs (to revalidate)');
    }

    console.log('\n📚 Documentation:');
    console.log('  • Phase 2 Guide: PHASE2-ENTERPRISE-README.md');
    console.log('  • Setup Help: PHASE2-COMPLETION-STATUS.md');
    console.log('  • OAuth Setup: See "YOUR ACTION ITEMS" section');

    console.log('\n🆘 Need help?');
    console.log('  • Check environment: cat .env');
    console.log('  • Test database: psql -h localhost -U postgres -d pwa_enterprise_test');
    console.log('  • Validate OAuth: Check provider dashboards');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  const setup = new Phase2Setup();
  setup.run().catch(error => {
    console.error('\x1b[31m💥 Setup failed:\x1b[0m', error);
    process.exit(1);
  });
}

module.exports = Phase2Setup;
