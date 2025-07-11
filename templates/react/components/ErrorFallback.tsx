import React from 'react';
import './ErrorFallback.css';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-fallback">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title">Something went wrong</h1>
        <p className="error-message">
          We're sorry, but something unexpected happened. Please try one of the options below.
        </p>

        <details className="error-details">
          <summary>Technical Details</summary>
          <pre className="error-stack">
            {error.message}
            {process.env.NODE_ENV === 'development' && (
              <>
                <br />
                <br />
                {error.stack}
              </>
            )}
          </pre>
        </details>

        <div className="error-actions">
          <button
            onClick={resetErrorBoundary}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={handleReload}
            className="btn btn-secondary"
          >
            Reload Page
          </button>
          <button
            onClick={handleGoHome}
            className="btn btn-secondary"
          >
            Go Home
          </button>
        </div>

        <div className="error-help">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
