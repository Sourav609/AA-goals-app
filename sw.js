const CACHE_NAME = "weekly-goal-cache-v1";
const urlsToCache = [
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "alarm.mp3",
  "icon.png"
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});