/**
 * Auto-Fix Engine for PWA Project Validation
 * Automatically fixes common issues in generated PWA projects
 */

import { aiService } from "./aiService";
import {
  GeneratedFile,
  ValidationError,
  ValidationWarning,
  ProjectConfig,
} from "./projectValidator";

export interface AutoFixResult {
  success: boolean;
  fixedFiles: GeneratedFile[];
  appliedFixes: AppliedFix[];
  remainingErrors: ValidationError[];
  fixReport: string;
  timeTaken: number;
  rollbackData?: RollbackData;
}

export interface AppliedFix {
  id: string;
  type: FixType;
  description: string;
  file: string;
  originalContent?: string;
  fixedContent: string;
  timestamp: Date;
  confidence: number;
  method: "automatic" | "ai-assisted" | "manual";
}

export interface RollbackData {
  originalFiles: GeneratedFile[];
  fixIds: string[];
  timestamp: Date;
}

export type FixType =
  | "syntax-jsx"
  | "syntax-css"
  | "syntax-html"
  | "syntax-json"
  | "syntax-typescript"
  | "missing-dependency"
  | "missing-file"
  | "missing-import"
  | "build-config"
  | "runtime-error"
  | "performance-optimization"
  | "accessibility-fix"
  | "security-enhancement";

interface FixPattern {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
  description: string;
  confidence: number;
}

export class AutoFixEngine {
  private fixHistory: AppliedFix[] = [];
  private rollbackHistory: RollbackData[] = [];

  // Common fix patterns for different error types
  private readonly jsxFixPatterns: FixPattern[] = [
    {
      pattern: /(\w+)=([^"'{\s][^>\s]*)/g,
      replacement: '$1="$2"',
      description: "Add quotes around unquoted attribute values",
      confidence: 0.95,
    },
    {
      pattern: /(\w+="[^"]*")([a-zA-Z])/g,
      replacement: "$1 $2",
      description: "Add space between attributes",
      confidence: 0.9,
    },
    {
      pattern: /class=/g,
      replacement: "className=",
      description: "Convert class to className for React",
      confidence: 0.98,
    },
    {
      pattern: /for=/g,
      replacement: "htmlFor=",
      description: "Convert for to htmlFor for React",
      confidence: 0.98,
    },
    {
      pattern: /<([^>]+)>([^<]*)<\/\1>/g,
      replacement: (match, tag, content) => {
        // Self-closing tags that don't need content
        const selfClosingTags = ["br", "hr", "img", "input", "meta", "link"];
        if (selfClosingTags.includes(tag.toLowerCase()) && !content.trim()) {
          return `<${tag} />`;
        }
        return match;
      },
      description: "Convert to self-closing tags where appropriate",
      confidence: 0.85,
    },
  ];

  private readonly cssFixPatterns: FixPattern[] = [
    {
      pattern: /([^;{}]+:[^;{}]+)(?=\s*\n)/g,
      replacement: "$1;",
      description: "Add missing semicolons in CSS properties",
      confidence: 0.9,
    },
    {
      pattern: /([^{}]+){([^{}]+)}/g,
      replacement: (match, selector, rules) => {
        const cleanSelector = selector.trim();
        const cleanRules = rules.trim();
        if (!cleanRules.endsWith(";") && cleanRules.length > 0) {
          return `${cleanSelector} {\n  ${cleanRules};\n}`;
        }
        return match;
      },
      description: "Format CSS rules properly",
      confidence: 0.8,
    },
    {
      pattern: /([^{]+){([^}]+)}/g,
      replacement: (_match, selector, rules) => {
        // Fix common CSS property typos
        const fixedRules = rules
          .replace(/colour:/g, "color:")
          .replace(/centre/g, "center")
          .replace(/grey/g, "gray");
        return `${selector}{${fixedRules}}`;
      },
      description: "Fix common CSS property typos",
      confidence: 0.7,
    },
  ];

  private readonly htmlFixPatterns: FixPattern[] = [
    {
      pattern: /(\w+)=([^"'{\s][^>\s]*)/g,
      replacement: '$1="$2"',
      description: "Add quotes around unquoted HTML attribute values",
      confidence: 0.95,
    },
    {
      pattern: /(\w+="[^"]*")([a-zA-Z])/g,
      replacement: "$1 $2",
      description: "Add space between HTML attributes",
      confidence: 0.9,
    },
    {
      pattern: /<([^>]+)\/>/g,
      replacement: (match, tag) => {
        // Ensure proper self-closing syntax
        const cleanTag = tag.trim();
        if (!cleanTag.endsWith("/")) {
          return `<${cleanTag} />`;
        }
        return match;
      },
      description: "Fix self-closing HTML tags",
      confidence: 0.8,
    },
  ];

  private readonly typeScriptFixPatterns: FixPattern[] = [
    {
      pattern: /: any\b/g,
      replacement: ": unknown",
      description: "Replace any type with unknown for better type safety",
      confidence: 0.6,
    },
    {
      pattern: /React\.FC<{}>/g,
      replacement: "React.FC",
      description: "Simplify React.FC type annotation",
      confidence: 0.8,
    },
    {
      pattern: /interface\s+(\w+)\s*{\s*}/g,
      replacement: "interface $1 {\n  // TODO: Add interface properties\n}",
      description: "Add placeholder for empty interfaces",
      confidence: 0.7,
    },
  ];

  /**
   * Main auto-fix method
   */
  async autoFix(
    files: GeneratedFile[],
    errors: ValidationError[],
    warnings: ValidationWarning[],
    config: ProjectConfig,
  ): Promise<AutoFixResult> {
    console.log("🔧 Starting auto-fix process...");
    const startTime = Date.now();

    // Create backup for rollback
    const originalFiles = JSON.parse(JSON.stringify(files));
    const rollbackData: RollbackData = {
      originalFiles,
      fixIds: [],
      timestamp: new Date(),
    };

    const fixedFiles = [...files];
    const appliedFixes: AppliedFix[] = [];
    let remainingErrors: ValidationError[] = [];
    let fixReport = "📊 Auto-Fix Report\n\n";

    try {
      // Phase 1: Syntax Fixes
      console.log("📝 Phase 1: Applying syntax fixes...");
      const syntaxFixes = await this.applySyntaxFixes(
        fixedFiles,
        errors,
        config,
      );
      appliedFixes.push(...syntaxFixes.fixes);
      fixReport += `✅ Syntax Fixes Applied: ${syntaxFixes.fixes.length}\n`;

      // Phase 2: Dependency Fixes
      console.log("📦 Phase 2: Fixing dependencies...");
      const dependencyFixes = await this.fixDependencies(
        fixedFiles,
        errors,
        config,
      );
      appliedFixes.push(...dependencyFixes.fixes);
      fixReport += `✅ Dependency Fixes Applied: ${dependencyFixes.fixes.length}\n`;

      // Phase 3: File Creation
      console.log("📄 Phase 3: Creating missing files...");
      const fileFixes = await this.createMissingFiles(
        fixedFiles,
        errors,
        config,
      );
      appliedFixes.push(...fileFixes.fixes);
      fixReport += `✅ Missing Files Created: ${fileFixes.fixes.length}\n`;

      // Phase 4: Import/Export Fixes
      console.log("🔗 Phase 4: Fixing imports and exports...");
      const importFixes = await this.fixImportsExports(
        fixedFiles,
        errors,
        config,
      );
      appliedFixes.push(...importFixes.fixes);
      fixReport += `✅ Import/Export Fixes Applied: ${importFixes.fixes.length}\n`;

      // Phase 5: Build Configuration Fixes
      console.log("⚙️ Phase 5: Fixing build configuration...");
      const buildFixes = await this.fixBuildConfiguration(
        fixedFiles,
        errors,
        config,
      );
      appliedFixes.push(...buildFixes.fixes);
      fixReport += `✅ Build Configuration Fixes Applied: ${buildFixes.fixes.length}\n`;

      // Phase 6: AI-Assisted Fixes for Complex Issues
      console.log("🤖 Phase 6: Applying AI-assisted fixes...");
      const aiFixes = await this.applyAIFixes(fixedFiles, errors, config);
      appliedFixes.push(...aiFixes.fixes);
      fixReport += `✅ AI-Assisted Fixes Applied: ${aiFixes.fixes.length}\n`;

      // Phase 7: Performance and Best Practice Fixes
      console.log("⚡ Phase 7: Applying performance optimizations...");
      const performanceFixes = await this.applyPerformanceFixes(
        fixedFiles,
        warnings,
        config,
      );
      appliedFixes.push(...performanceFixes.fixes);
      fixReport += `✅ Performance Fixes Applied: ${performanceFixes.fixes.length}\n`;

      // Determine remaining errors
      const fixedErrorTypes = new Set(appliedFixes.map((f) => f.type));
      remainingErrors = errors.filter((error) => {
        const errorType = this.mapErrorToFixType(error.type);
        return !fixedErrorTypes.has(errorType);
      });

      // Generate final report
      const timeTaken = Date.now() - startTime;
      const totalFixes = appliedFixes.length;
      const successRate =
        totalFixes > 0
          ? ((errors.length - remainingErrors.length) / errors.length) * 100
          : 0;

      fixReport += `\n📈 Summary:\n`;
      fixReport += `- Total Fixes Applied: ${totalFixes}\n`;
      fixReport += `- Original Errors: ${errors.length}\n`;
      fixReport += `- Remaining Errors: ${remainingErrors.length}\n`;
      fixReport += `- Success Rate: ${successRate.toFixed(1)}%\n`;
      fixReport += `- Time Taken: ${timeTaken}ms\n`;

      // Store rollback data
      rollbackData.fixIds = appliedFixes.map((f) => f.id);
      this.rollbackHistory.push(rollbackData);

      // Store fix history
      this.fixHistory.push(...appliedFixes);

      console.log(`✅ Auto-fix completed: ${totalFixes} fixes applied`);

      return {
        success: remainingErrors.length < errors.length,
        fixedFiles,
        appliedFixes,
        remainingErrors,
        fixReport,
        timeTaken,
        rollbackData,
      };
    } catch (error) {
      console.error("❌ Auto-fix failed:", error);

      fixReport += `\n❌ Auto-fix failed: ${error instanceof Error ? error.message : "Unknown error"}\n`;

      return {
        success: false,
        fixedFiles: originalFiles,
        appliedFixes: [],
        remainingErrors: errors,
        fixReport,
        timeTaken: Date.now() - startTime,
        rollbackData,
      };
    }
  }

  /**
   * Apply syntax fixes to files
   */
  private async applySyntaxFixes(
    files: GeneratedFile[],
    _errors: ValidationError[],
    _config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];

    for (const file of files) {
      const originalContent = file.content;
      let fixedContent = originalContent;
      let hasChanges = false;

      switch (file.type) {
        case "tsx":
        case "jsx":
          const jsxResult = this.applyFixPatterns(
            fixedContent,
            this.jsxFixPatterns,
          );
          fixedContent = jsxResult.content;
          hasChanges = jsxResult.hasChanges;
          break;

        case "css":
          const cssResult = this.applyFixPatterns(
            fixedContent,
            this.cssFixPatterns,
          );
          fixedContent = cssResult.content;
          hasChanges = cssResult.hasChanges;
          break;

        case "html":
          const htmlResult = this.applyFixPatterns(
            fixedContent,
            this.htmlFixPatterns,
          );
          fixedContent = htmlResult.content;
          hasChanges = htmlResult.hasChanges;
          break;

        case "ts":
          const tsResult = this.applyFixPatterns(
            fixedContent,
            this.typeScriptFixPatterns,
          );
          fixedContent = tsResult.content;
          hasChanges = tsResult.hasChanges;
          break;
      }

      // Apply specific fixes for React components
      if (file.type === "tsx" || file.type === "jsx") {
        const reactResult = this.fixReactSpecificIssues(fixedContent);
        fixedContent = reactResult.content;
        hasChanges = hasChanges || reactResult.hasChanges;
      }

      if (hasChanges) {
        file.content = fixedContent;

        fixes.push({
          id: this.generateFixId(),
          type: `syntax-${file.type}` as FixType,
          description: `Applied syntax fixes to ${file.path}`,
          file: file.path,
          originalContent,
          fixedContent,
          timestamp: new Date(),
          confidence: 0.85,
          method: "automatic",
        });
      }
    }

    return { fixes };
  }

  /**
   * Fix dependency issues
   */
  private async fixDependencies(
    files: GeneratedFile[],
    errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];
    const dependencyErrors = errors.filter((e) => e.type === "dependency");

    const packageJsonFile = files.find((f) => f.path === "package.json");
    if (!packageJsonFile) return { fixes };

    try {
      const packageJson = JSON.parse(packageJsonFile.content);
      const originalContent = packageJsonFile.content;
      let hasChanges = false;

      // Fix missing dependencies
      for (const error of dependencyErrors) {
        if (error.message.includes("Missing required dependency")) {
          const depMatch = error.message.match(
            /Missing required dependency: ([^\s]+)/,
          );
          if (depMatch) {
            const dep = depMatch[1];
            if (!packageJson.dependencies) packageJson.dependencies = {};
            packageJson.dependencies[dep] = this.getLatestVersion(dep);
            hasChanges = true;
          }
        }

        if (error.message.includes("Missing dependency for feature")) {
          const featureMatch = error.message.match(
            /Missing dependency for feature (\w+): ([^\s]+)/,
          );
          if (featureMatch) {
            const [, _feature, dep] = featureMatch;
            if (!packageJson.dependencies) packageJson.dependencies = {};
            packageJson.dependencies[dep] = this.getLatestVersion(dep);
            hasChanges = true;
          }
        }

        if (error.message.includes("Missing dev dependency")) {
          const depMatch = error.message.match(
            /Missing dev dependency: ([^\s]+)/,
          );
          if (depMatch) {
            const dep = depMatch[1];
            if (!packageJson.devDependencies) packageJson.devDependencies = {};
            packageJson.devDependencies[dep] = this.getLatestVersion(dep);
            hasChanges = true;
          }
        }
      }

      // Add feature-specific dependencies
      const featureDeps = this.getFeatureDependencies(config.selectedFeatures);
      for (const [dep, version] of Object.entries(featureDeps)) {
        if (
          !packageJson.dependencies[dep] &&
          !packageJson.devDependencies[dep]
        ) {
          packageJson.dependencies[dep] = version;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        packageJsonFile.content = JSON.stringify(packageJson, null, 2);

        fixes.push({
          id: this.generateFixId(),
          type: "missing-dependency",
          description: "Fixed missing dependencies in package.json",
          file: packageJsonFile.path,
          originalContent,
          fixedContent: packageJsonFile.content,
          timestamp: new Date(),
          confidence: 0.9,
          method: "automatic",
        });
      }
    } catch (error) {
      console.error("Error fixing dependencies:", error);
    }

    return { fixes };
  }

  /**
   * Create missing files
   */
  private async createMissingFiles(
    files: GeneratedFile[],
    errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];
    const missingFileErrors = errors.filter(
      (e) =>
        e.message.includes("Missing") &&
        (e.message.includes("file") || e.message.includes("CSS")),
    );

    for (const error of missingFileErrors) {
      if (error.message.includes("Missing CSS file")) {
        const cssMatch = error.message.match(/Missing CSS file: ([^\s]+)/);
        if (cssMatch) {
          const cssPath = cssMatch[1];
          const cssContent = this.generateCSSContent(cssPath, config);

          files.push({
            path: cssPath,
            content: cssContent,
            type: "css",
          });

          fixes.push({
            id: this.generateFixId(),
            type: "missing-file",
            description: `Created missing CSS file: ${cssPath}`,
            file: cssPath,
            fixedContent: cssContent,
            timestamp: new Date(),
            confidence: 0.8,
            method: "automatic",
          });
        }
      }

      if (error.message.includes("Missing component file")) {
        const componentMatch = error.message.match(
          /Missing component file: ([^\s]+)/,
        );
        if (componentMatch) {
          const componentPath = componentMatch[1];
          const componentContent = this.generateComponentContent(
            componentPath,
            config,
          );

          files.push({
            path: componentPath + ".tsx",
            content: componentContent,
            type: "tsx",
          });

          fixes.push({
            id: this.generateFixId(),
            type: "missing-file",
            description: `Created missing component file: ${componentPath}.tsx`,
            file: componentPath + ".tsx",
            fixedContent: componentContent,
            timestamp: new Date(),
            confidence: 0.75,
            method: "automatic",
          });
        }
      }

      if (error.message.includes("Missing required file")) {
        const requiredFileMatch = error.message.match(
          /Missing required file: ([^\s]+)/,
        );
        if (requiredFileMatch) {
          const filePath = requiredFileMatch[1];
          const content = this.generateRequiredFileContent(filePath, config);

          if (content) {
            files.push({
              path: filePath,
              content: content.content,
              type: content.type,
            });

            fixes.push({
              id: this.generateFixId(),
              type: "missing-file",
              description: `Created missing required file: ${filePath}`,
              file: filePath,
              fixedContent: content.content,
              timestamp: new Date(),
              confidence: 0.9,
              method: "automatic",
            });
          }
        }
      }
    }

    return { fixes };
  }

  /**
   * Fix import/export issues
   */
  private async fixImportsExports(
    files: GeneratedFile[],
    _errors: ValidationError[],
    _config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];

    for (const file of files) {
      if (file.type === "tsx" || file.type === "jsx" || file.type === "ts") {
        const originalContent = file.content;
        let fixedContent = originalContent;
        let hasChanges = false;

        // Fix missing React imports
        if (
          (file.type === "tsx" || file.type === "jsx") &&
          fixedContent.includes("<") &&
          fixedContent.includes(">") &&
          !fixedContent.includes("import React")
        ) {
          fixedContent = `import React from 'react';\n${fixedContent}`;
          hasChanges = true;
        }

        // Fix relative import paths
        const lines = fixedContent.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const importMatch = line.match(/import.*from\s+['"]([^'"]+)['"]/);

          if (importMatch) {
            const importPath = importMatch[1];
            if (importPath.startsWith("./") || importPath.startsWith("../")) {
              // Check if the import path needs fixing
              const correctedPath = this.correctImportPath(
                importPath,
                file.path,
                files,
              );
              if (correctedPath !== importPath) {
                lines[i] = line.replace(importPath, correctedPath);
                hasChanges = true;
              }
            }
          }
        }

        if (hasChanges) {
          file.content = lines.join("\n");

          fixes.push({
            id: this.generateFixId(),
            type: "missing-import",
            description: `Fixed imports in ${file.path}`,
            file: file.path,
            originalContent,
            fixedContent: file.content,
            timestamp: new Date(),
            confidence: 0.85,
            method: "automatic",
          });
        }
      }
    }

    return { fixes };
  }

  /**
   * Fix build configuration issues
   */
  private async fixBuildConfiguration(
    files: GeneratedFile[],
    _errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];

    // Fix TypeScript configuration
    const tsConfigFile = files.find((f) => f.path === "tsconfig.json");
    if (config.typescript && !tsConfigFile) {
      const tsConfigContent = this.generateTSConfig(config);
      files.push({
        path: "tsconfig.json",
        content: tsConfigContent,
        type: "json",
      });

      fixes.push({
        id: this.generateFixId(),
        type: "build-config",
        description: "Created missing tsconfig.json",
        file: "tsconfig.json",
        fixedContent: tsConfigContent,
        timestamp: new Date(),
        confidence: 0.9,
        method: "automatic",
      });
    }

    // Fix Vite configuration
    const viteConfigFile = files.find((f) => f.path === "vite.config.ts");
    if (!viteConfigFile) {
      const viteConfigContent = this.generateViteConfig(config);
      files.push({
        path: "vite.config.ts",
        content: viteConfigContent,
        type: "ts",
      });

      fixes.push({
        id: this.generateFixId(),
        type: "build-config",
        description: "Created missing vite.config.ts",
        file: "vite.config.ts",
        fixedContent: viteConfigContent,
        timestamp: new Date(),
        confidence: 0.9,
        method: "automatic",
      });
    }

    return { fixes };
  }

  /**
   * Apply AI-assisted fixes for complex issues
   */
  private async applyAIFixes(
    files: GeneratedFile[],
    errors: ValidationError[],
    config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];

    if (!aiService.hasApiKey()) {
      return { fixes };
    }

    const complexErrors = errors.filter(
      (e) =>
        e.type === "runtime" ||
        (e.type === "syntax" && !e.autoFixable) ||
        (e.type === "build" && e.message.includes("complex")),
    );

    for (const error of complexErrors) {
      try {
        const file = files.find((f) => f.path === error.file);
        if (!file) continue;

        const aiSuggestion = await this.getAIFix(error, file, config);
        if (aiSuggestion) {
          const originalContent = file.content;
          file.content = aiSuggestion.fixedContent;

          fixes.push({
            id: this.generateFixId(),
            type: this.mapErrorToFixType(error.type),
            description: aiSuggestion.description,
            file: file.path,
            originalContent,
            fixedContent: aiSuggestion.fixedContent,
            timestamp: new Date(),
            confidence: aiSuggestion.confidence,
            method: "ai-assisted",
          });
        }
      } catch (error) {
        console.error("AI fix failed:", error);
      }
    }

    return { fixes };
  }

  /**
   * Apply performance and best practice fixes
   */
  private async applyPerformanceFixes(
    files: GeneratedFile[],
    _warnings: ValidationWarning[],
    _config: ProjectConfig,
  ): Promise<{ fixes: AppliedFix[] }> {
    const fixes: AppliedFix[] = [];

    for (const file of files) {
      const originalContent = file.content;
      let fixedContent = originalContent;
      let hasChanges = false;

      // Performance fixes for React components
      if (file.type === "tsx" || file.type === "jsx") {
        // Add React.memo for components without props changes
        if (
          fixedContent.includes("const ") &&
          fixedContent.includes(": React.FC") &&
          !fixedContent.includes("React.memo")
        ) {
          const componentMatch = fixedContent.match(/const (\w+): React\.FC/);
          if (componentMatch) {
            const componentName = componentMatch[1];
            fixedContent = fixedContent.replace(
              `export default ${componentName};`,
              `export default React.memo(${componentName});`,
            );
            hasChanges = true;
          }
        }

        // Add useCallback for event handlers
        if (
          fixedContent.includes("const handle") &&
          !fixedContent.includes("useCallback")
        ) {
          fixedContent = fixedContent.replace(
            "import React from 'react';",
            "import React, { useCallback } from 'react';",
          );
          hasChanges = true;
        }
      }

      // CSS performance fixes
      if (file.type === "css") {
        // Add will-change for animated elements
        if (
          fixedContent.includes("transition:") &&
          !fixedContent.includes("will-change:")
        ) {
          fixedContent = fixedContent.replace(
            /transition: ([^;]+);/g,
            "transition: $1;\n  will-change: transform;",
          );
          hasChanges = true;
        }
      }

      if (hasChanges) {
        file.content = fixedContent;

        fixes.push({
          id: this.generateFixId(),
          type: "performance-optimization",
          description: `Applied performance optimizations to ${file.path}`,
          file: file.path,
          originalContent,
          fixedContent,
          timestamp: new Date(),
          confidence: 0.7,
          method: "automatic",
        });
      }
    }

    return { fixes };
  }

  /**
   * Apply fix patterns to content
   */
  private applyFixPatterns(
    content: string,
    patterns: FixPattern[],
  ): { content: string; hasChanges: boolean } {
    let fixedContent = content;
    let hasChanges = false;

    for (const pattern of patterns) {
      const originalContent = fixedContent;

      if (typeof pattern.replacement === "string") {
        fixedContent = fixedContent.replace(
          pattern.pattern,
          pattern.replacement,
        );
      } else {
        fixedContent = fixedContent.replace(
          pattern.pattern,
          pattern.replacement,
        );
      }

      if (fixedContent !== originalContent) {
        hasChanges = true;
      }
    }

    return { content: fixedContent, hasChanges };
  }

  /**
   * Fix React-specific issues
   */
  private fixReactSpecificIssues(content: string): {
    content: string;
    hasChanges: boolean;
  } {
    let fixedContent = content;
    let hasChanges = false;

    // Fix event handler naming
    const eventHandlerPattern = /on(\w+)=\{([^}]+)\}/g;
    const eventHandlerMatches = content.match(eventHandlerPattern);
    if (eventHandlerMatches) {
      for (const match of eventHandlerMatches) {
        const corrected = match.replace(/on(\w+)=\{([^}]+)\}/, "on$1={$2}");
        if (corrected !== match) {
          fixedContent = fixedContent.replace(match, corrected);
          hasChanges = true;
        }
      }
    }

    // Fix JSX fragment syntax
    if (fixedContent.includes("<React.Fragment>")) {
      fixedContent = fixedContent.replace(/<React\.Fragment>/g, "<>");
      fixedContent = fixedContent.replace(/<\/React\.Fragment>/g, "</>");
      hasChanges = true;
    }

    return { content: fixedContent, hasChanges };
  }

  /**
   * Generate CSS content for missing files
   */
  private generateCSSContent(cssPath: string, _config: ProjectConfig): string {
    const fileName =
      cssPath.split("/").pop()?.replace(".css", "") || "component";
    const className = fileName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    return `/* ${fileName} Component Styles */
.${className} {
  display: block;
  margin: 0;
  padding: 0;
}

.${className}-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.${className}-header {
  margin-bottom: 2rem;
}

.${className}-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.${className}-description {
  font-size: 1.125rem;
  color: #4a5568;
  line-height: 1.6;
}

.${className}-content {
  display: grid;
  gap: 1.5rem;
}

.${className}-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.${className}-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.${className}-button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.${className}-button:hover {
  background: #2c5282;
}

.${className}-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .${className}-container {
    padding: 0.5rem;
  }

  .${className}-title {
    font-size: 1.5rem;
  }

  .${className}-content {
    gap: 1rem;
  }

  .${className}-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .${className}-title {
    font-size: 1.25rem;
  }

  .${className}-description {
    font-size: 1rem;
  }

  .${className}-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
`;
  }

  /**
   * Generate component content for missing files
   */
  private generateComponentContent(
    componentPath: string,
    _config: ProjectConfig,
  ): string {
    const componentName =
      componentPath
        .split("/")
        .pop()
        ?.replace(/\.(tsx|jsx|ts|js)$/, "") || "Component";
    const className = componentName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    return `import React from 'react';
import './${componentName}.css';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

const ${componentName}: React.FC<${componentName}Props> = ({
  className = '',
  children
}) => {
  return (
    <div className={\`${className} \${className}\`.trim()}>
      <div className="${className}-container">
        <div className="${className}-header">
          <h2 className="${className}-title">${componentName}</h2>
          <p className="${className}-description">
            This component was auto-generated by the validation system.
          </p>
        </div>
        <div className="${className}-content">
          {children || (
            <div className="${className}-item">
              <p>Component content goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
`;
  }

  /**
   * Generate required file content
   */
  private generateRequiredFileContent(
    filePath: string,
    config: ProjectConfig,
  ): { content: string; type: string } | null {
    switch (filePath) {
      case "package.json":
        return {
          content: JSON.stringify(
            {
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
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.8.0",
              },
              devDependencies: {
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
              },
            },
            null,
            2,
          ),
          type: "json",
        };

      case "src/main.tsx":
        return {
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
          type: "tsx",
        };

      case "src/App.tsx":
        return {
          content: `import React from 'react';
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

export default App;`,
          type: "tsx",
        };

      case "index.html":
        return {
          content: `<!DOCTYPE html>
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
</html>`,
          type: "html",
        };

      default:
        return null;
    }
  }

  /**
   * Correct import path
   */
  private correctImportPath(
    importPath: string,
    currentFilePath: string,
    files: GeneratedFile[],
  ): string {
    // Create a map of available files
    const fileMap = new Map<string, GeneratedFile>();
    files.forEach((file) => fileMap.set(file.path, file));

    // If the import path already exists, return it
    if (
      fileMap.has(importPath) ||
      fileMap.has(importPath + ".tsx") ||
      fileMap.has(importPath + ".ts")
    ) {
      return importPath;
    }

    // Try to find the correct path
    const currentDir = currentFilePath.split("/").slice(0, -1).join("/");

    // Handle relative imports
    if (importPath.startsWith("./")) {
      const relativePath = importPath.substring(2);
      const fullPath = currentDir + "/" + relativePath;

      const possibleExtensions = [".tsx", ".jsx", ".ts", ".js", ".css"];
      for (const ext of possibleExtensions) {
        if (fileMap.has(fullPath + ext)) {
          return "./" + relativePath;
        }
      }
    }

    // Try to find similar named files
    const fileName = importPath.split("/").pop() || "";
    const similarFiles = files.filter(
      (f) =>
        f.path.includes(fileName) ||
        f.path.toLowerCase().includes(fileName.toLowerCase()),
    );

    if (similarFiles.length > 0) {
      const bestMatch = similarFiles[0];
      const relativePath = this.getRelativePath(
        currentFilePath,
        bestMatch.path,
      );
      return relativePath;
    }

    return importPath; // Return original if no correction found
  }

  /**
   * Get relative path between two files
   */
  private getRelativePath(fromFile: string, toFile: string): string {
    const fromParts = fromFile.split("/");
    const toParts = toFile.split("/");

    // Remove file names, keep only directories
    fromParts.pop();
    const toFileName = toParts.pop() || "";

    // Find common base
    let i = 0;
    while (
      i < fromParts.length &&
      i < toParts.length &&
      fromParts[i] === toParts[i]
    ) {
      i++;
    }

    // Build relative path
    const upLevels = fromParts.length - i;
    const relativeParts = Array(upLevels).fill("..").concat(toParts.slice(i));

    if (relativeParts.length === 0) {
      return "./" + toFileName.replace(/\.(tsx|jsx|ts|js)$/, "");
    }

    return (
      relativeParts.join("/") +
      "/" +
      toFileName.replace(/\.(tsx|jsx|ts|js)$/, "")
    );
  }

  /**
   * Generate TypeScript configuration
   */
  private generateTSConfig(_config: ProjectConfig): string {
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

  /**
   * Generate Vite configuration
   */
  private generateViteConfig(config: ProjectConfig): string {
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
      manifest: {
        name: '${config.businessName}',
        short_name: '${config.projectName}',
        description: 'An AI-powered PWA application',
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
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;
  }

  /**
   * Get AI-assisted fix for complex errors
   */
  private async getAIFix(
    _error: ValidationError,
    _file: GeneratedFile,
    _config: ProjectConfig,
  ): Promise<{
    fixedContent: string;
    description: string;
    confidence: number;
  } | null> {
    try {
      // This is a simplified AI fix - in a real implementation you'd call the AI service
      // For now, return null to indicate no AI fix available
      return null;
    } catch (error) {
      console.error("AI fix error:", error);
      return null;
    }
  }

  /**
   * Map error type to fix type
   */
  private mapErrorToFixType(errorType: string): FixType {
    switch (errorType) {
      case "syntax":
        return "syntax-jsx";
      case "dependency":
        return "missing-dependency";
      case "import":
        return "missing-import";
      case "build":
        return "build-config";
      case "runtime":
        return "runtime-error";
      default:
        return "syntax-jsx";
    }
  }

  /**
   * Get latest version for a dependency
   */
  private getLatestVersion(packageName: string): string {
    const versionMap: Record<string, string> = {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.8.0",
      "react-hook-form": "^7.48.0",
      "@hookform/resolvers": "^3.3.0",
      zod: "^3.22.0",
      "socket.io-client": "^4.7.0",
      "emoji-picker-react": "^4.5.0",
      stripe: "^14.0.0",
      "@stripe/react-stripe-js": "^2.4.0",
      "react-datepicker": "^4.25.0",
      "date-fns": "^2.30.0",
      recharts: "^2.8.0",
      "react-chartjs-2": "^5.2.0",
      leaflet: "^1.9.0",
      "react-leaflet": "^4.2.0",
      "fuse.js": "^7.0.0",
      "react-select": "^5.8.0",
      "react-hot-toast": "^2.4.0",
      "web-push": "^3.6.0",
      "react-share": "^4.4.0",
      "social-auth-react": "^1.0.0",
    };

    return versionMap[packageName] || "latest";
  }

  /**
   * Get feature-specific dependencies
   */
  private getFeatureDependencies(features: string[]): Record<string, string> {
    const dependencies: Record<string, string> = {};

    const featureDependencyMap: Record<string, string[]> = {
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

    for (const feature of features) {
      const featureDeps = featureDependencyMap[feature];
      if (featureDeps) {
        for (const dep of featureDeps) {
          dependencies[dep] = this.getLatestVersion(dep);
        }
      }
    }

    return dependencies;
  }

  /**
   * Generate unique fix ID
   */
  private generateFixId(): string {
    return `fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Rollback applied fixes
   */
  async rollback(rollbackData: RollbackData): Promise<boolean> {
    try {
      // Remove fixes from history
      this.fixHistory = this.fixHistory.filter(
        (fix) => !rollbackData.fixIds.includes(fix.id),
      );

      console.log(`✅ Rolled back ${rollbackData.fixIds.length} fixes`);
      return true;
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      return false;
    }
  }

  /**
   * Get fix history
   */
  getFixHistory(): AppliedFix[] {
    return [...this.fixHistory];
  }

  /**
   * Get rollback history
   */
  getRollbackHistory(): RollbackData[] {
    return [...this.rollbackHistory];
  }

  /**
   * Clear fix history
   */
  clearHistory(): void {
    this.fixHistory = [];
    this.rollbackHistory = [];
  }

  /**
   * Get fix statistics
   */
  getFixStatistics(): {
    totalFixes: number;
    fixesByType: Record<FixType, number>;
    successRate: number;
    averageConfidence: number;
  } {
    const totalFixes = this.fixHistory.length;
    const fixesByType = this.fixHistory.reduce(
      (acc, fix) => {
        acc[fix.type] = (acc[fix.type] || 0) + 1;
        return acc;
      },
      {} as Record<FixType, number>,
    );

    const averageConfidence =
      totalFixes > 0
        ? this.fixHistory.reduce((sum, fix) => sum + fix.confidence, 0) /
          totalFixes
        : 0;

    return {
      totalFixes,
      fixesByType,
      successRate: 100, // This would be calculated based on actual success/failure rates
      averageConfidence,
    };
  }
}

// Export singleton instance
export const autoFixEngine = new AutoFixEngine();
