/**
 * Register the app's service worker.
 *
 * Call this once from `entry-client.tsx` after `hydrateRoot`. Safe to call
 * in non-browser contexts: the function bails out when `navigator` or the
 * `serviceWorker` API is unavailable.
 *
 * Also installs stale-chunk recovery (see {@link registerStaleChunkReload}),
 * which runs regardless of service-worker support.
 *
 * @example
 * ```tsx
 * // apps/myapp/start/src/entry-client.tsx
 * import { registerPwa } from '@arki/tanstack-start/pwa/client';
 * registerPwa();
 * ```
 */
export { clearCachesOnUserChange, useClearCachesOnUserChange } from './user-caches.js';
export type RegisterPwaOptions = {
    /** Apply pending updates without waiting for a reload. Default: true. */
    immediate?: boolean;
    /** Called when a new SW version is waiting to take over. */
    onNeedRefresh?: () => void;
    /** Called when the SW has finished its first install. */
    onOfflineReady?: () => void;
    /** Called once the SW script has registered. */
    onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
    /** Called when registration fails. */
    onRegisterError?: (error: unknown) => void;
};
export declare function registerPwa(options?: RegisterPwaOptions): void;
/**
 * Recover from stale dynamic-import chunks after a deploy.
 *
 * Each deploy ships a fresh build whose hashed chunks replace the previous
 * build's; the old `/assets/<hash>.js` files are deleted. A client still
 * running the previous document will lazy-load one of those now-missing
 * chunks, the server returns the HTML fallback (404), and Vite raises a
 * `vite:preloadError`. We force a single full reload so the browser fetches
 * the current document and its live chunk hashes.
 *
 * A short-lived `sessionStorage` timestamp prevents a reload loop when a
 * chunk is genuinely gone rather than merely renamed, while still allowing a
 * later deploy in the same tab to recover.
 */
export declare function registerStaleChunkReload(): void;
//# sourceMappingURL=client.d.ts.map