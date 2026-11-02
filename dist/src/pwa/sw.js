/// <reference lib="webworker" />
/**
 * Shared service-worker base for TanStack Start apps.
 *
 * Each app's `src/service-worker.ts` should `import` this module as a
 * side-effect. Apps that need extra behaviour (push notifications, custom
 * fetch handlers, background sync) can add their own listeners after the
 * import.
 *
 * @example
 * ```ts
 * // apps/myapp/start/src/service-worker.ts
 * import '@arki/tanstack-start/pwa/sw';
 * ```
 *
 * Apps that want document navigations to keep working offline (app-shell
 * fallback) additionally call {@link setupOfflineNavigation}:
 *
 * @example
 * ```ts
 * import { setupOfflineNavigation } from '@arki/tanstack-start/pwa/sw';
 * setupOfflineNavigation({ fallbackUrl: '/dashboard' });
 * ```
 */
import { precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
// Precache only inside a service worker. Anywhere else (an SSR pass, a test, a
// plain `import` in Node or Bun) there is no build manifest and no worker scope.
if (typeof ServiceWorkerGlobalScope !== 'undefined' && self instanceof ServiceWorkerGlobalScope) {
    precacheAndRoute(self.__WB_MANIFEST);
}
function defaultOfflineHtml(fallbackUrl) {
    return [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        '<title>Offline</title>',
        '<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100dvh;margin:0;background:#f5f5f4;color:#1c1917}main{text-align:center;padding:2rem}a{color:inherit}</style>',
        '</head>',
        '<body><main>',
        '<h1>You&rsquo;re offline</h1>',
        '<p>This page hasn&rsquo;t been saved for offline use yet.</p>',
        `<p><a href="${fallbackUrl}">Go to the app</a></p>`,
        '</main></body>',
        '</html>',
    ].join('');
}
/**
 * Register an offline-capable handler for document navigations.
 *
 * Strategy:
 * - **Online**: NetworkFirst — every successfully fetched page document is
 *   cached, so previously visited pages survive going offline.
 * - **Offline, page visited before**: the cached document for that exact URL
 *   is served — clean hydration, no URL mismatch.
 * - **Offline, page never visited**: the navigation is redirected (302) to
 *   `fallbackUrl`, whose document was warmed into the cache at install time.
 *   The app boots there and client-side routing + any persisted data layer
 *   (e.g. an IndexedDB-backed query cache) take over without further
 *   document requests.
 * - **Offline, fallback missing too**: a minimal offline page is served.
 *
 * Call once, after importing this module, from the app's service worker.
 */
export function setupOfflineNavigation(options = {}) {
    const { fallbackUrl = '/', cacheName = 'app-navigations', networkTimeoutSeconds = 5, denylist = [/^\/api\//], allowlist, offlineHtml = defaultOfflineHtml(fallbackUrl), takeControl = true, } = options;
    if (takeControl) {
        void self.skipWaiting();
        self.addEventListener('activate', (event) => {
            event.waitUntil(self.clients.claim());
        });
    }
    // Warm the app shell so the fallback works even if the user goes offline
    // before ever loading `fallbackUrl`. `cache: 'reload'` bypasses the HTTP
    // cache; failures (offline install, non-200) must not fail the install.
    self.addEventListener('install', (event) => {
        event.waitUntil((async () => {
            try {
                const cache = await self.caches.open(cacheName);
                const response = await fetch(new Request(fallbackUrl, { cache: 'reload' }));
                if (response.ok) {
                    await cache.put(fallbackUrl, response);
                }
            }
            catch {
                // Offline during install — the runtime cache will fill in later.
            }
        })());
    });
    const strategy = new NetworkFirst({ cacheName, networkTimeoutSeconds });
    const fallbackPath = new URL(fallbackUrl, self.location.origin).pathname;
    const offlineResponse = () => new Response(offlineHtml, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
    registerRoute(new NavigationRoute(async (params) => {
        try {
            return await strategy.handle(params);
        }
        catch {
            const cache = await self.caches.open(cacheName);
            const fallback = await cache.match(fallbackUrl, { ignoreSearch: true });
            const requestedPath = new URL(params.request.url).pathname;
            if (requestedPath === fallbackPath) {
                return fallback ?? offlineResponse();
            }
            // Redirect instead of serving the shell document at a foreign URL:
            // the browser re-navigates to `fallbackUrl`, whose cached document
            // hydrates at its own URL (no SSR/router location mismatch).
            return fallback ? Response.redirect(fallbackUrl, 302) : offlineResponse();
        }
    }, { ...(allowlist ? { allowlist } : {}), denylist }));
}
//# sourceMappingURL=sw.js.map