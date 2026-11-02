/**
 * Keep one user's offline caches away from the next user on the same device.
 * Re-exported from `@arki/tanstack-start/pwa/client`.
 */
/**
 * Delete the service worker's user-tied caches when the signed-in user is not
 * the one they were filled for.
 *
 * The service worker keeps pages and API answers so they work offline, and
 * those hold the signed-in user's data. Call this with the user id whenever
 * the session is known, and with `null` on sign-out and account deletion. It
 * deletes every cache except the Workbox precache (built static files) when
 * the user differs from the one recorded, which covers a sign-out, a deleted
 * account, and a new session that replaced an expired one without a sign-out.
 *
 * Who filled the caches is recorded in Cache Storage itself, so it survives
 * a sign-out and lives and dies with the caches it describes. It holds only
 * the user id. Without Cache Storage (no service worker support, insecure
 * origin) there is nothing to delete, and this does nothing.
 *
 * Resolves `true` when the caches belonged to another known user, so the app
 * drops that user's other offline data (such as a persisted query cache) on
 * the same decision. A sign-in with no user recorded resolves `false`: the
 * caches are dropped (they could be anyone's), but the page already showing
 * belongs to the user who is signed in, so it must not be blanked.
 */
export declare function clearCachesOnUserChange(userId: string | null): Promise<boolean>;
/**
 * Run {@link clearCachesOnUserChange} whenever the session's user changes.
 * Pass `undefined` while the session is still loading, so a page that has not
 * learned who is signed in never clears the caches.
 */
export declare function useClearCachesOnUserChange(userId: string | null | undefined): void;
//# sourceMappingURL=user-caches.d.ts.map