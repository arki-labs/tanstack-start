/**
 * Zero-dependency bridge that lets shared package code call
 * `captureException` without statically importing `@sentry/*`.
 *
 * The Sentry init helpers (`sentry-client.ts`, `sentry-server.ts`) push
 * `Sentry.captureException` into the bridge after `Sentry.init` runs. Any
 * call to `captureException` before registration is a silent no-op, which
 * matches Sentry's own behavior when the SDK hasn't been initialized.
 *
 * This module MUST NOT import from `@sentry/*` so that apps which never
 * opt into Sentry don't pull the SDK into their bundle.
 */
const REGISTRY_KEY = Symbol.for('@arki/tanstack-start.captureHandler');
function getRegistry() {
    const carrier = globalThis;
    let registry = carrier[REGISTRY_KEY];
    if (!registry) {
        registry = { handler: null };
        carrier[REGISTRY_KEY] = registry;
    }
    return registry;
}
/**
 * Register a Sentry-compatible capture handler. Called by the opt-in
 * `initSentryClient` / `initSentryServer` helpers after `Sentry.init`.
 */
export function registerSentryCapture(handler) {
    getRegistry().handler = handler;
}
/**
 * Forward an exception to the registered handler. No-op when Sentry has
 * not been initialized.
 */
export function captureException(error, hint) {
    const { handler } = getRegistry();
    if (!handler)
        return;
    try {
        handler(error, hint);
    }
    catch {
        // Handler must never throw out of this codepath.
    }
}
//# sourceMappingURL=sentry-bridge.js.map