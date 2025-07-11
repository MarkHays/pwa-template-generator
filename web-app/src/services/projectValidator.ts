/**
 * AI-Powered Project Validation Service
 * Comprehensive validation and auto-fix system for PWA generator
 */

import { aiService } from "./aiService";

export interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  fixedFiles?: GeneratedFile[];
  buildTest?: BuildTestResult;
}

export interface ValidationError {
  type: "syntax" | "dependency" | "import" | "build" | "runtime";
  file: string;
  line?: number;
  column?: number;
  message: string;
  severity: "error" | "warning";
  autoFixable: boolean;
  suggestedFix?: string;
}

export interface ValidationWarning {
  type: "performance" | "accessibility" | "seo" | "best-practice";
  file: string;
  message: string;
  suggestion: string;
}

export interface BuildTestResult {
  installSuccess: boolean;
  buildSuccess: boolean;
  devServerSuccess: boolean;
  errors: string[];
  warnings: string[];
  timeTaken: number;
}

export interface ProjectConfig {
  projectName: string;
  selectedFeatures: string[];
  framework: string;
  typescript: boolean;
  businessName: string;
  industry: string;
}

export class ProjectValidator {
  private readonly requiredDependencies = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
  };

  private readonly featureDependencies: Record<string, string[]> = {
    auth: ["react-hook-form", "@hookform/resolvers", "zod"],
    chat: ["socket.io-client", "emoji-picker-react"],
    payments: ["stripe", "@stripe/react-stripe-js"],
    booking: ["react-datepicker", "date-fns"],
    analytics: ["recharts", "react-chartjs-2"],
    geolocation: ["leaflet", "react-leaflet"],
    search: ["fuse.js", "react-select"],
    notifications: ["react-hot-toast", "web-push"],
    social: ["react-share", "social-auth-react"],
  };

  private readonly devDependencies = {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    eslint: "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    typescript: "^5.2.2",
    vite: "^5.0.8",
    "vite-plugin-pwa": "^0.17.0",
  };

  /**
   * Main validation method - validates entire project
   */
  async validateProject(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): Promise<ValidationResult> {
    console.log("🔍 Starting comprehensive project validation...");

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];
    let fixedFiles: GeneratedFile[] = [];

    try {
      // Phase 1: Pre-validation checks
      console.log("📋 Phase 1: Pre-validation checks...");
      const preValidation = await this.preValidateProject(files, config);
      errors.push(...preValidation.errors);
      warnings.push(...preValidation.warnings);
      suggestions.push(...preValidation.suggestions);

      // Phase 2: Syntax validation
      console.log("🔍 Phase 2: Syntax validation...");
      const syntaxValidation = await this.validateSyntax(files);
      errors.push(...syntaxValidation.errors);
      warnings.push(...syntaxValidation.warnings);

      // Phase 3: Dependency validation
      console.log("📦 Phase 3: Dependency validation...");
      const dependencyValidation = await this.validateDependencies(
        files,
        config,
      );
      errors.push(...dependencyValidation.errors);
      warnings.push(...dependencyValidation.warnings);

      // Phase 4: Import/Export validation
      console.log("🔗 Phase 4: Import/Export validation...");
      const importValidation = await this.validateImportsExports(files);
      errors.push(...importValidation.errors);
      warnings.push(...importValidation.warnings);

      // Phase 5: Auto-fix errors
      console.log("🛠️ Phase 5: Auto-fixing errors...");
      const fixResult = await this.autoFixErrors(files, errors, config);
      fixedFiles = fixResult.fixedFiles;
      const unfixedErrors = fixResult.remainingErrors;

      // Phase 6: Build test (if auto-fixes were applied)
      let buildTest: BuildTestResult | undefined;
      if (fixedFiles.length > 0) {
        console.log("🏗️ Phase 6: Testing build process...");
        buildTest = await this.testBuildProcess(fixedFiles, config);
        if (!buildTest.buildSuccess) {
          errors.push(
            ...buildTest.errors.map((error) => ({
              type: "build" as const,
              file: "build",
              message: error,
              severity: "error" as const,
              autoFixable: false,
            })),
          );
        }
      }

      const finalErrors = unfixedErrors.length > 0 ? unfixedErrors : errors;
      const isValid = finalErrors.length === 0;

      console.log(
        `✅ Validation complete. Valid: ${isValid}, Errors: ${finalErrors.length}, Warnings: ${warnings.length}`,
      );

      return {
        isValid,
        errors: finalErrors,
        warnings,
        suggestions,
        fixedFiles: fixedFiles.length > 0 ? fixedFiles : undefined,
        buildTest,
      };
    } catch (error) {
      console.error("❌ Validation failed:", error);
      return {
        isValid: false,
        errors: [
          {
            type: "runtime",
            file: "validator",
            message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            severity: "error",
            autoFixable: false,
          },
        ],
        warnings: [],
        suggestions: ["Please check the validator service configuration"],
      };
    }
  }

  /**
   * Pre-validation checks before generation
   */
  private async preValidateProject(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): Promise<{
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
  }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Check required files exist
    const requiredFiles = [
      "package.json",
      "src/main.tsx",
      "src/App.tsx",
      "index.html",
    ];
    for (const requiredFile of requiredFiles) {
      if (!files.find((f) => f.path === requiredFile)) {
        errors.push({
          type: "build",
          file: requiredFile,
          message: `Missing required file: ${requiredFile}`,
          severity: "error",
          autoFixable: true,
        });
      }
    }

    // Check feature compatibility
    const incompatibleFeatures = this.checkFeatureCompatibility(
      config.selectedFeatures,
    );
    for (const issue of incompatibleFeatures) {
      warnings.push({
        type: "best-practice",
        file: "configuration",
        message: issue,
        suggestion:
          "Consider reviewing feature selection for optimal compatibility",
      });
    }

    // Check project structure
    const structureIssues = this.validateProjectStructure(files);
    errors.push(...structureIssues);

    return { errors, warnings, suggestions };
  }

  /**
   * Validate syntax of all generated files
   */
  private async validateSyntax(files: GeneratedFile[]): Promise<{
    errors: ValidationError[];
    warnings: ValidationWarning[];
  }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const file of files) {
      try {
        switch (file.type) {
          case "tsx":
          case "jsx":
            const jsxErrors = this.validateJSXSyntax(file);
            errors.push(...jsxErrors);
            break;

          case "json":
            const jsonErrors = this.validateJSONSyntax(file);
            errors.push(...jsonErrors);
            break;

          case "css":
            const cssErrors = this.validateCSSSyntax(file);
            errors.push(...cssErrors);
            break;

          case "html":
            const htmlErrors = this.validateHTMLSyntax(file);
            errors.push(...htmlErrors);
            break;

          case "ts":
            const tsErrors = this.validateTypeScriptSyntax(file);
            errors.push(...tsErrors);
            break;
        }
      } catch (error) {
        errors.push({
          type: "syntax",
          file: file.path,
          message: `Syntax validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          severity: "error",
          autoFixable: true,
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate JSX/TSX syntax
   */
  private validateJSXSyntax(file: GeneratedFile): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = file.content;

    // Check for common JSX issues
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for missing quotes in attributes
      const unquotedAttributeRegex = /\s+\w+=[^"'{\s][^>\s]*/g;
      if (unquotedAttributeRegex.test(line)) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Unquoted attribute value detected",
          severity: "error",
          autoFixable: true,
          suggestedFix: "Add quotes around attribute values",
        });
      }

      // Check for missing whitespace between attributes
      const missingWhitespaceRegex = /\w+="[^"]*"[a-zA-Z]/g;
      if (missingWhitespaceRegex.test(line)) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Missing whitespace between attributes",
          severity: "error",
          autoFixable: true,
          suggestedFix: "Add space between attributes",
        });
      }

      // Check for unclosed JSX tags
      const openTags = (line.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (line.match(/<\/[^>]*>/g) || []).length;
      const selfClosingTags = (line.match(/<[^>]*\/>/g) || []).length;

      if (openTags > closeTags + selfClosingTags) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Potentially unclosed JSX tag",
          severity: "warning",
          autoFixable: true,
          suggestedFix: "Ensure all JSX tags are properly closed",
        });
      }
    });

    // Check for missing imports
    if (content.includes("React") && !content.includes("import React")) {
      errors.push({
        type: "syntax",
        file: file.path,
        line: 1,
        message: "Missing React import",
        severity: "error",
        autoFixable: true,
        suggestedFix: "Add: import React from 'react';",
      });
    }

    return errors;
  }

  /**
   * Validate JSON syntax
   */
  private validateJSONSyntax(file: GeneratedFile): ValidationError[] {
    const errors: ValidationError[] = [];

    try {
      JSON.parse(file.content);
    } catch (error) {
      errors.push({
        type: "syntax",
        file: file.path,
        message: `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
        severity: "error",
        autoFixable: true,
      });
    }

    return errors;
  }

  /**
   * Validate CSS syntax
   */
  private validateCSSSyntax(file: GeneratedFile): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = file.content;
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for missing semicolons
      if (
        line.includes(":") &&
        !line.includes(";") &&
        !line.includes("{") &&
        !line.includes("}") &&
        line.trim() !== ""
      ) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Missing semicolon in CSS property",
          severity: "warning",
          autoFixable: true,
          suggestedFix: "Add semicolon at end of CSS property",
        });
      }

      // Check for unclosed brackets
      const openBrackets = (line.match(/\{/g) || []).length;
      const closeBrackets = (line.match(/\}/g) || []).length;
      if (openBrackets > closeBrackets) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Unclosed CSS bracket",
          severity: "error",
          autoFixable: true,
          suggestedFix: "Close CSS brackets properly",
        });
      }
    });

    return errors;
  }

  /**
   * Validate HTML syntax
   */
  private validateHTMLSyntax(file: GeneratedFile): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = file.content;
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for missing quotes in attributes
      const unquotedAttributeRegex = /\s+\w+=[^"'{\s][^>\s]*/g;
      if (unquotedAttributeRegex.test(line)) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Unquoted HTML attribute value",
          severity: "error",
          autoFixable: true,
          suggestedFix: "Add quotes around attribute values",
        });
      }

      // Check for missing whitespace between attributes
      const missingWhitespaceRegex = /\w+="[^"]*"[a-zA-Z]/g;
      if (missingWhitespaceRegex.test(line)) {
        errors.push({
          type: "syntax",
          file: file.path,
          line: lineNumber,
          message: "Missing whitespace between HTML attributes",
          severity: "error",
          autoFixable: true,
          suggestedFix: "Add space between attributes",
        });
      }
    });

    return errors;
  }

  /**
   * Validate TypeScript syntax
   */
  private validateTypeScriptSyntax(file: GeneratedFile): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = file.content;

    // Check for missing type annotations in interfaces
    if (content.includes("interface") && content.includes(": any")) {
      errors.push({
        type: "syntax",
        file: file.path,
        message: "Using any type - consider specific type annotations",
        severity: "warning",
        autoFixable: false,
        suggestedFix: "Replace any with specific types",
      });
    }

    return errors;
  }

  /**
   * Validate dependencies in package.json
   */
  private async validateDependencies(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const packageJsonFile = files.find((f) => f.path === "package.json");
    if (!packageJsonFile) {
      errors.push({
        type: "dependency",
        file: "package.json",
        message: "Missing package.json file",
        severity: "error",
        autoFixable: true,
      });
      return { errors, warnings };
    }

    try {
      const packageJson = JSON.parse(packageJsonFile.content);
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      // Check required dependencies
      for (const [dep, version] of Object.entries(this.requiredDependencies)) {
        if (!dependencies[dep]) {
          errors.push({
            type: "dependency",
            file: "package.json",
            message: `Missing required dependency: ${dep}`,
            severity: "error",
            autoFixable: true,
            suggestedFix: `Add "${dep}": "${version}" to dependencies`,
          });
        }
      }

      // Check feature-specific dependencies
      for (const feature of config.selectedFeatures) {
        const featureDeps = this.featureDependencies[feature];
        if (featureDeps) {
          for (const dep of featureDeps) {
            if (!dependencies[dep] && !devDependencies[dep]) {
              errors.push({
                type: "dependency",
                file: "package.json",
                message: `Missing dependency for feature ${feature}: ${dep}`,
                severity: "error",
                autoFixable: true,
                suggestedFix: `Add "${dep}": "latest" to dependencies`,
              });
            }
          }
        }
      }

      // Check dev dependencies
      if (config.typescript) {
        for (const [dep, version] of Object.entries(this.devDependencies)) {
          if (!devDependencies[dep] && !dependencies[dep]) {
            errors.push({
              type: "dependency",
              file: "package.json",
              message: `Missing dev dependency: ${dep}`,
              severity: "error",
              autoFixable: true,
              suggestedFix: `Add "${dep}": "${version}" to devDependencies`,
            });
          }
        }
      }
    } catch (error) {
      errors.push({
        type: "dependency",
        file: "package.json",
        message: `Invalid package.json: ${error instanceof Error ? error.message : "Unknown error"}`,
        severity: "error",
        autoFixable: true,
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate imports and exports
   */
  private async validateImportsExports(files: GeneratedFile[]): Promise<{
    errors: ValidationError[];
    warnings: ValidationWarning[];
  }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const fileMap = new Map<string, GeneratedFile>();
    files.forEach((file) => {
      fileMap.set(file.path, file);
    });

    for (const file of files) {
      if (file.type === "tsx" || file.type === "jsx" || file.type === "ts") {
        const content = file.content;
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          const lineNumber = index + 1;

          // Check for CSS imports
          const cssImportMatch = line.match(/import\s+['"]([^'"]+\.css)['"]/);
          if (cssImportMatch) {
            const cssPath = cssImportMatch[1];
            let resolvedPath = cssPath;

            // Handle relative imports
            if (cssPath.startsWith("./")) {
              const basePath = file.path.split("/").slice(0, -1).join("/");
              resolvedPath = basePath + "/" + cssPath.substring(2);
            }

            if (!fileMap.has(resolvedPath)) {
              errors.push({
                type: "import",
                file: file.path,
                line: lineNumber,
                message: `Missing CSS file: ${cssPath}`,
                severity: "error",
                autoFixable: true,
                suggestedFix: `Create missing CSS file: ${resolvedPath}`,
              });
            }
          }

          // Check for component imports
          const componentImportMatch = line.match(
            /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/,
          );
          if (componentImportMatch) {
            const importPath = componentImportMatch[2];

            if (importPath.startsWith("./") || importPath.startsWith("../")) {
              let resolvedPath = importPath;

              // Handle relative imports
              if (importPath.startsWith("./")) {
                const basePath = file.path.split("/").slice(0, -1).join("/");
                resolvedPath = basePath + "/" + importPath.substring(2);
              }

              // Add common extensions
              const possiblePaths = [
                resolvedPath,
                resolvedPath + ".tsx",
                resolvedPath + ".jsx",
                resolvedPath + ".ts",
                resolvedPath + ".js",
              ];

              const exists = possiblePaths.some((path) => fileMap.has(path));
              if (!exists) {
                errors.push({
                  type: "import",
                  file: file.path,
                  line: lineNumber,
                  message: `Missing component file: ${importPath}`,
                  severity: "error",
                  autoFixable: true,
                  suggestedFix: `Create missing component file: ${resolvedPath}`,
                });
              }
            }
          }
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Auto-fix common errors
   */
  private async autoFixErrors(
    files: GeneratedFile[],
    errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<{
    fixedFiles: GeneratedFile[];
    remainingErrors: ValidationError[];
  }> {
    const fixedFiles = [...files];
    const remainingErrors: ValidationError[] = [];

    for (const error of errors) {
      if (!error.autoFixable) {
        remainingErrors.push(error);
        continue;
      }

      try {
        const fixed = await this.applyAutoFix(fixedFiles, error, config);
        if (!fixed) {
          remainingErrors.push(error);
        }
      } catch (fixError) {
        console.warn(`Failed to auto-fix error: ${error.message}`, fixError);
        remainingErrors.push(error);
      }
    }

    return { fixedFiles, remainingErrors };
  }

  /**
   * Apply a specific auto-fix
   */
  private async applyAutoFix(
    files: GeneratedFile[],
    error: ValidationError,
    config: ProjectConfig,
  ): Promise<boolean> {
    const file = files.find((f) => f.path === error.file);
    if (!file) {
      // Handle missing files
      if (
        error.message.includes("Missing required file") ||
        error.message.includes("Missing CSS file")
      ) {
        return this.createMissingFile(files, error, config);
      }
      return false;
    }

    switch (error.type) {
      case "syntax":
        return this.fixSyntaxError(file, error);
      case "dependency":
        return this.fixDependencyError(files, error, config);
      case "import":
        return this.fixImportError(files, error, config);
      default:
        return false;
    }
  }

  /**
   * Fix syntax errors
   */
  private fixSyntaxError(file: GeneratedFile, error: ValidationError): boolean {
    let content = file.content;
    let fixed = false;

    // Fix missing React import
    if (error.message.includes("Missing React import")) {
      content = "import React from 'react';\n" + content;
      fixed = true;
    }

    // Fix missing quotes in attributes
    if (error.message.includes("Unquoted attribute value")) {
      content = content.replace(/(\w+)=([^"'{\s][^>\s]*)/g, '$1="$2"');
      fixed = true;
    }

    // Fix missing whitespace between attributes
    if (error.message.includes("Missing whitespace between attributes")) {
      content = content.replace(/(\w+="[^"]*")([a-zA-Z])/g, "$1 $2");
      fixed = true;
    }

    // Fix missing semicolons in CSS
    if (error.message.includes("Missing semicolon in CSS property")) {
      content = content.replace(/([^;{}]+:[^;{}]+)(\s*\n)/g, "$1;$2");
      fixed = true;
    }

    if (fixed) {
      file.content = content;
      return true;
    }

    return false;
  }

  /**
   * Fix dependency errors
   */
  private fixDependencyError(
    files: GeneratedFile[],
    error: ValidationError,
    _config: ProjectConfig,
  ): boolean {
    const packageJsonFile = files.find((f) => f.path === "package.json");
    if (!packageJsonFile) return false;

    try {
      const packageJson = JSON.parse(packageJsonFile.content);

      if (error.message.includes("Missing required dependency")) {
        const depMatch = error.message.match(
          /Missing required dependency: (\w+)/,
        );
        if (depMatch) {
          const dep = depMatch[1];
          if (!packageJson.dependencies) packageJson.dependencies = {};
          packageJson.dependencies[dep] =
            this.requiredDependencies[
              dep as keyof typeof this.requiredDependencies
            ] || "latest";
          packageJsonFile.content = JSON.stringify(packageJson, null, 2);
          return true;
        }
      }

      if (error.message.includes("Missing dependency for feature")) {
        const featureMatch = error.message.match(
          /Missing dependency for feature (\w+): (\S+)/,
        );
        if (featureMatch) {
          const [, _feature, dep] = featureMatch;
          if (!packageJson.dependencies) packageJson.dependencies = {};
          packageJson.dependencies[dep] = "latest";
          packageJsonFile.content = JSON.stringify(packageJson, null, 2);
          return true;
        }
      }

      if (error.message.includes("Missing dev dependency")) {
        const depMatch = error.message.match(/Missing dev dependency: (\S+)/);
        if (depMatch) {
          const dep = depMatch[1];
          if (!packageJson.devDependencies) packageJson.devDependencies = {};
          packageJson.devDependencies[dep] =
            this.devDependencies[dep as keyof typeof this.devDependencies] ||
            "latest";
          packageJsonFile.content = JSON.stringify(packageJson, null, 2);
          return true;
        }
      }
    } catch (error) {
      console.error("Error fixing dependency:", error);
      return false;
    }

    return false;
  }

  /**
   * Fix import errors by creating missing files
   */
  private fixImportError(
    files: GeneratedFile[],
    error: ValidationError,
    config: ProjectConfig,
  ): boolean {
    if (error.message.includes("Missing CSS file")) {
      const cssMatch = error.message.match(/Missing CSS file: (.+)/);
      if (cssMatch) {
        const cssPath = cssMatch[1];
        return this.createMissingCSSFile(files, cssPath, config);
      }
    }

    if (error.message.includes("Missing component file")) {
      const componentMatch = error.message.match(
        /Missing component file: (.+)/,
      );
      if (componentMatch) {
        const componentPath = componentMatch[1];
        return this.createMissingComponentFile(files, componentPath, config);
      }
    }

    return false;
  }

  /**
   * Create missing files
   */
  private createMissingFile(
    files: GeneratedFile[],
    error: ValidationError,
    config: ProjectConfig,
  ): boolean {
    if (error.message.includes("Missing required file: package.json")) {
      return this.createPackageJson(files, config);
    }

    if (error.message.includes("Missing required file: src/main.tsx")) {
      return this.createMainFile(files, config);
    }

    if (error.message.includes("Missing required file: src/App.tsx")) {
      return this.createAppFile(files, config);
    }

    if (error.message.includes("Missing required file: index.html")) {
      return this.createIndexHtml(files, config);
    }

    return false;
  }

  /**
   * Create missing CSS file
   */
  private createMissingCSSFile(
    files: GeneratedFile[],
    cssPath: string,
    _config: ProjectConfig,
  ): boolean {
    const basicCSS = `/* ${cssPath} */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section {
  padding: 2rem 0;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  background: #2c5282;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }

  .section {
    padding: 1rem 0;
  }
}
`;

    files.push({
      path: cssPath,
      content: basicCSS,
      type: "css",
    });

    return true;
  }

  /**
   * Create missing component file
   */
  private createMissingComponentFile(
    files: GeneratedFile[],
    componentPath: string,
    config: ProjectConfig,
  ): boolean {
    const componentName =
      componentPath
        .split("/")
        .pop()
        ?.replace(/\.(tsx|jsx|ts|js)$/, "") || "Component";

    const componentContent = `import React from 'react';
import './${componentName}.css';

interface ${componentName}Props {
  // Add props here
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${componentName}</h2>
      <p>This component was auto-generated.</p>
    </div>
  );
};

export default ${componentName};
`;

    files.push({
      path: componentPath + ".tsx",
      content: componentContent,
      type: "tsx",
    });

    // Also create the CSS file
    this.createMissingCSSFile(files, `${componentPath}.css`, config);

    return true;
  }

  /**
   * Create missing package.json
   */
  private createPackageJson(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): boolean {
    const packageJson = {
      name: config.projectName.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      description: "An AI-powered PWA application",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      },
      dependencies: {
        ...this.requiredDependencies,
      },
      devDependencies: {
        ...this.devDependencies,
      },
    };

    files.push({
      path: "package.json",
      content: JSON.stringify(packageJson, null, 2),
      type: "json",
    });

    return true;
  }

  /**
   * Create missing main file
   */
  private createMainFile(
    files: GeneratedFile[],
    _config: ProjectConfig,
  ): boolean {
    const mainContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    files.push({
      path: "src/main.tsx",
      content: mainContent,
      type: "tsx",
    });

    return true;
  }

  /**
   * Create missing App file
   */
  private createAppFile(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): boolean {
    const appContent = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to ${config.businessName}</h1>
          <p>Your PWA is ready!</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div className="home-page">
                <h2>Home Page</h2>
                <p>This is your home page.</p>
              </div>
            } />
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;`;

    files.push({
      path: "src/App.tsx",
      content: appContent,
      type: "tsx",
    });

    return true;
  }

  /**
   * Create missing index.html
   */
  private createIndexHtml(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): boolean {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.businessName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    files.push({
      path: "index.html",
      content: htmlContent,
      type: "html",
    });

    return true;
  }

  /**
   * Check feature compatibility
   */
  private checkFeatureCompatibility(features: string[]): string[] {
    const issues: string[] = [];

    // Check for conflicting features
    const conflictingPairs = [
      ["auth", "guest-only"],
      ["payments", "free-only"],
      ["analytics", "privacy-focused"],
    ];

    for (const [feature1, feature2] of conflictingPairs) {
      if (features.includes(feature1) && features.includes(feature2)) {
        issues.push(`Features ${feature1} and ${feature2} may conflict`);
      }
    }

    // Check for missing dependencies
    if (features.includes("payments") && !features.includes("auth")) {
      issues.push("Payments feature typically requires authentication");
    }

    if (features.includes("booking") && !features.includes("auth")) {
      issues.push("Booking feature typically requires authentication");
    }

    return issues;
  }

  /**
   * Validate project structure
   */
  private validateProjectStructure(files: GeneratedFile[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for proper component organization
    const componentFiles = files.filter(
      (f) => f.path.includes("components/") && f.type === "tsx",
    );
    const componentCSSFiles = files.filter(
      (f) => f.path.includes("components/") && f.type === "css",
    );

    // Each component should have corresponding CSS
    for (const componentFile of componentFiles) {
      const expectedCSSPath = componentFile.path.replace(".tsx", ".css");

      if (!componentCSSFiles.find((f) => f.path === expectedCSSPath)) {
        errors.push({
          type: "import",
          file: componentFile.path,
          message: `Missing CSS file for component: ${expectedCSSPath}`,
          severity: "warning",
          autoFixable: true,
          suggestedFix: `Create ${expectedCSSPath}`,
        });
      }
    }

    // Check for proper page organization
    const pageFiles = files.filter(
      (f) => f.path.includes("pages/") && f.type === "tsx",
    );
    if (pageFiles.length > 0) {
      const pageCSSFiles = files.filter(
        (f) => f.path.includes("pages/") && f.type === "css",
      );

      for (const pageFile of pageFiles) {
        const expectedCSSPath = pageFile.path.replace(".tsx", ".css");
        if (!pageCSSFiles.find((f) => f.path === expectedCSSPath)) {
          errors.push({
            type: "import",
            file: pageFile.path,
            message: `Missing CSS file for page: ${expectedCSSPath}`,
            severity: "warning",
            autoFixable: true,
            suggestedFix: `Create ${expectedCSSPath}`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Test build process (simulated)
   */
  private async testBuildProcess(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): Promise<BuildTestResult> {
    console.log("🏗️ Simulating build process...");

    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Simulate npm install
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check package.json validity
      const packageJsonFile = files.find((f) => f.path === "package.json");
      if (!packageJsonFile) {
        errors.push("Missing package.json");
        return {
          installSuccess: false,
          buildSuccess: false,
          devServerSuccess: false,
          errors,
          warnings,
          timeTaken: Date.now() - startTime,
        };
      }

      let packageJson;
      try {
        packageJson = JSON.parse(packageJsonFile.content);
      } catch (e) {
        errors.push("Invalid package.json format");
        return {
          installSuccess: false,
          buildSuccess: false,
          devServerSuccess: false,
          errors,
          warnings,
          timeTaken: Date.now() - startTime,
        };
      }

      // Check for required scripts
      if (!packageJson.scripts?.build) {
        errors.push("Missing build script in package.json");
      }

      if (!packageJson.scripts?.dev) {
        warnings.push("Missing dev script in package.json");
      }

      // Simulate TypeScript compilation
      if (config.typescript) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const tsFiles = files.filter(
          (f) => f.type === "tsx" || f.type === "ts",
        );
        for (const tsFile of tsFiles) {
          // Basic TypeScript syntax check
          if (
            tsFile.content.includes("any") &&
            tsFile.content.includes("interface")
          ) {
            warnings.push(
              `TypeScript: Consider replacing 'any' types in ${tsFile.path}`,
            );
          }
        }
      }

      // Simulate Vite build
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check for common build issues
      const mainFile = files.find((f) => f.path === "src/main.tsx");
      if (!mainFile) {
        errors.push("Missing main entry point");
      }

      const appFile = files.find((f) => f.path === "src/App.tsx");
      if (!appFile) {
        errors.push("Missing App component");
      }

      const indexHtml = files.find((f) => f.path === "index.html");
      if (!indexHtml) {
        errors.push("Missing index.html");
      }

      // Check for import issues
      const importErrors = this.checkBuildImports(files);
      errors.push(...importErrors);

      const timeTaken = Date.now() - startTime;
      const buildSuccess = errors.length === 0;
      const installSuccess = !errors.some((e) => e.includes("package.json"));
      const devServerSuccess =
        buildSuccess && !errors.some((e) => e.includes("dev"));

      return {
        installSuccess,
        buildSuccess,
        devServerSuccess,
        errors,
        warnings,
        timeTaken,
      };
    } catch (error) {
      errors.push(
        `Build simulation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );

      return {
        installSuccess: false,
        buildSuccess: false,
        devServerSuccess: false,
        errors,
        warnings,
        timeTaken: Date.now() - startTime,
      };
    }
  }

  /**
   * Check for import issues that would cause build failures
   */
  private checkBuildImports(files: GeneratedFile[]): string[] {
    const errors: string[] = [];
    const fileMap = new Map<string, GeneratedFile>();

    files.forEach((file) => {
      fileMap.set(file.path, file);
    });

    for (const file of files) {
      if (file.type === "tsx" || file.type === "jsx" || file.type === "ts") {
        const content = file.content;
        const lines = content.split("\n");

        lines.forEach((line, _index) => {
          // Check for missing React import in JSX files
          if (file.type === "tsx" || file.type === "jsx") {
            if (
              line.includes("<") &&
              line.includes(">") &&
              !content.includes("import React")
            ) {
              errors.push(`Missing React import in ${file.path}`);
            }
          }

          // Check for relative imports
          const relativeImportMatch = line.match(
            /import.*from\s+['"](\.[^'"]+)['"]/,
          );
          if (relativeImportMatch) {
            const importPath = relativeImportMatch[1];
            let resolvedPath = importPath;

            // Handle relative paths
            if (importPath.startsWith("./")) {
              const basePath = file.path.split("/").slice(0, -1).join("/");
              resolvedPath = basePath + "/" + importPath.substring(2);
            } else if (importPath.startsWith("../")) {
              const pathParts = file.path.split("/");
              const basePath = pathParts.slice(0, -1).join("/");
              resolvedPath = basePath + "/" + importPath;
            }

            // Check if file exists (with common extensions)
            const possiblePaths = [
              resolvedPath,
              resolvedPath + ".tsx",
              resolvedPath + ".jsx",
              resolvedPath + ".ts",
              resolvedPath + ".js",
              resolvedPath + ".css",
            ];

            const exists = possiblePaths.some((path) => fileMap.has(path));
            if (!exists) {
              errors.push(`Unresolved import: ${importPath} in ${file.path}`);
            }
          }
        });
      }
    }

    return errors;
  }

  /**
   * Get validation summary
   */
  getValidationSummary(result: ValidationResult): string {
    const { isValid, errors, warnings, suggestions } = result;

    let summary = `📊 Validation Summary:\n`;
    summary += `Status: ${isValid ? "✅ VALID" : "❌ INVALID"}\n`;
    summary += `Errors: ${errors.length}\n`;
    summary += `Warnings: ${warnings.length}\n`;
    summary += `Suggestions: ${suggestions.length}\n\n`;

    if (errors.length > 0) {
      summary += `🚨 Critical Issues:\n`;
      errors.forEach((error) => {
        summary += `- ${error.file}: ${error.message}\n`;
      });
      summary += `\n`;
    }

    if (warnings.length > 0) {
      summary += `⚠️ Warnings:\n`;
      warnings.slice(0, 5).forEach((warning) => {
        summary += `- ${warning.file}: ${warning.message}\n`;
      });
      if (warnings.length > 5) {
        summary += `... and ${warnings.length - 5} more warnings\n`;
      }
      summary += `\n`;
    }

    if (suggestions.length > 0) {
      summary += `💡 Suggestions:\n`;
      suggestions.forEach((suggestion) => {
        summary += `- ${suggestion}\n`;
      });
    }

    return summary;
  }

  /**
   * Use AI to analyze complex validation issues
   */
  async analyzeWithAI(
    _files: GeneratedFile[],
    errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<string[]> {
    if (!aiService.hasApiKey() || errors.length === 0) {
      return [];
    }

    try {
      const response = await aiService.analyzeBusinessNeeds({
        businessName: config.businessName,
        industry: config.industry,
        description: "Fix validation errors",
        targetAudience: "developers",
      });

      return response.recommendations?.framework
        ? [response.recommendations.framework]
        : [];
    } catch (error) {
      console.error("AI analysis failed:", error);
      return [];
    }
  }
}

// Export singleton instance
export const projectValidator = new ProjectValidator();
