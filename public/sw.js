const CACHE = "sbl-v1"
const OFFLINE_URL = "/offline"

const APP_SHELL = [
  "/",
  "/dashboard",
  "/offline",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Skip non-GET and browser-extension requests
  if (request.method !== "GET" || !request.url.startsWith("http")) return

  const url = new URL(request.url)

  // Network-first for API / Supabase / Next server actions
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("supabase.co") ||
    request.headers.get("next-action")
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  // Cache-first for static assets (_next/static)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
          return res
        })
      })
    )
    return
  }

  // Stale-while-revalidate for pages
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone())
          return res
        }).catch(() => cached || caches.match(OFFLINE_URL))
        return cached || networkFetch
      })
    )
  )
})
