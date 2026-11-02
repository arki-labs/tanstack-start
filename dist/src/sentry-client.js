import * as Sentry from '@sentry/react';
import { registerSentryCapture } from './sentry-bridge.js';
import { sentryDataCollection } from './sentry-data-collection.js';
export function initSentryClient(options) {
    const { dsn, environment = import.meta.env.MODE, release, tracesSampleRate = import.meta.env.DEV ? 1.0 : 0.1, replaysSessionSampleRate = 0, replaysOnErrorSampleRate = 1.0, integrations: extraIntegrations = [], } = options;
    const normalizedDsn = typeof dsn === 'string' ? dsn.trim() : '';
    if (!normalizedDsn)
        return;
    const integrations = [
        Sentry.browserTracingIntegration(),
        ...extraIntegrations,
    ];
    try {
        Sentry.init({
            dsn: normalizedDsn,
            environment,
            release,
            integrations,
            tracesSampleRate,
            replaysSessionSampleRate,
            replaysOnErrorSampleRate,
            dataCollection: sentryDataCollection,
        });
    }
    catch (error) {
        // Malformed DSN or other init failure — stay off rather than crash the app.
        // eslint-disable-next-line no-console
        console.warn('[arki/tanstack-start] Sentry disabled — init failed:', error);
        return;
    }
    registerSentryCapture((error, hint) => {
        Sentry.captureException(error, hint);
    });
}
export { Sentry };
//# sourceMappingURL=sentry-client.js.map