const CACHE_NAME = 'expiry-tracker-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/maskable_icon.png'
]

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event handler
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  if (event.request.url.endsWith('/api/check-expiring-products')) {
    event.respondWith(handleCheckExpiringProducts())
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone()

        // Make network request and cache the response
        return fetch(fetchRequest).then((response) => {
          // Check if response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone()

          // Cache the response in dynamic cache
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
  )
})

// Handle background sync for notifications
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-expiring-products') {
    event.waitUntil(checkExpiringProducts())
  }
})

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = event.data.json()
  event.waitUntil(
    self.registration.showNotification('Product Expiry Summary', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})

async function checkExpiringProducts() {
  try {
    const response = await fetch('/api/check-expiring-products')
    const data = await response.json()
    
    if (data.shouldNotify) {
      await self.registration.showNotification('Product Expiry Summary', {
        body: data.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'daily-summary'
      })
    }
  } catch (error) {
    console.error('Error checking expiring products:', error)
  }
}

async function handleCheckExpiringProducts() {
  try {
    const response = await fetch('/api/check-expiring-products')
    const data = await response.json()
    
    if (data.shouldNotify) {
      await self.registration.showNotification('Product Expiry Summary', {
        body: data.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'daily-summary'
      })
    }
  } catch (error) {
    console.error('Error checking expiring products:', error)
  }
} 