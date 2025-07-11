import React, { useState, useCallback } from "react";
import EnhancedValidationPanel from "./EnhancedValidationPanel";
import { useEnhancedValidation } from "../hooks/useEnhancedValidation";

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
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
  businessData: {
    name: string;
    location?: string;
    targetAudience: string;
    primaryGoal: string;
    description: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

const PWAGeneratorWithValidation: React.FC = () => {
  // Enhanced validation hook
  const {
    isValidating,
    validationResult,
    appliedFixes,
    generatedFiles,
    validateProject,
    clearResults,
    isReady,
    successRate,
  } = useEnhancedValidation({
    onValidationComplete: (result) => {
      console.log("✅ Enhanced validation complete:", result);
      if (result.finalStatus === "READY_TO_USE") {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    },
    onError: (error) => {
      console.error("❌ Validation error:", error);
    },
  });

  // Component state
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    projectName: "My PWA Project",
    businessName: "My Business",
    framework: "React",
    industry: "Technology",
    location: "Global",
    targetAudience: "Developers",
    primaryGoal: "Create amazing web applications",
    features: [],
    selectedFeatures: ["auth", "gallery", "contact-form"],
    businessData: {
      name: "My Business",
      location: "Global",
      targetAudience: "Developers",
      primaryGoal: "Create amazing web applications",
      description: "A modern business focused on web development",
      contactEmail: "hello@mybusiness.com",
      contactPhone: "+1 (555) 123-4567",
    },
  });

  const [generationStep, setGenerationStep] = useState<
    "config" | "generate" | "validate" | "complete"
  >("config");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [projectFiles, setProjectFiles] = useState<GeneratedFile[]>([]);

  // Mock project generation function
  const generateProjectFiles = useCallback(
    (config: ProjectConfig): GeneratedFile[] => {
      const files: GeneratedFile[] = [];

      // Generate package.json
      files.push({
        path: "package.json",
        content: JSON.stringify(
          {
            name: config.projectName.toLowerCase().replace(/\s+/g, "-"),
            version: "1.0.0",
            description: config.businessData.description,
            main: "src/index.js",
            scripts: {
              start: "react-scripts start",
              build: "react-scripts build",
              test: "react-scripts test",
            },
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "react-router-dom": "^6.8.0",
            },
            devDependencies: {
              "react-scripts": "^5.0.1",
            },
          },
          null,
          2,
        ),
        type: "json",
      });

      // Generate index.js (with potential issues for demonstration)
      files.push({
        path: "src/index.js",
        content: `// Missing React import for demonstration
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        type: "javascript",
      });

      // Generate App.js with JSX issues
      files.push({
        path: "src/App.js",
        content: `// React import will be auto-added by enhanced validation
function App() {
  return (
    <div className=app-container>
      <header className=app-header>
        <h1>Welcome to ${config.businessName}</h1>
        <p>{${config.businessData.description}}</p>
        <img src=logo.png alt=Logo>
      </header>
      <main>
        <section className=features>
          ${config.selectedFeatures
            .map(
              (feature) => `
          <div className=feature-card>
            <h3>${feature}</h3>
            <p>Feature description for ${feature}</p>
          </div>`,
            )
            .join("")}
        </section>
      </main>
    </div>
  );
}

export default App;`,
        type: "javascript",
      });

      // Generate CSS with syntax issues
      files.push({
        path: "src/App.css",
        content: `.app-container {
  max-width: 1200px
  margin: 0 auto
  padding: 20px
}

.app-header {
  text-align: center
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  color: white
  padding: 40px 20px
  border-radius: 8px
}

.features {
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: 20px
  margin-top: 40px
}

.feature-card {
  background: white
  padding: 20px
  border-radius: 8px
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)
}`,
        type: "css",
      });

      // Generate HTML
      files.push({
        path: "public/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${config.businessName}</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`,
        type: "html",
      });

      // Generate feature-specific files
      config.selectedFeatures.forEach((feature) => {
        switch (feature) {
          case "auth":
            files.push({
              path: "src/components/AuthForm.js",
              content: `// Missing React import (will be auto-fixed)
const AuthForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input type=email placeholder="Email" required>
      <input type=password placeholder="Password" required>
      <button type=submit>Login</button>
    </form>
  );
};

export default AuthForm;`,
              type: "javascript",
            });
            break;
          case "gallery":
            files.push({
              path: "src/components/Gallery.js",
              content: `// Gallery component with JSX issues
const Gallery = ({ images = [] }) => {
  return (
    <div className=gallery>
      <h2>Photo Gallery</h2>
      <div className=gallery-grid>
        {images.map((image, index) => (
          <img key={index} src={image.url} alt={image.title}>
        ))}
      </div>
    </div>
  );
};

export default Gallery;`,
              type: "javascript",
            });
            break;
          case "contact-form":
            files.push({
              path: "src/components/ContactForm.js",
              content: `// Contact form with attribute issues
const ContactForm = () => {
  return (
    <div className=contact-form>
      <h2>Contact Us</h2>
      <form>
        <input type=text placeholder="Name" required>
        <input type=email placeholder="Email" required>
        <textarea placeholder="Message" rows=5 required></textarea>
        <button type=submit>Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;`,
              type: "javascript",
            });
            break;
        }
      });

      return files;
    },
    [],
  );

  // Handle project generation
  const handleGenerateProject = useCallback(async () => {
    setGenerationStep("generate");

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const files = generateProjectFiles(projectConfig);
    setProjectFiles(files);
    setGenerationStep("validate");

    // Auto-run enhanced validation
    setTimeout(() => {
      validateProject(files, projectConfig);
    }, 500);
  }, [projectConfig, generateProjectFiles, validateProject]);

  // Handle validation completion
  const handleValidationComplete = useCallback(() => {
    if (isReady) {
      setGenerationStep("complete");
    }
  }, [isReady]);

  // Handle starting over
  const handleStartOver = useCallback(() => {
    setGenerationStep("config");
    setProjectFiles([]);
    clearResults();
    setShowSuccessMessage(false);
  }, [clearResults]);

  // Handle config changes
  const handleConfigChange = useCallback((updates: Partial<ProjectConfig>) => {
    setProjectConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="pwa-generator-with-validation">
      <div className="generator-header">
        <h1>🚀 PWA Generator with Enhanced Validation</h1>
        <p>
          Experience zero manual issues with our revolutionary validation system
        </p>

        {/* Progress indicator */}
        <div className="progress-indicator">
          <div
            className={`step ${generationStep === "config" ? "active" : "completed"}`}
          >
            1. Configure
          </div>
          <div
            className={`step ${generationStep === "generate" ? "active" : generationStep === "validate" || generationStep === "complete" ? "completed" : ""}`}
          >
            2. Generate
          </div>
          <div
            className={`step ${generationStep === "validate" ? "active" : generationStep === "complete" ? "completed" : ""}`}
          >
            3. Validate
          </div>
          <div
            className={`step ${generationStep === "complete" ? "active" : ""}`}
          >
            4. Complete
          </div>
        </div>
      </div>

      {/* Success message banner */}
      {showSuccessMessage && (
        <div className="success-banner">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <div>
              <h3>Zero Manual Issues Achieved!</h3>
              <p>
                Your project is production-ready and can be downloaded
                immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Step */}
      {generationStep === "config" && (
        <div className="config-section">
          <h2>Project Configuration</h2>
          <div className="config-form">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={projectConfig.projectName}
                onChange={(e) =>
                  handleConfigChange({ projectName: e.target.value })
                }
                placeholder="Enter project name"
              />
            </div>

            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                value={projectConfig.businessName}
                onChange={(e) =>
                  handleConfigChange({
                    businessName: e.target.value,
                    businessData: {
                      ...projectConfig.businessData,
                      name: e.target.value,
                    },
                  })
                }
                placeholder="Enter business name"
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <select
                value={projectConfig.industry}
                onChange={(e) =>
                  handleConfigChange({ industry: e.target.value })
                }
              >
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Selected Features</label>
              <div className="features-grid">
                {[
                  "auth",
                  "gallery",
                  "contact-form",
                  "payments",
                  "analytics",
                  "chat",
                ].map((feature) => (
                  <label key={feature} className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={projectConfig.selectedFeatures.includes(feature)}
                      onChange={(e) => {
                        const updatedFeatures = e.target.checked
                          ? [...projectConfig.selectedFeatures, feature]
                          : projectConfig.selectedFeatures.filter(
                              (f) => f !== feature,
                            );
                        handleConfigChange({
                          selectedFeatures: updatedFeatures,
                        });
                      }}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleGenerateProject}
            >
              Generate PWA Project
            </button>
          </div>
        </div>
      )}

      {/* Generation Step */}
      {generationStep === "generate" && (
        <div className="generation-section">
          <div className="generation-status">
            <div className="status-icon">⚡</div>
            <h2>Generating Your PWA Project...</h2>
            <p>Creating project files with selected features</p>
            <div className="loading-bar">
              <div className="loading-fill"></div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Step */}
      {(generationStep === "validate" || generationStep === "complete") && (
        <div className="validation-section">
          <EnhancedValidationPanel
            validationResult={validationResult || undefined}
            isValidating={isValidating}
            onValidate={() => validateProject(projectFiles, projectConfig)}
            onClearResults={clearResults}
            appliedFixes={appliedFixes}
            generatedFiles={generatedFiles}
          />

          {/* Project stats */}
          <div className="project-stats">
            <h3>Project Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{projectFiles.length}</div>
                <div className="stat-label">Files Generated</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {projectConfig.selectedFeatures.length}
                </div>
                <div className="stat-label">Features Included</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{successRate}%</div>
                <div className="stat-label">Auto-Fix Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{isReady ? "✅" : "⏳"}</div>
                <div className="stat-label">Production Ready</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="section-actions">
            {isReady && (
              <button
                className="btn btn-success btn-large"
                onClick={handleValidationComplete}
              >
                Download Project
              </button>
            )}
            <button className="btn btn-secondary" onClick={handleStartOver}>
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {generationStep === "complete" && (
        <div className="complete-section">
          <div className="completion-message">
            <div className="completion-icon">🎯</div>
            <h2>Mission Accomplished!</h2>
            <p>Your PWA project has been generated with zero manual issues</p>

            <div className="achievement-details">
              <h3>What was achieved:</h3>
              <ul>
                <li>
                  ✅ {validationResult?.autoFixedCount || 0} issues
                  automatically fixed
                </li>
                <li>
                  ✅ {validationResult?.preventedIssuesCount || 0} issues
                  prevented
                </li>
                <li>✅ 0 manual fixes required</li>
                <li>✅ Production-ready output generated</li>
              </ul>
            </div>

            <div className="next-steps">
              <h3>Next Steps:</h3>
              <ol>
                <li>Download your project files</li>
                <li>
                  Run <code>npm install</code>
                </li>
                <li>
                  Run <code>npm start</code>
                </li>
                <li>Start developing!</li>
              </ol>
            </div>

            <div className="completion-actions">
              <button className="btn btn-primary btn-large">
                Download Project
              </button>
              <button className="btn btn-secondary" onClick={handleStartOver}>
                Generate Another Project
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pwa-generator-with-validation {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .generator-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .generator-header h1 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .generator-header p {
          font-size: 1.1rem;
          color: #6b7280;
        }

        .progress-indicator {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .step {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          background: #f3f4f6;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .step.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          transform: scale(1.05);
        }

        .step.completed {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .success-banner {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .success-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          font-size: 2rem;
        }

        .config-section,
        .validation-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .config-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .feature-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .generation-section {
          text-align: center;
          padding: 60px 20px;
        }

        .generation-status {
          max-width: 400px;
          margin: 0 auto;
        }

        .status-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .loading-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 20px;
        }

        .loading-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          animation: loading 2s infinite;
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .project-stats {
          margin: 30px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .section-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 30px;
        }

        .complete-section {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .completion-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .achievement-details,
        .next-steps {
          text-align: left;
          max-width: 500px;
          margin: 30px auto;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .completion-actions {
          margin-top: 30px;
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .pwa-generator-with-validation {
            padding: 16px;
          }

          .generator-header h1 {
            font-size: 2rem;
          }

          .progress-indicator {
            flex-direction: column;
            align-items: center;
          }

          .section-actions,
          .completion-actions {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default PWAGeneratorWithValidation;
