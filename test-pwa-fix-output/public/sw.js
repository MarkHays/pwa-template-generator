// Minimal Development-Only Service Worker
// This SW is designed to not interfere with development

self.addEventListener('install', () => {
  // Install immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip ALL development-related requests to avoid interference
  const url = event.request.url;

  // Skip Vite development files
  if (url.includes('/@vite/') ||
      url.includes('/@react-refresh') ||
      url.includes('/@fs/') ||
      url.includes('?import') ||
      url.includes('?direct') ||
      url.includes('?worker') ||
      url.includes('hot-update') ||
      url.includes('node_modules') ||
      url.includes('.vite/')) {
    return; // Let browser handle these normally
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For everything else, just pass through to network
  // No caching in development to avoid conflicts
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return; // Skip all caching in development
  }

  // Only cache in production
  event.respondWith(
    fetch(event.request).catch(() => {
      // Simple offline fallback only for navigation
      if (event.request.mode === 'navigate') {
        return new Response('App offline', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    })
  );
});