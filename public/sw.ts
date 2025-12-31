/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "ng-v1";
const STATIC_CACHE = "ng-static-v1";

const STATIC_ASSETS = ["/", "/manifest.json", "/favicon.ico"];

// Install event - cache static assets
self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(STATIC_ASSETS);
    })(),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    })(),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // Skip API requests and other dynamic content
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async (): Promise<Response> => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      if (cached) {
        // Return cached response and update in background
        fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        });
        return cached;
      }

      // Fetch from network and cache
      try {
        const response = await fetch(request);
        if (response.ok && request.url.startsWith(self.location.origin)) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        // Network failed, try to return cached version or offline fallback
        const fallback = await cache.match(request);
        if (fallback) return fallback;

        // Return offline fallback for HTML pages
        if (request.headers.get("accept")?.includes("text/html")) {
          const rootFallback = await caches.match("/");
          if (rootFallback) return rootFallback;
        }

        throw new Error("Network request failed and no cache available");
      }
    })(),
  );
});

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      })(),
    );
  }
});

export {};
