import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Register service worker with development-friendly error handling
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    // Clear old service worker caches first
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes('pwa-cache') || cacheName.includes('pwa-generator')) {
            caches.delete(cacheName);
            console.log('🧹 Cleared old cache:', cacheName);
          }
        });
      });
    }

    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
        });
      })
      .catch((error) => {
        // Only log as warning in development, not as error
        if (window.location.hostname === 'localhost') {
          console.warn('⚠️ Service Worker registration failed (development):', error.message);
        } else {
          console.error('❌ Service Worker registration failed:', error);
        }
      });
  });
} else if ('serviceWorker' in navigator) {
  console.info('ℹ️ Service Worker not registered (requires HTTPS or localhost)');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)