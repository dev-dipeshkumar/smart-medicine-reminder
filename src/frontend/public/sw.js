// MediRemind Service Worker — Cache-First for static, Network-First for API
// v3: Offline reminder notifications via IndexedDB + periodic polling
const CACHE_NAME = 'mediremind-v3';

// ------------- IndexedDB helpers -------------
const DB_NAME = 'mediremind-offline';
const STORE_NAME = 'reminders';

/** Open (or create) the IndexedDB database */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** Replace all reminders in the store */
function cacheReminders(reminders) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      for (const r of reminders) {
        store.put(r);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  });
}

/** Read all reminders from the store */
function getAllCachedReminders() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = (e) => resolve(e.target.result ?? []);
      req.onerror = (e) => reject(e.target.error);
    });
  });
}

// Tracks reminder IDs already fired today (key: id + date) — resets on SW restart
const firedToday = new Set();

/** Poll for due reminders and fire notifications */
function pollReminders() {
  getAllCachedReminders()
    .then((reminders) => {
      if (!reminders || reminders.length === 0) return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hh}:${mm}`;
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      for (const reminder of reminders) {
        if (!reminder.isActive) continue;
        if (reminder.scheduledTime !== currentHHMM) continue;

        const fireKey = `${reminder.id}_${today}`;
        if (firedToday.has(fireKey)) continue;
        firedToday.add(fireKey);

        self.registration.showNotification('Medicine Reminder', {
          body: `Time to take ${reminder.medicineName} — ${reminder.dosage}`,
          icon: '/icons/icon-192x192.png',
          badge: '/pwa-192.svg',
          tag: `mediremind-${reminder.id}`,
          renotify: true,
          requireInteraction: false,
          data: { url: '/reminders' },
          actions: [{ action: 'open', title: 'Open App' }],
        }).catch((err) => {
          console.warn('[MediRemind SW] showNotification failed:', err);
        });
      }
    })
    .catch((err) => {
      console.warn('[MediRemind SW] pollReminders error:', err);
    });
}

// Start polling every 60 seconds
setInterval(pollReminders, 60_000);

// ------------- Core cache events -------------

// Shell assets to pre-cache on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/pwa-192.svg',
  '/pwa-512.svg',
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {
        // Silently ignore individual asset failures during install
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: remove outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Message: accept CACHE_REMINDERS from the app page
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'CACHE_REMINDERS') {
    const reminders = event.data.reminders;
    if (Array.isArray(reminders)) {
      cacheReminders(reminders).catch((err) => {
        console.warn('[MediRemind SW] Failed to cache reminders:', err);
      });
    }
  }
});

// Fetch: Cache-First for static assets, Network-First for everything else
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and http/https requests
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // Network-First for API/canister calls (ic0.app, icp0.io, non-GET)
  const isApiCall =
    url.hostname.includes('ic0.app') ||
    url.hostname.includes('icp0.io') ||
    url.hostname.includes('api.fda.gov') ||
    url.hostname.includes('huggingface.co') ||
    request.method !== 'GET';

  if (isApiCall) {
    // Network-First: try network, fall back to cache if offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-First for static assets (JS, CSS, images, fonts, SVGs)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      });
    })
  );
});

// Push: show a notification when a push message arrives from the server
self.addEventListener('push', (event) => {
  let data = {
    notification: {
      title: 'MediRemind',
      body: 'Time to take your medicine!',
      icon: '/favicon.ico',
      badge: '/pwa-192.svg',
      data: { url: '/' },
    },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.notification.body = event.data.text();
    }
  }

  const n = data.notification;
  event.waitUntil(
    self.registration.showNotification(n.title ?? 'MediRemind', {
      body: n.body ?? 'Time to take your medicine!',
      icon: n.icon ?? '/favicon.ico',
      badge: n.badge ?? '/pwa-192.svg',
      data: n.data ?? { url: '/' },
      actions: [{ action: 'open', title: 'Open App' }],
      requireInteraction: false,
      tag: 'mediremind-reminder',
      renotify: true,
    })
  );
});

// Notification click: focus existing window or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Push subscription change: re-subscribe and notify clients
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true })
      .then((subscription) => {
        // Notify all clients so they can re-register with the backend
        self.clients.matchAll().then((clients) => {
          for (const client of clients) {
            client.postMessage({
              type: 'PUSH_SUBSCRIPTION_CHANGED',
              subscription: JSON.stringify(subscription),
            });
          }
        });
      })
  );
});
