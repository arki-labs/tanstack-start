/**
 * TanStack Router Configuration
 *
 * Provides router setup utilities for TanStack Start applications.
 */
import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
/**
 * Creates a configured TanStack Router instance
 *
 * @example
 * ```ts
 * // router.ts
 * import { createRouter } from '@arki/tanstack-start/router';
 * import { routeTree } from './routeTree.gen';
 * import { queryClient } from './query-client';
 *
 * export const router = createRouter({
 *   routeTree,
 *   queryClient,
 *   defaultPreload: 'intent',
 * });
 *
 * declare module '@tanstack/react-router' {
 *   interface Register {
 *     router: typeof router;
 *   }
 * }
 * ```
 */
export function createRouter(config) {
    const { routeTree, queryClient, defaultPreload = 'intent', defaultPreloadDelay = 50, defaultPreloadStaleTime = 30_000, history, basepath, context = {}, defaultErrorComponent, defaultPendingComponent, defaultNotFoundComponent, } = config;
    return createTanStackRouter({
        routeTree,
        defaultPreload,
        defaultPreloadDelay,
        defaultPreloadStaleTime,
        history,
        basepath,
        context: {
            queryClient,
            ...context,
        },
        defaultErrorComponent,
        defaultPendingComponent,
        defaultNotFoundComponent,
        // Scroll restoration
        scrollRestoration: true,
    });
}
/**
 * Creates a singleton QueryClient with sensible defaults
 *
 * @example
 * ```ts
 * import { createQueryClient } from '@arki/tanstack-start/router';
 *
 * export const queryClient = createQueryClient();
 * ```
 */
export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // to avoid refetching immediately on the client
                staleTime: 60 * 1000, // 1 minute
                // Disable automatic refetching by default
                refetchOnWindowFocus: false,
                // Retry failed queries
                retry: 1,
            },
            mutations: {
                // Retry failed mutations once
                retry: 1,
            },
        },
    });
}
export { createRouter as createTanStackRouter } from '@tanstack/react-router';
//# sourceMappingURL=router.js.map