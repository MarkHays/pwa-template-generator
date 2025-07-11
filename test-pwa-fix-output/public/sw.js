// Service Worker
const CACHE_NAME = 'pwa-generator-static-v1';
const DYNAMIC_CACHE = 'pwa-generator-dynamic-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core files');
        // Cache files individually with error handling
        const cachePromises = [
          '/',
          '/manifest.json',
          '/favicon.svg'
        ].map(url => {
          return cache.add(url).catch(err => {
            console.warn('Failed to cache:', url, err);
            return Promise.resolve(); // Continue even if one fails
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('Service Worker installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip hot reload requests in development
  if (event.request.url.includes('/@vite/') ||
      event.request.url.includes('/@react-refresh') ||
      event.request.url.includes('?import') ||
      event.request.url.includes('?direct')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses for static assets
            if (response.status === 200 && response.type === 'basic') {
              // Only cache certain file types to avoid caching issues
              const url = new URL(event.request.url);
              if (url.pathname.endsWith('.js') ||
                  url.pathname.endsWith('.css') ||
                  url.pathname.endsWith('.png') ||
                  url.pathname.endsWith('.svg') ||
                  url.pathname.endsWith('.json')) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    console.log('Service Worker: Caching dynamic resource:', event.request.url);
                    cache.put(event.request, responseClone);
                  })
                  .catch(err => {
                    console.warn('Failed to cache resource:', event.request.url, err);
                  });
              }
            }
            return response;
          })
          .catch((error) => {
            console.warn('Fetch failed:', event.request.url, error);
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/').then(response => {
                return response || new Response('Offline', {
                  status: 200,
                  headers: { 'Content-Type': 'text/html' }
                });
              });
            }
            return new Response('Network error', { status: 503 });
          });
      })
  );
});