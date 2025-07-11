import React, { useState, useEffect } from "react";
import "./EnhancedValidationPanel.css";

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  fixedFiles?: any[];
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

interface EnhancedValidationPanelProps {
  validationResult?: ValidationResult;
  isValidating?: boolean;
  onValidate?: () => void;
  onClearResults?: () => void;
  appliedFixes?: AppliedFix[];
  generatedFiles?: any[];
}

const EnhancedValidationPanel: React.FC<EnhancedValidationPanelProps> = ({
  validationResult,
  isValidating = false,
  onValidate,
  onClearResults,
  appliedFixes = [],
  generatedFiles = [],
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showFixes, setShowFixes] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "prevention" | "detection" | "autofix" | "final" | "complete"
  >("prevention");

  useEffect(() => {
    if (isValidating) {
      // Simulate the 4-phase validation process
      const phases = [
        "prevention",
        "detection",
        "autofix",
        "final",
        "complete",
      ];
      let currentPhase = 0;

      const interval = setInterval(() => {
        if (currentPhase < phases.length - 1) {
          currentPhase++;
          setAnimationPhase(phases[currentPhase] as any);
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isValidating]);

  const getStatusIcon = () => {
    if (isValidating) return "⚡";
    if (!validationResult) return "🔍";

    switch (validationResult.finalStatus) {
      case "READY_TO_USE":
        return "✅";
      case "NEEDS_ATTENTION":
        return "⚠️";
      case "ERROR":
        return "❌";
      default:
        return "🔍";
    }
  };

  const getStatusColor = () => {
    if (isValidating) return "processing";
    if (!validationResult) return "neutral";

    switch (validationResult.finalStatus) {
      case "READY_TO_USE":
        return "success";
      case "NEEDS_ATTENTION":
        return "warning";
      case "ERROR":
        return "error";
      default:
        return "neutral";
    }
  };

  const getStatusMessage = () => {
    if (isValidating) {
      switch (animationPhase) {
        case "prevention":
          return "Phase 1: Intelligent Prevention System";
        case "detection":
          return "Phase 2: Smart Critical Issue Detection";
        case "autofix":
          return "Phase 3: Aggressive Auto-Fix Engine";
        case "final":
          return "Phase 4: Final Production-Ready Validation";
        case "complete":
          return "Enhanced Validation Complete!";
        default:
          return "Enhanced Validation Starting...";
      }
    }

    if (!validationResult) return "Ready to validate your project";

    switch (validationResult.finalStatus) {
      case "READY_TO_USE":
        return "Project generated successfully - ready to use!";
      case "NEEDS_ATTENTION":
        return "Project generated with minor issues";
      case "ERROR":
        return "Validation encountered errors";
      default:
        return "Validation complete";
    }
  };

  const calculateSuccessRate = () => {
    if (!validationResult) return 0;
    const total =
      validationResult.autoFixedCount +
      validationResult.preventedIssuesCount +
      validationResult.errors.length;
    if (total === 0) return 100;
    const fixed =
      validationResult.autoFixedCount + validationResult.preventedIssuesCount;
    return Math.round((fixed / total) * 100);
  };

  return (
    <div className="enhanced-validation-panel">
      <div className="validation-header">
        <div className="validation-status">
          <div className={`status-icon ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="status-content">
            <h3 className="status-title">Enhanced Validation System</h3>
            <p className="status-message">{getStatusMessage()}</p>
            {validationResult && (
              <div className="status-subtitle">
                🎯 Target: Zero Manual Issues -{" "}
                {validationResult.errors.length === 0
                  ? "ACHIEVED"
                  : "IN PROGRESS"}
              </div>
            )}
          </div>
        </div>

        <div className="validation-actions">
          {onValidate && (
            <button
              className="btn btn-primary"
              onClick={onValidate}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Run Enhanced Validation"}
            </button>
          )}
          {onClearResults && validationResult && (
            <button className="btn btn-secondary" onClick={onClearResults}>
              Clear Results
            </button>
          )}
        </div>
      </div>

      {isValidating && (
        <div className="validation-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  animationPhase === "prevention"
                    ? 25
                    : animationPhase === "detection"
                      ? 50
                      : animationPhase === "autofix"
                        ? 75
                        : animationPhase === "final"
                          ? 95
                          : 100
                }%`,
              }}
            />
          </div>
          <div className="progress-phases">
            <div
              className={`phase ${animationPhase === "prevention" ? "active" : "completed"}`}
            >
              🛡️ Prevention
            </div>
            <div
              className={`phase ${animationPhase === "detection" ? "active" : animationPhase === "autofix" || animationPhase === "final" || animationPhase === "complete" ? "completed" : ""}`}
            >
              🔍 Detection
            </div>
            <div
              className={`phase ${animationPhase === "autofix" ? "active" : animationPhase === "final" || animationPhase === "complete" ? "completed" : ""}`}
            >
              🔧 Auto-Fix
            </div>
            <div
              className={`phase ${animationPhase === "final" ? "active" : animationPhase === "complete" ? "completed" : ""}`}
            >
              ✅ Final Check
            </div>
          </div>
        </div>
      )}

      {validationResult && !isValidating && (
        <>
          <div className="validation-summary">
            <div className="summary-cards">
              <div className="summary-card success">
                <div className="card-icon">🔧</div>
                <div className="card-content">
                  <div className="card-number">
                    {validationResult.autoFixedCount}
                  </div>
                  <div className="card-label">Issues Auto-Fixed</div>
                </div>
              </div>

              <div className="summary-card prevention">
                <div className="card-icon">🛡️</div>
                <div className="card-content">
                  <div className="card-number">
                    {validationResult.preventedIssuesCount}
                  </div>
                  <div className="card-label">Issues Prevented</div>
                </div>
              </div>

              <div className="summary-card manual">
                <div className="card-icon">⚠️</div>
                <div className="card-content">
                  <div className="card-number">
                    {validationResult.errors.length}
                  </div>
                  <div className="card-label">Manual Issues</div>
                </div>
              </div>

              <div className="summary-card rate">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-number">{calculateSuccessRate()}%</div>
                  <div className="card-label">Auto-Fix Rate</div>
                </div>
              </div>
            </div>

            {validationResult.finalStatus === "READY_TO_USE" && (
              <div className="achievement-banner">
                <div className="achievement-icon">🎉</div>
                <div className="achievement-content">
                  <h4>ZERO MANUAL ISSUES ACHIEVED!</h4>
                  <p>
                    Your project is production-ready and can be used
                    immediately.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="validation-details">
            <div className="details-tabs">
              <button
                className={`tab ${!showFixes ? "active" : ""}`}
                onClick={() => setShowFixes(false)}
              >
                Validation Results
              </button>
              <button
                className={`tab ${showFixes ? "active" : ""}`}
                onClick={() => setShowFixes(true)}
              >
                Applied Fixes ({appliedFixes.length})
              </button>
            </div>

            {!showFixes ? (
              <div className="results-content">
                {validationResult.errors.length > 0 && (
                  <div className="errors-section">
                    <h4>
                      🔴 Remaining Issues ({validationResult.errors.length})
                    </h4>
                    <div className="issues-list">
                      {validationResult.errors.map((error, index) => (
                        <div key={index} className="issue-item error">
                          <div className="issue-header">
                            <span className="issue-type">{error.type}</span>
                            <span className="issue-file">{error.file}</span>
                          </div>
                          <div className="issue-message">{error.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="warnings-section">
                    <h4>🟡 Warnings ({validationResult.warnings.length})</h4>
                    <div className="issues-list">
                      {validationResult.warnings.map((warning, index) => (
                        <div key={index} className="issue-item warning">
                          <div className="issue-header">
                            <span className="issue-type">{warning.type}</span>
                            <span className="issue-file">{warning.file}</span>
                          </div>
                          <div className="issue-message">{warning.message}</div>
                          {warning.suggestion && (
                            <div className="issue-suggestion">
                              💡 {warning.suggestion}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <h4>💡 Suggestions</h4>
                    <ul className="suggestions-list">
                      {validationResult.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.errors.length === 0 &&
                  validationResult.warnings.length === 0 && (
                    <div className="no-issues">
                      <div className="no-issues-icon">🎯</div>
                      <h4>Perfect! No issues found.</h4>
                      <p>
                        Your project has been validated and is ready for
                        production use.
                      </p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="fixes-content">
                {appliedFixes.length > 0 ? (
                  <div className="fixes-list">
                    {appliedFixes.map((fix, index) => (
                      <div key={index} className="fix-item">
                        <div className="fix-header">
                          <span className="fix-type">{fix.type}</span>
                          <span className="fix-file">{fix.file}</span>
                          <span className="fix-confidence">
                            {Math.round(fix.confidence * 100)}% confidence
                          </span>
                        </div>
                        <div className="fix-description">{fix.description}</div>
                        <div className="fix-strategy">
                          Strategy: {fix.strategy}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-fixes">
                    <div className="no-fixes-icon">🔧</div>
                    <h4>No fixes were needed</h4>
                    <p>Your project was already in perfect condition!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="validation-footer">
            <div className="footer-stats">
              <span>Files Generated: {generatedFiles.length}</span>
              <span>•</span>
              <span>Validation Time: &lt;1s</span>
              <span>•</span>
              <span>Success Rate: {calculateSuccessRate()}%</span>
            </div>
            <div className="footer-actions">
              <button
                className="btn btn-small"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide" : "Show"} Technical Details
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="technical-details">
              <h4>Technical Details</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Validation Strategy:</strong> 4-Phase Enhanced
                  Validation
                </div>
                <div className="detail-item">
                  <strong>Prevention System:</strong> Active
                </div>
                <div className="detail-item">
                  <strong>Auto-Fix Engine:</strong> Intelligent Multi-Strategy
                </div>
                <div className="detail-item">
                  <strong>Emergency Recovery:</strong> Available
                </div>
                <div className="detail-item">
                  <strong>Final Status:</strong> {validationResult.finalStatus}
                </div>
                <div className="detail-item">
                  <strong>System Version:</strong> Enhanced v2.0.0
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedValidationPanel;
