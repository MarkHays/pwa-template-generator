import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import './styles/main.css';

// Components
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorFallback } from './components/ErrorFallback';
import Navigation from './components/Navigation';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
{{#if gallery}}
const Gallery = lazy(() => import('./pages/Gallery'));
{{/if}}
{{#if testimonials}}
const Testimonials = lazy(() => import('./pages/Testimonials'));
{{/if}}
{{#if auth}}
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
{{/if}}
{{#if reviews}}
const Reviews = lazy(() => import('./pages/Reviews'));
{{/if}}

// Types
interface AppState {
  isOnline: boolean;
  installPrompt: any;
  isInstalled: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isOnline: navigator.onLine,
    installPrompt: null,
    isInstalled: false
  });

  // PWA install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setAppState(prev => ({ ...prev, installPrompt: e }));
    };

    const handleAppInstalled = () => {
      setAppState(prev => ({ ...prev, isInstalled: true, installPrompt: null }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setAppState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setAppState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Error boundary handler
  const handleError = (error: Error, errorInfo: any) => {
    console.error('App Error:', error, errorInfo);
  };

  // Install PWA handler
  const handleInstallClick = async () => {
    if (appState.installPrompt) {
      const result = await appState.installPrompt.prompt();
      setAppState(prev => ({ ...prev, installPrompt: null }));
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      <Router>
        <div className={`app ${!appState.isOnline ? 'offline' : ''}`}>
          <Navigation />

          {!appState.isOnline && (
            <div className="offline-banner" role="banner">
              <p>You're currently offline. Some features may be limited.</p>
            </div>
          )}

          <main className="main-content" role="main">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                {{#if gallery}}
                <Route path="/gallery" element={<Gallery />} />
                {{/if}}
                {{#if testimonials}}
                <Route path="/testimonials" element={<Testimonials />} />
                {{/if}}
                {{#if auth}}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                {{/if}}
                {{#if reviews}}
                <Route path="/reviews" element={<Reviews />} />
                {{/if}}
                <Route path="*" element={
                  <div className="not-found">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>

          {{#if pwa}}
          {appState.installPrompt && (
            <div className="install-prompt">
              <button onClick={handleInstallClick} className="install-button">
                Install {{projectName}} App
              </button>
            </div>
          )}
          {{/if}}
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
