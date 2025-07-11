import React, { useState } from "react";
import { usePWAGeneratorStore } from "../store/PWAGeneratorStore";
import { ValidationError } from "../services/projectValidator";

import "./ValidationReport.css";

interface ValidationReportProps {
  onClose?: () => void;
  showInModal?: boolean;
}

const ValidationReport: React.FC<ValidationReportProps> = ({
  onClose,
  showInModal = false,
}) => {
  const {
    isValidating,
    validationResult,

    validationEnabled,
    setValidationEnabled,
    error,
  } = usePWAGeneratorStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "errors" | "warnings" | "fixes" | "build"
  >("overview");
  const [selectedError, setSelectedError] = useState<ValidationError | null>(
    null,
  );

  const renderOverview = () => {
    if (!validationResult) return null;

    const { isValid, errors, warnings, suggestions } = validationResult;
    const totalIssues = errors.length + warnings.length;

    return (
      <div className="validation-overview">
        <div className="validation-status">
          <div className={`status-badge ${isValid ? "valid" : "invalid"}`}>
            {isValid ? "✅ Valid" : "❌ Invalid"}
          </div>
          <div className="status-details">
            <span className="project-status">
              {isValid
                ? "Project is ready to deploy"
                : `${totalIssues} issues found`}
            </span>
          </div>
        </div>

        <div className="validation-metrics">
          <div className="metric">
            <div className="metric-value error">{errors.length}</div>
            <div className="metric-label">Errors</div>
          </div>
          <div className="metric">
            <div className="metric-value warning">{warnings.length}</div>
            <div className="metric-label">Warnings</div>
          </div>
          <div className="metric">
            <div className="metric-value suggestion">{suggestions.length}</div>
            <div className="metric-label">Suggestions</div>
          </div>
          {validationResult && validationResult.autoFixedCount > 0 && (
            <div className="metric">
              <div className="metric-value fix">
                {validationResult.autoFixedCount}
              </div>
              <div className="metric-label">Auto-Fixes</div>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <h3>💡 Suggestions</h3>
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationResult && validationResult.autoFixedCount > 0 && (
          <div className="auto-fix-summary">
            <h3>🔧 Auto-Fix Summary</h3>
            <div className="fix-stats">
              <div className="fix-stat">
                <span className="fix-stat-label">Fixes Applied:</span>
                <span className="fix-stat-value">
                  {validationResult.autoFixedCount}
                </span>
              </div>
              <div className="fix-stat">
                <span className="fix-stat-label">Success Rate:</span>
                <span className="fix-stat-value">
                  {validationResult.autoFixedCount > 0
                    ? `${Math.round((validationResult.autoFixedCount / (validationResult.errors.length + validationResult.autoFixedCount)) * 100)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="fix-stat">
                <span className="fix-stat-label">Time Taken:</span>
                <span className="fix-stat-value">
                  {validationResult.preventedIssuesCount} prevented
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderErrors = () => {
    if (!validationResult?.errors.length) {
      return (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <div className="empty-title">No Errors Found</div>
          <div className="empty-description">
            Your project has no validation errors.
          </div>
        </div>
      );
    }

    return (
      <div className="errors-section">
        <div className="errors-list">
          {validationResult.errors.map((error, index) => (
            <div
              key={index}
              className={`error-item ${error.severity}`}
              onClick={() =>
                setSelectedError(selectedError === error ? null : error)
              }
            >
              <div className="error-header">
                <div className="error-type">{error.type}</div>
                <div className="error-file">{error.file}</div>
                {error.line && (
                  <div className="error-location">Line {error.line}</div>
                )}
                <div className={`error-severity ${error.severity}`}>
                  {error.severity === "error" ? "🔴" : "🟡"}
                </div>
              </div>
              <div className="error-message">{error.message}</div>

              {selectedError === error && (
                <div className="error-details">
                  {error.suggestedFix && (
                    <div className="suggested-fix">
                      <strong>Suggested Fix:</strong> {error.suggestedFix}
                    </div>
                  )}
                  <div className="error-meta">
                    <span
                      className={`auto-fixable ${error.autoFixable ? "yes" : "no"}`}
                    >
                      {error.autoFixable
                        ? "🔧 Auto-fixable"
                        : "⚠️ Manual fix required"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWarnings = () => {
    if (!validationResult?.warnings.length) {
      return (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <div className="empty-title">No Warnings</div>
          <div className="empty-description">
            Your project has no validation warnings.
          </div>
        </div>
      );
    }

    return (
      <div className="warnings-section">
        <div className="warnings-list">
          {validationResult.warnings.map((warning, index) => (
            <div key={index} className="warning-item">
              <div className="warning-header">
                <div className="warning-type">{warning.type}</div>
                <div className="warning-file">{warning.file}</div>
                <div className="warning-icon">⚠️</div>
              </div>
              <div className="warning-message">{warning.message}</div>
              <div className="warning-suggestion">
                <strong>Suggestion:</strong> {warning.suggestion}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFixes = () => {
    if (!validationResult?.autoFixedCount) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <div className="empty-title">No Fixes Applied</div>
          <div className="empty-description">
            No automatic fixes were applied to your project.
          </div>
        </div>
      );
    }

    return (
      <div className="fixes-section">
        <div className="fixes-list">
          <div className="fix-item">
            <div className="fix-header">
              <div className="fix-type">Enhanced Auto-Fix</div>
              <div className="fix-file">Multiple Files</div>
              <div className="fix-method">Intelligent Auto-Fix Engine</div>
              <div className="fix-confidence">100% confidence</div>
            </div>
            <div className="fix-description">
              Enhanced validation system automatically fixed{" "}
              {validationResult.autoFixedCount} issues and prevented{" "}
              {validationResult.preventedIssuesCount} potential problems.
            </div>

            <div className="fix-status">
              <div className="status-badge success">✅ Auto-Fix Complete</div>
              <div className="final-status">
                Status: {validationResult.finalStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBuildTest = () => {
    if (!validationResult?.buildTest) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🏗️</div>
          <div className="empty-title">No Build Test</div>
          <div className="empty-description">
            Build testing was not performed.
          </div>
        </div>
      );
    }

    const { buildTest } = validationResult;
    const overallSuccess = buildTest.buildSuccess && buildTest.installSuccess;

    return (
      <div className="build-test-section">
        <div className="build-status">
          <div
            className={`build-badge ${overallSuccess ? "success" : "failure"}`}
          >
            {overallSuccess ? "✅ Build Successful" : "❌ Build Failed"}
          </div>
          <div className="build-time">Time: {buildTest.timeTaken}ms</div>
        </div>

        <div className="build-steps">
          <div
            className={`build-step ${buildTest.installSuccess ? "success" : "failure"}`}
          >
            <div className="step-icon">
              {buildTest.installSuccess ? "✅" : "❌"}
            </div>
            <div className="step-title">Package Installation</div>
            <div className="step-status">
              {buildTest.installSuccess ? "Success" : "Failed"}
            </div>
          </div>

          <div
            className={`build-step ${buildTest.buildSuccess ? "success" : "failure"}`}
          >
            <div className="step-icon">
              {buildTest.buildSuccess ? "✅" : "❌"}
            </div>
            <div className="step-title">Build Process</div>
            <div className="step-status">
              {buildTest.buildSuccess ? "Success" : "Failed"}
            </div>
          </div>

          <div
            className={`build-step ${buildTest.devServerSuccess ? "success" : "failure"}`}
          >
            <div className="step-icon">
              {buildTest.devServerSuccess ? "✅" : "❌"}
            </div>
            <div className="step-title">Dev Server</div>
            <div className="step-status">
              {buildTest.devServerSuccess ? "Success" : "Failed"}
            </div>
          </div>
        </div>

        {buildTest.errors.length > 0 && (
          <div className="build-errors">
            <h4>Build Errors:</h4>
            <ul>
              {buildTest.errors.map((error, index) => (
                <li key={index} className="build-error">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {buildTest.warnings.length > 0 && (
          <div className="build-warnings">
            <h4>Build Warnings:</h4>
            <ul>
              {buildTest.warnings.map((warning, index) => (
                <li key={index} className="build-warning">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="error-state">
          <div className="error-icon">❌</div>
          <div className="error-title">Validation Error</div>
          <div className="error-message">{error}</div>
        </div>
      );
    }

    if (isValidating) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-title">Validating Project...</div>
          <div className="loading-description">
            Running comprehensive validation checks
          </div>
        </div>
      );
    }

    if (!validationResult) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Validation Results</div>
          <div className="empty-description">
            Run project validation to see detailed results here.
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "errors":
        return renderErrors();
      case "warnings":
        return renderWarnings();
      case "fixes":
        return renderFixes();
      case "build":
        return renderBuildTest();
      default:
        return renderOverview();
    }
  };

  const containerClass = showInModal
    ? "validation-report-modal"
    : "validation-report-embedded";

  return (
    <div className={`validation-report ${containerClass}`}>
      {showInModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Validation Report</h2>
              <button className="modal-close" onClick={onClose}>
                ×
              </button>
            </div>
            <div className="modal-body">{renderReportContent()}</div>
          </div>
        </div>
      )}

      {!showInModal && renderReportContent()}
    </div>
  );

  function renderReportContent() {
    return (
      <>
        <div className="validation-header">
          <div className="validation-title">
            <h2>Project Validation Report</h2>
            <div className="validation-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={validationEnabled}
                  onChange={(e) => setValidationEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                Enable Validation
              </label>
            </div>
          </div>

          {validationResult && (
            <div className="validation-summary">
              <div className="summary-item">
                <span className="summary-label">Status:</span>
                <span
                  className={`summary-value ${validationResult.isValid ? "valid" : "invalid"}`}
                >
                  {validationResult.isValid ? "Valid" : "Invalid"}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Issues:</span>
                <span className="summary-value">
                  {validationResult.errors.length +
                    validationResult.warnings.length}
                </span>
              </div>
              {validationResult && validationResult.autoFixedCount > 0 && (
                <div className="summary-item">
                  <span className="summary-label">Auto-Fixed:</span>
                  <span className="summary-value">
                    {validationResult.autoFixedCount}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="validation-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "errors" ? "active" : ""}`}
            onClick={() => setActiveTab("errors")}
          >
            Errors ({validationResult?.errors.length || 0})
          </button>
          <button
            className={`tab ${activeTab === "warnings" ? "active" : ""}`}
            onClick={() => setActiveTab("warnings")}
          >
            Warnings ({validationResult?.warnings.length || 0})
          </button>
          <button
            className={`tab ${activeTab === "fixes" ? "active" : ""}`}
            onClick={() => setActiveTab("fixes")}
          >
            Auto-Fixes ({validationResult?.autoFixedCount || 0})
          </button>
          <button
            className={`tab ${activeTab === "build" ? "active" : ""}`}
            onClick={() => setActiveTab("build")}
          >
            Build Test
          </button>
        </div>

        <div className="validation-content">{renderContent()}</div>
      </>
    );
  }
};

export default ValidationReport;
