/**
 * `startServer(app, { hot })` — the server entry of a Dot app on TanStack Start.
 *
 * Per request it serves a built client file when one matches, otherwise it
 * gets the started app (or answers 503), builds the typed request context
 * and calls Start's handler with it:
 *
 * ```ts
 * // start/src/server.ts
 * export const server = startServer(app, { hot: import.meta.hot });
 * export default createServerEntry(server);
 *
 * declare module '@tanstack/react-start' {
 *   interface Register {
 *     server: { requestContext: RequestContextOf<typeof app> };
 *   }
 * }
 * ```
 *
 * The app's runtime is `createAppRuntime` from `@arki/dot/runtime`: one
 * started app per process, and a hot update disposes the old app before the
 * new one starts.
 */
import type { DotAppLifecycle, UnitPhases, ServiceRecord } from '@arki/dot';
import type { Failure } from '@arki/failure';
import { createAppRuntime } from '@arki/dot/runtime';
import type { StartRequestContext, WithStart } from './request-context.js';
export { withForwardedProto } from './forwarded-proto.js';
/** Start's request handler, as `startServer` calls it. */
export type StartHandler<Context> = (request: Request, options: {
    readonly context: Context;
}) => Response | Promise<Response>;
/** The options `createAppRuntime` accepts; `hot` and `eager` pass through unchanged. */
type RuntimeOptions = NonNullable<Parameters<typeof createAppRuntime>[1]>;
/**
 * Options of {@link startServer}.
 *
 * @example
 * startServer(app, { hot: import.meta.hot, eager: env.NODE_ENV === 'production', client: new URL('../client/', import.meta.url) });
 */
export type StartServerOptions<Context> = {
    /** `import.meta.hot`: dispose the old app before a hot update starts the new one. */
    readonly hot?: RuntimeOptions['hot'];
    /**
     * Boot the app when the server is created, not on the first request
     * (`createAppRuntime`'s `eager`). Pass `env.NODE_ENV === 'production'`: a
     * production server pays no boot on its first request and shows a boot
     * failure at process start. Leave it off in dev, where Vite re-runs the module.
     */
    readonly eager?: RuntimeOptions['eager'];
    /** Start's handler. Defaults to `createStartHandler(defaultStreamHandler)`. */
    readonly handler?: StartHandler<Context>;
    /**
     * The built client directory (Vite's `dist/client/`), as a URL ending in `/`.
     * Defaults to `../client/` next to the running server script (`dist/server/server.js`).
     */
    readonly client?: URL;
};
/** What `createServerEntry` takes. */
export type StartServer = {
    readonly fetch: (request: Request) => Promise<Response>;
};
/**
 * The server entry of a Dot app on TanStack Start. Pass the result to
 * `createServerEntry`.
 *
 * Per request: a built client file under the `client` directory is served
 * directly (immutable cache under `/assets/`, one hour elsewhere, 404 for
 * `%2F` probes). Otherwise the started app is fetched; a boot failure is
 * logged and answered 503 without its cause. The request context
 * (`services`, `rpc`, `session`, `requestId`, `signal`) then goes to Start
 * as `handler(request, { context })`. Its type is `RequestContextOf<typeof app>`.
 *
 * @example
 * export const server = startServer(app, { hot: import.meta.hot });
 * export default createServerEntry(server);
 */
export declare function startServer<Services extends ServiceRecord, Rpc, Session>(app: DotAppLifecycle<WithStart<Services, Rpc, Session>, Failure, Failure, UnitPhases>, options?: StartServerOptions<StartRequestContext<WithStart<Services, Rpc, Session>, Rpc, Session>>): StartServer;
//# sourceMappingURL=start-server.d.ts.map