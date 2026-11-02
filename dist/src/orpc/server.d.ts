/**
 * oRPC Server Setup for TanStack Start
 *
 * Provides server-side oRPC configuration for handling HTTP requests
 * and creating server-side callers for direct procedure invocation.
 */
import type { AnyRouter, InferRouterInitialContext, RouterClient } from '@orpc/server';
import type { RPCHandlerOptions } from '@orpc/server/fetch';
import { RPCHandler } from '@orpc/server/fetch';
export type ORPCServerConfig<TRouter extends AnyRouter> = {
    /**
     * The oRPC router (plain object of procedures)
     */
    router: TRouter;
    /**
     * Creates the context for each incoming request.
     * The returned context must satisfy the router's initial context type.
     */
    createContext: (request: Request) => InferRouterInitialContext<TRouter> | Promise<InferRouterInitialContext<TRouter>>;
    /**
     * API endpoint prefix used for routing
     * @default '/api/orpc'
     */
    prefix?: `/${string}`;
    /**
     * Additional RPCHandler options (e.g., plugins like BodyLimitPlugin)
     */
    handlerOptions?: Omit<RPCHandlerOptions<InferRouterInitialContext<TRouter>>, 'plugins'> & {
        plugins?: RPCHandlerOptions<InferRouterInitialContext<TRouter>>['plugins'];
    };
};
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
export declare function createORPCHandler<TRouter extends AnyRouter>(config: ORPCServerConfig<TRouter>): {
    handleRequest: (request: Request) => Promise<Response>;
    rpcHandler: RPCHandler<any>;
};
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
export declare function createRouteHandlers(handleRequest: (request: Request) => Promise<Response>): {
    GET: ({ request }: {
        request: Request;
    }) => Promise<Response>;
    POST: ({ request }: {
        request: Request;
    }) => Promise<Response>;
    PUT: ({ request }: {
        request: Request;
    }) => Promise<Response>;
    PATCH: ({ request }: {
        request: Request;
    }) => Promise<Response>;
    DELETE: ({ request }: {
        request: Request;
    }) => Promise<Response>;
    OPTIONS: () => Response;
};
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
export declare function createServerCaller<TRouter extends AnyRouter>(config: {
    router: TRouter;
    context: () => InferRouterInitialContext<TRouter> | Promise<InferRouterInitialContext<TRouter>>;
}): RouterClient<TRouter>;
/**
 * CORS headers for oRPC API routes
 */
export declare function getCorsHeaders(origin?: string): Record<string, string>;
export { RPCHandler } from '@orpc/server/fetch';
export { createRouterClient, type RouterClient } from '@orpc/server';
//# sourceMappingURL=server.d.ts.map