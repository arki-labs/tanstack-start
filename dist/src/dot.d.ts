import { OpenAPIHandler } from '@orpc/openapi/fetch';
import type { CtxOf, NeedsShape, NoReservedKeys } from '@arki/dot';
import type { CronContext } from '@arki/schedule/orpc';
import type { CorsOptions, MountName, MountPrefix, RpcServed, StartService } from './request-context.js';
export { authHandlers, cronHandlers, healthHandlers, rpcHandlers } from './mounts.js';
export type { RequestContextOf } from './request-context.js';
export type { CorsOptions } from './request-context.js';
/**
 * Stable error codes thrown when `tanstackStart()` boots. Match on the code,
 * never on the message.
 */
export declare const TANSTACK_START_PLUGIN_ERROR_CODES: {
    /**
     * The cron mount's `secret()` returned an empty or missing value at boot.
     *
     * @fix Set the env var `secret` reads (such as `CRON_SECRET`) on the server, not at build time.
     * @verify bun run test -- src/dot.test.ts
     */
    readonly cronSecretInvalid: 'ARKI_TANSTACK_START_PLUGIN_E001';
    /**
     * `cors()` returned an origin that is not a bare `scheme://host[:port]`.
     *
     * @fix Remove any path or trailing slash from each origin, such as `https://shop.example`.
     * @verify bun run test -- src/dot.test.ts
     */
    readonly corsInvalid: 'ARKI_TANSTACK_START_PLUGIN_E002';
};
/** A router whose procedures run on the cron context — the app's `cronRouter`. */
export type CronRouter = ConstructorParameters<typeof OpenAPIHandler<CronContext>>[0];
/**
 * The `mounts` option: each mount is optional, says where it lives (`at`)
 * and how it serves, as a function of the plugin's own needs.
 *
 * @example
 * const mounts = {
 *   rpc: { at: '/api/rpc', serve: ({ rpc }, request, prefix) => rpc.handle(request, prefix) },
 *   health: { at: '/api/health' },
 * } satisfies MountOptions<{ rpc: Gateway }>;
 */
export type MountOptions<Needs> = {
    /** The rpc mount. `serve` answers like oRPC's `RPCHandler.handle`; unmatched is a 404. */
    readonly rpc?: {
        readonly at: MountPrefix;
        readonly serve: (needs: Needs, request: Request, prefix: MountPrefix) => RpcServed | Promise<RpcServed>;
    };
    /** The auth mount, such as Better Auth's `auth.handler(request)`. */
    readonly auth?: {
        readonly at: MountPrefix;
        readonly serve: (needs: Needs, request: Request) => Response | Promise<Response>;
    };
    /**
     * The cron mount: the app's cron router, the bearer secret the host sends
     * (read at boot, such as `() => env.CRON_SECRET`), the scheduler that runs it.
     */
    readonly cron?: {
        readonly at: MountPrefix;
        readonly router: CronRouter;
        readonly secret: () => string;
        readonly schedules: (needs: Needs) => CronContext['schedules'];
    };
    /** The health probe: `GET` answers `{ status: 'ok' }` once the app has started. */
    readonly health?: {
        readonly at: MountPrefix;
    };
};
/**
 * Options of {@link tanstackStart}. `session`, `rpc` and every mount
 * receive the resolved `needs`; what `rpc` and `session` return types
 * `context.rpc` and `context.session()`.
 *
 * @example
 * const options = {
 *   needs: { auth: authn.provides.auth },
 *   session: ({ auth }, request) => auth.principal(request.headers),
 *   rpc: ({ auth }, request) => clientFor(auth, request.headers),
 * } satisfies TanstackStartOptions<{ auth: typeof authn.provides.auth }, Client, Promise<Principal | null>, never>;
 */
export type TanstackStartOptions<Needs extends NeedsShape, RpcResult, SessionResult, Declared extends MountName> = {
    /** The services this entrypoint reads, as provider handles. */
    readonly needs: Needs;
    /** The caller's session. Called at most once per request, and only when read. */
    readonly session: (needs: CtxOf<Needs>, request: Request) => SessionResult;
    /** The in-process RPC client for one request. Built before Start runs the request. */
    readonly rpc: (needs: CtxOf<Needs>, request: Request) => RpcResult;
    /** The server routes this entrypoint serves. Only declared mounts reach the manifest. */
    readonly mounts?: {
        readonly [Name in Declared]: NonNullable<MountOptions<CtxOf<Needs>>[Name]>;
    };
    /** Which cross-origin callers the rpc mount answers, read at boot. No option: same origin only. */
    readonly cors?: () => CorsOptions;
};
/**
 * The TanStack Start entrypoint of a Dot app. Provides `tanstackStart`: the
 * per-request context builder, the CORS policy and the declared mounts.
 * Declares one manifest action per declared mount, at its `at`, so
 * `dot explain` lists them. `configure` rejects a bad or repeated mount
 * path (no I/O). Booting reads the cron secret and the CORS options, and
 * throws a coded `DotUnitError` when either is bad.
 *
 * @example
 * defineApp('shop')
 *   .features([gateway])
 *   .entrypoints(
 *     tanstackStart({
 *       needs: { rpc: gateway.provides.rpc },
 *       session: () => null,
 *       rpc: ({ rpc }, request) => rpc.client(request.headers),
 *       mounts: { rpc: { at: '/api/rpc', serve: ({ rpc }, request, prefix) => rpc.handle(request, prefix) } },
 *     }),
 *   );
 */
export declare function tanstackStart<const Needs extends NeedsShape & NoReservedKeys, RpcResult, SessionResult, Declared extends MountName = never>(options: TanstackStartOptions<Needs, RpcResult, SessionResult, Declared>): Omit<import("@arki/dot").Unit<import("@arki/dot").WireNeeds<Needs>, import("@arki/dot").ProvidedValues<{
    tanstackStart: StartService<Awaited<RpcResult>, Awaited<SessionResult>, Declared>;
}>, Needs, "tanstack-start", import("@arki/dot").EmptyOwnership, import("@arki/dot").InferredPhases<{
    configure: import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
        issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
    }> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | undefined;
    start: undefined;
    stop: undefined;
    dispose: undefined;
}>>, "factories" | "hooks" | "logging"> & import("@arki/dot").LoggingSlot<import("@arki/dot").DotLoggingHandle<undefined>> & import("@arki/dot").FactoryContract<import("@arki/dot").ProvidedValues<{
    tanstackStart: StartService<Awaited<RpcResult>, Awaited<SessionResult>, Declared>;
}>> & {
    readonly factories: {
        readonly tanstackStart: (ctx: never) => StartService<Awaited<RpcResult>, Awaited<SessionResult>, Declared>;
    };
    readonly hooks: import("@arki/dot").PhaseHooks<never, {
        readonly configure: import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
            issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
        }> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | undefined;
        readonly start: undefined;
        readonly stop: undefined;
        readonly dispose: undefined;
    }, import("@arki/dot").DotConfigureContext> & import("@arki/dot").BootSlot<CtxOf<Needs> & import("@arki/dot").ProvidedValues<{
        tanstackStart: StartService<Awaited<RpcResult>, Awaited<SessionResult>, Declared>;
    }> & import("@arki/dot").KernelCtx, undefined>;
} & import("@arki/dot/unit").EntrypointRole;
//# sourceMappingURL=dot.d.ts.map