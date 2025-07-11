import { useState, useCallback, useRef } from "react";

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  fixedFiles?: GeneratedFile[];
  autoFixedCount: number;
  preventedIssuesCount: number;
  finalStatus: "READY_TO_USE" | "NEEDS_ATTENTION" | "PROCESSING" | "ERROR";
}

interface ValidationError {
  type: string;
  file: string;
  message: string;
  severity: "error" | "warning";
  fixed?: boolean;
}

interface ValidationWarning {
  type: string;
  file: string;
  message: string;
  suggestion?: string;
}

interface AppliedFix {
  type: string;
  file: string;
  description: string;
  strategy: string;
  confidence: number;
}

interface ProjectConfig {
  projectName: string;
  businessName: string;
  framework: string;
  industry: string;
  location?: string;
  targetAudience: string;
  primaryGoal: string;
  features: string[];
  selectedFeatures: string[];
  businessData: any;
}

interface UseEnhancedValidationOptions {
  autoValidate?: boolean;
  onValidationComplete?: (result: ValidationResult) => void;
  onError?: (error: Error) => void;
}

interface UseEnhancedValidationReturn {
  // State
  isValidating: boolean;
  validationResult: ValidationResult | null;
  appliedFixes: AppliedFix[];
  generatedFiles: GeneratedFile[];
  error: Error | null;

  // Actions
  validateProject: (
    files: GeneratedFile[],
    config: ProjectConfig,
  ) => Promise<ValidationResult>;
  clearResults: () => void;
  resetValidation: () => void;

  // Computed properties
  hasErrors: boolean;
  hasWarnings: boolean;
  isReady: boolean;
  successRate: number;
}

// Mock enhanced validation function (replace with actual import when available)
const runEnhancedValidation = async (
  files: GeneratedFile[],
  config: ProjectConfig,
): Promise<{
  validationResult: ValidationResult;
  appliedFixes: AppliedFix[];
  generatedFiles: GeneratedFile[];
}> => {
  // Simulate validation phases
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation logic
  const mockErrors: ValidationError[] = [];
  const mockWarnings: ValidationWarning[] = [];
  const mockFixes: AppliedFix[] = [];
  let autoFixedCount = 0;
  let preventedIssuesCount = 0;

  // Simulate prevention phase
  if (!files.find((f) => f.path === "package.json")) {
    preventedIssuesCount++;
    files.push({
      path: "package.json",
      content: JSON.stringify(
        {
          name: config.projectName.toLowerCase().replace(/\s+/g, "-"),
          version: "1.0.0",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
          },
        },
        null,
        2,
      ),
      type: "json",
    });
  }

  // Simulate detection and auto-fix
  files.forEach((file) => {
    if (file.path.endsWith(".js") || file.path.endsWith(".jsx")) {
      if (
        file.content.includes("<") &&
        !file.content.includes("import React")
      ) {
        // Auto-fix React import
        file.content = "import React from 'react';\n" + file.content;
        autoFixedCount++;
        mockFixes.push({
          type: "syntax",
          file: file.path,
          description: "Added missing React import",
          strategy: "pattern-matching",
          confidence: 0.95,
        });
      }

      if (/\w+=(?![{"'])[^>\s]+/.test(file.content)) {
        // Auto-fix JSX attributes
        file.content = file.content.replace(
          /(\w+)=([^"'{\s][^>\s]*)/g,
          '$1="$2"',
        );
        autoFixedCount++;
        mockFixes.push({
          type: "syntax",
          file: file.path,
          description: "Fixed unquoted JSX attributes",
          strategy: "regex-replacement",
          confidence: 0.9,
        });
      }
    }
  });

  const validationResult: ValidationResult = {
    isValid: mockErrors.length === 0,
    errors: mockErrors,
    warnings: mockWarnings,
    suggestions:
      mockErrors.length === 0
        ? ["Great job! Your project is ready for production."]
        : [],
    fixedFiles: files,
    autoFixedCount,
    preventedIssuesCount,
    finalStatus: mockErrors.length === 0 ? "READY_TO_USE" : "NEEDS_ATTENTION",
  };

  return {
    validationResult,
    appliedFixes: mockFixes,
    generatedFiles: files,
  };
};

export const useEnhancedValidation = (
  options: UseEnhancedValidationOptions = {},
): UseEnhancedValidationReturn => {
  const { onValidationComplete, onError } = options;

  // State
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<AppliedFix[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Validate project function
  const validateProject = useCallback(
    async (
      files: GeneratedFile[],
      config: ProjectConfig,
    ): Promise<ValidationResult> => {
      try {
        // Clear previous state
        setError(null);
        setIsValidating(true);

        // Set initial processing state
        setValidationResult({
          isValid: false,
          errors: [],
          warnings: [],
          suggestions: [],
          autoFixedCount: 0,
          preventedIssuesCount: 0,
          finalStatus: "PROCESSING",
        });

        // Create abort controller for this validation
        abortControllerRef.current = new AbortController();

        // Run enhanced validation
        const result = await runEnhancedValidation(files, config);

        // Check if validation was aborted
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Validation was cancelled");
        }

        // Update state with results
        setValidationResult(result.validationResult);
        setAppliedFixes(result.appliedFixes);
        setGeneratedFiles(result.generatedFiles);

        // Call completion callback
        if (onValidationComplete) {
          onValidationComplete(result.validationResult);
        }

        return result.validationResult;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Validation failed");
        setError(error);

        // Set error state
        setValidationResult({
          isValid: false,
          errors: [
            {
              type: "system",
              file: "validator",
              message: error.message,
              severity: "error",
            },
          ],
          warnings: [],
          suggestions: ["Please try again or check your project configuration"],
          autoFixedCount: 0,
          preventedIssuesCount: 0,
          finalStatus: "ERROR",
        });

        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setIsValidating(false);
        abortControllerRef.current = null;
      }
    },
    [onValidationComplete, onError],
  );

  // Clear results function
  const clearResults = useCallback(() => {
    setValidationResult(null);
    setAppliedFixes([]);
    setGeneratedFiles([]);
    setError(null);
  }, []);

  // Reset validation function
  const resetValidation = useCallback(() => {
    // Abort current validation if running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsValidating(false);
    clearResults();
  }, [clearResults]);

  // Computed properties
  const hasErrors = validationResult
    ? validationResult.errors.length > 0
    : false;
  const hasWarnings = validationResult
    ? validationResult.warnings.length > 0
    : false;
  const isReady = validationResult
    ? validationResult.finalStatus === "READY_TO_USE"
    : false;

  const successRate = validationResult
    ? (() => {
        const total =
          validationResult.autoFixedCount +
          validationResult.preventedIssuesCount +
          validationResult.errors.length;
        if (total === 0) return 100;
        const fixed =
          validationResult.autoFixedCount +
          validationResult.preventedIssuesCount;
        return Math.round((fixed / total) * 100);
      })()
    : 0;

  return {
    // State
    isValidating,
    validationResult,
    appliedFixes,
    generatedFiles,
    error,

    // Actions
    validateProject,
    clearResults,
    resetValidation,

    // Computed properties
    hasErrors,
    hasWarnings,
    isReady,
    successRate,
  };
};

export default useEnhancedValidation;
