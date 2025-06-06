// Service Worker for SoloBoss AI
// Provides offline support and caching

const CACHE_NAME = 'soloboss-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/fonts.css',
  '/assets/css/components.css',
  '/assets/css/performance.css',
  '/assets/js/app.js',
  '/assets/js/storage-manager.js',
  '/assets/js/error-handler.js',
  '/assets/js/accessibility.js',
  '/assets/js/security.js',
  '/assets/images/logo.png',
  '/assets/images/favicon-32x32.png',
  '/assets/images/favicon-16x16.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});