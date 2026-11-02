/**
 * Server-side Sentry initialization for TanStack Start apps.
 *
 * Call once at the top of `src/entry-server.ts(x)` before any other
 * imports — Sentry's Node SDK relies on instrumenting modules at load
 * time. Importing the router or business logic before `initSentryServer`
 * means those modules won't be wrapped.
 *
 * `sentryGlobalRequestMiddleware`, `sentryGlobalFunctionMiddleware`, and
 * `wrapMiddlewaresWithSentry` from `@sentry/tanstackstart-react` are
 * re-exported for convenience — apps wire them into TanStack Start's
 * global middleware registry to instrument server functions and route
 * loaders.
 *
 * Sentry is **opt-in via DSN**. When `dsn` is missing, empty, whitespace-only,
 * or causes `Sentry.init` to throw (e.g. malformed URL), `initSentryServer`
 * silently disables Sentry for the app. That lets every app call this
 * unconditionally — `initSentryServer({ dsn: process.env.SENTRY_DSN })` —
 * with Sentry activating only when a valid DSN is actually set.
 */
import type { Integration } from '@sentry/core';
import * as Sentry from '@sentry/node';
export type InitSentryServerOptions = {
    /**
     * Sentry DSN. When missing, empty, whitespace-only, or malformed,
     * `initSentryServer` is a silent no-op. Typically set via
     * `process.env.SENTRY_DSN`.
     */
    dsn?: string | null;
    environment?: string;
    release?: string;
    /** Server-side tracing rate. Defaults to `1.0` in dev, `0.1` in prod. */
    tracesSampleRate?: number;
    /** Extra integrations merged with defaults. */
    integrations?: Integration[];
};
export declare function initSentryServer(options: InitSentryServerOptions): void;
export { sentryGlobalFunctionMiddleware, sentryGlobalRequestMiddleware, wrapFetchWithSentry, wrapMiddlewaresWithSentry, } from '@sentry/tanstackstart-react';
export { Sentry };
//# sourceMappingURL=sentry-server.d.ts.map