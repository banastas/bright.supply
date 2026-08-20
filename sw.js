/**
 * bright.supply service worker.
 * Core assets are precached. HTML navigations prefer the network and retain a
 * route-specific offline copy after the first visit.
 */

const CACHE_NAME = 'bright-supply-v3.0.0';
const STATIC_FILES = [
    '/',
    '/white/',
    '/black/',
    '/red/',
    '/blue/',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/assets/images/bright.supply.png',
    '/assets/images/readme.png',
    '/robots.txt',
    '/sitemap.xml'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

const cacheResponse = async (request, response) => {
    if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
    }
    return response;
};

const handleNavigation = async (request) => {
    try {
        return await cacheResponse(request, await fetch(request));
    } catch (error) {
        return (await caches.match(request)) || (await caches.match('/')) || Response.error();
    }
};

const handleAsset = async (request) => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        return await cacheResponse(request, await fetch(request));
    } catch (error) {
        return Response.error();
    }
};

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;
    event.respondWith(
        event.request.mode === 'navigate'
            ? handleNavigation(event.request)
            : handleAsset(event.request)
    );
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
