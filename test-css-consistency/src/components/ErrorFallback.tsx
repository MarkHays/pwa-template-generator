import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We're sorry, but something unexpected happened.</p>
      <button onClick={resetErrorBoundary} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;