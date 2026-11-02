/**
 * oRPC Server Setup for TanStack Start
 *
 * Provides server-side oRPC configuration for handling HTTP requests
 * and creating server-side callers for direct procedure invocation.
 */
import { createRouterClient } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { getLogger } from '@arki/log';
import { thrownResponse } from '../failures.js';
const log = getLogger('arki:tanstack-start');
/**
 * Creates an oRPC handler for TanStack Start server routes.
 *
 * Returns a `handleRequest` function for HTTP request handling and
 * the underlying `rpcHandler` for advanced use cases.
 *
 * @example
 * ```ts
 * // routes/api/orpc.$.ts
 * import { createFileRoute } from '@tanstack/react-router';
 * import { createORPCHandler, createRouteHandlers } from '@arki/tanstack-start/orpc/server';
 * import { appRouter, createRPCContext } from '@my-app/backend';
 *
 * const { handleRequest } = createORPCHandler({
 *   router: appRouter,
 *   createContext: (request) => createRPCContext({ headers: request.headers }),
 * });
 *
 * export const Route = createFileRoute('/api/orpc/$')({
 *   server: {
 *     handlers: createRouteHandlers(handleRequest),
 *   },
 * });
 * ```
 */
export function createORPCHandler(config) {
    const { router, createContext, prefix = '/api/orpc', handlerOptions } = config;
    const rpcHandler = new RPCHandler(router, handlerOptions);
    /**
     * Handles an incoming HTTP request through the oRPC router.
     * Returns the procedure's response, or a 404 if no procedure matched.
     */
    async function handleRequest(request) {
        let context;
        try {
            context = await createContext(request);
        }
        catch (error) {
            // A thrown failure answers with its own status (such as 401); anything else is a masked 500 and stays in the log.
            log.error('createContext failed', { error: error instanceof Error ? error : String(error) });
            return thrownResponse(error);
        }
        const { matched, response } = await rpcHandler.handle(request, {
            prefix,
            context,
        });
        if (matched) {
            return response;
        }
        return new Response('Not found', { status: 404 });
    }
    return { handleRequest, rpcHandler };
}
/**
 * Creates server-side route handlers for all HTTP methods.
 *
 * Use with TanStack Start's file-based routing to wire up the oRPC endpoint:
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/api/orpc/$')({
 *   server: {
 *     handlers: createRouteHandlers(handleRequest),
 *   },
 * });
 * ```
 */
export function createRouteHandlers(handleRequest) {
    return {
        GET: ({ request }) => handleRequest(request),
        POST: ({ request }) => handleRequest(request),
        PUT: ({ request }) => handleRequest(request),
        PATCH: ({ request }) => handleRequest(request),
        DELETE: ({ request }) => handleRequest(request),
        OPTIONS: () => new Response(null, { status: 204 }),
    };
}
/**
 * Creates a server-side caller for direct procedure invocation (no HTTP).
 *
 * Useful in React Server Components, server functions, or API middleware
 * where you want to call procedures without going through HTTP.
 *
 * @example
 * ```ts
 * import { createServerCaller } from '@arki/tanstack-start/orpc/server';
 * import { appRouter, createRPCContext } from '@my-app/backend';
 *
 * const caller = createServerCaller({
 *   router: appRouter,
 *   context: () => createRPCContext({ headers: new Headers() }),
 * });
 *
 * // Direct procedure call — fully typed
 * const documents = await caller.documents.list({ limit: 10 });
 * ```
 */
export function createServerCaller(config) {
    return createRouterClient(config.router, {
        context: config.context,
    });
}
/**
 * CORS headers for oRPC API routes
 */
export function getCorsHeaders(origin = '*') {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}
export { RPCHandler } from '@orpc/server/fetch';
export { createRouterClient } from '@orpc/server';
//# sourceMappingURL=server.js.map