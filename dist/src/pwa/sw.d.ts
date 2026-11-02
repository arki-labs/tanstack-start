export type OfflineNavigationOptions = {
    /**
     * URL of the document served when an offline navigation targets a page
     * that has never been cached. This is the "app shell": it is warmed into
     * the navigation cache at SW install time, and offline requests for
     * unknown URLs are redirected to it so the client router hydrates at a
     * URL whose document actually exists in the cache.
     * @default '/'
     */
    fallbackUrl?: string;
    /**
     * Cache storage name for navigation documents.
     * @default 'app-navigations'
     */
    cacheName?: string;
    /**
     * How long the network gets before NetworkFirst falls back to the cached
     * copy of the page (slow/flaky connections).
     * @default 5
     */
    networkTimeoutSeconds?: number;
    /**
     * Navigations whose URL (pathname + search) matches any of these patterns
     * bypass the offline handler entirely. API routes and auth flows must
     * never be answered with a cached HTML document.
     * @default [/^\/api\//]
     */
    denylist?: RegExp[];
    /**
     * Optional allowlist — when provided, only matching navigations are
     * handled. Useful to scope offline support to the app surface and leave
     * marketing pages on plain network behaviour.
     */
    allowlist?: RegExp[];
    /**
     * HTML served as the last resort, when even the fallback document is not
     * cached (e.g. first install raced an offline window). Override to brand
     * it; the default is a minimal neutral page linking to `fallbackUrl`.
     */
    offlineHtml?: string;
    /**
     * When true (default), the SW calls `skipWaiting()` and `clients.claim()`
     * so a fresh install immediately controls open pages — required for the
     * very first offline window after install, and the documented contract
     * for vite-plugin-pwa's `registerType: 'autoUpdate'` with
     * `strategies: 'injectManifest'`. Pass `false` to manage activation
     * yourself.
     * @default true
     */
    takeControl?: boolean;
};
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
export declare function setupOfflineNavigation(options?: OfflineNavigationOptions): void;
//# sourceMappingURL=sw.d.ts.map