/* VEDHA service worker — mobile-first caching for SSR app */
const VERSION = "vedha-pwa-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const IMAGES = `${VERSION}-images`;
const FONTS = `${VERSION}-fonts`;

const PRECACHE_URLS = [
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

const isSameOrigin = (url) => url.origin === self.location.origin;
const isNav = (request) => request.mode === "navigate";
const isAdminOrApi = (pathname) =>
  pathname.startsWith("/api/") ||
  pathname.startsWith("/admin") ||
  pathname.includes("/_image");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("vedha-pwa-") && !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function networkFirstPage(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return (await caches.match("/offline.html")) || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept non-GET or cross-origin video/CDN unless fonts/images we care about
  if (!isSameOrigin(url) && !url.hostname.includes("fonts.g") && !url.hostname.includes("fonts.googleapis.com") && !url.hostname.includes("fonts.gstatic.com")) {
    return;
  }

  if (isSameOrigin(url) && isAdminOrApi(url.pathname)) return;

  // App shell navigations
  if (isNav(request) && isSameOrigin(url)) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  // Google fonts
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(staleWhileRevalidate(request, FONTS));
    return;
  }

  if (!isSameOrigin(url)) return;

  // Skip large media — keep install storage lean on phones
  if (url.pathname.startsWith("/videos/") || /\.(?:mp4|webm|mov)$/i.test(url.pathname)) {
    return;
  }

  // Static image assets
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    /\.(?:png|jpg|jpeg|webp|svg|gif|avif|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, IMAGES));
    return;
  }

  if (/\.(?:js|css|woff2?|ttf|otf|webmanifest)$/i.test(url.pathname) || url.pathname.startsWith("/_astro/")) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME));
    return;
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
