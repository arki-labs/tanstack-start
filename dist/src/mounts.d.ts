import type { MountedService, MountName } from './request-context.js';
/** What a server-route handler receives that the `Name` mount reads. */
type MountArgs<Name extends MountName> = {
    readonly request: Request;
    readonly context: {
        readonly services: {
            readonly tanstackStart: MountedService<Name>;
        };
    };
};
declare function serveRpc({ request, context }: MountArgs<'rpc'>): Promise<Response>;
declare function preflight({ request, context }: MountArgs<'rpc'>): Response;
/**
 * Handlers for the rpc mount: serve `mounts.rpc` at its `at`, apply the
 * CORS policy from `tanstackStart({ cors })`, answer preflights with 204 and
 * unmatched paths with 404.
 *
 * @example
 * export const Route = createFileRoute('/api/rpc/$')({ server: { handlers: rpcHandlers() } });
 */
export declare function rpcHandlers(): {
    GET: typeof serveRpc;
    POST: typeof serveRpc;
    PUT: typeof serveRpc;
    PATCH: typeof serveRpc;
    DELETE: typeof serveRpc;
    OPTIONS: typeof preflight;
};
declare function serveCron({ request, context }: MountArgs<'cron'>): Promise<Response>;
/**
 * Handlers for the cron mount: `POST <at>/<name>` triggers the feature
 * schedule `<name>` through `mounts.cron.router`. The bearer secret is
 * checked first (401 otherwise); an unknown name is 404.
 *
 * @example
 * export const Route = createFileRoute('/api/cron/$')({ server: { handlers: cronHandlers() } });
 */
export declare function cronHandlers(): {
    POST: typeof serveCron;
};
declare function serveAuth({ request, context }: MountArgs<'auth'>): Promise<Response>;
/**
 * Handlers for the auth mount: `GET` and `POST` go to `mounts.auth.serve`
 * (such as Better Auth's request handler).
 *
 * @example
 * export const Route = createFileRoute('/api/auth/$')({ server: { handlers: authHandlers() } });
 */
export declare function authHandlers(): {
    GET: typeof serveAuth;
    POST: typeof serveAuth;
};
declare function serveHealth({ context }: Pick<MountArgs<'health'>, 'context'>): Response;
/**
 * Handlers for the health probe: `GET` answers `{ status: 'ok' }`. It only
 * runs once the app has started; before that `startServer` answers 503.
 *
 * @example
 * export const Route = createFileRoute('/api/health')({ server: { handlers: healthHandlers() } });
 */
export declare function healthHandlers(): {
    GET: typeof serveHealth;
};
export {};
//# sourceMappingURL=mounts.d.ts.map