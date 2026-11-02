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
export type CaptureHint = {
    contexts?: Record<string, unknown>;
    tags?: Record<string, string | number | boolean>;
    extra?: Record<string, unknown>;
};
export type CaptureHandler = (error: unknown, hint?: CaptureHint) => void;
/**
 * Register a Sentry-compatible capture handler. Called by the opt-in
 * `initSentryClient` / `initSentryServer` helpers after `Sentry.init`.
 */
export declare function registerSentryCapture(handler: CaptureHandler): void;
/**
 * Forward an exception to the registered handler. No-op when Sentry has
 * not been initialized.
 */
export declare function captureException(error: unknown, hint?: CaptureHint): void;
//# sourceMappingURL=sentry-bridge.d.ts.map