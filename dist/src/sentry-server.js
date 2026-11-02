import * as Sentry from '@sentry/node';
import { registerSentryCapture } from './sentry-bridge.js';
import { sentryDataCollection } from './sentry-data-collection.js';
const isDev = process.env.NODE_ENV !== 'production';
export function initSentryServer(options) {
    const { dsn, environment = process.env.NODE_ENV ?? 'development', release, tracesSampleRate = isDev ? 1.0 : 0.1, integrations: extraIntegrations = [], } = options;
    const normalizedDsn = typeof dsn === 'string' ? dsn.trim() : '';
    if (!normalizedDsn)
        return;
    try {
        Sentry.init({
            dsn: normalizedDsn,
            environment,
            release,
            integrations: [...extraIntegrations],
            tracesSampleRate,
            dataCollection: sentryDataCollection,
        });
    }
    catch (error) {
        // Malformed DSN or other init failure — stay off rather than crash boot.
        // eslint-disable-next-line no-console
        console.warn('[arki/tanstack-start] Sentry disabled — init failed:', error);
        return;
    }
    registerSentryCapture((error, hint) => {
        Sentry.captureException(error, hint);
    });
}
// Sentry@10 introduced middleware-based instrumentation for TanStack Start.
// These helpers are passed to TanStack Start's global middleware registry
// (`createMiddleware().server(...)`) to wrap server functions and route
// loaders. See https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/.
export { sentryGlobalFunctionMiddleware, sentryGlobalRequestMiddleware, wrapFetchWithSentry, wrapMiddlewaresWithSentry, } from '@sentry/tanstackstart-react';
export { Sentry };
//# sourceMappingURL=sentry-server.js.map