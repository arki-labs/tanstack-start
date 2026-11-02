/**
 * oRPC Client Setup for TanStack Start
 *
 * Provides client-side oRPC configuration with TanStack Query integration.
 * Unlike tRPC, oRPC doesn't need its own React context — it works directly
 * with TanStack Query's QueryClient via generated query/mutation options.
 *
 * The utils are built from the contract VALUE, so every leaf also carries
 * its operation (`'~op'`: path, name, meta — see `@arki/contracts/orpc`).
 * Keys are oRPC's own, so these utils and `createTanstackQueryUtils(client)`
 * share one cache.
 */
import type { ClientContext, NestedClient } from '@orpc/client';
import type { RPCLinkOptions } from '@orpc/client/fetch';
import type { AnyContractRouter, ContractProcedure, ContractRouterClient, ErrorFromErrorMap, InferSchemaInput, InferSchemaOutput } from '@orpc/contract';
import type { GeneralUtils, ProcedureUtils } from '@orpc/tanstack-query';
import type { Identified, OperationOf } from '@arki/contracts/orpc';
/** oRPC's `ProcedureUtils` + `GeneralUtils` per leaf, plus the operation. Groups keep `key()`. */
export type OrpcUtils<C, TCtx extends ClientContext> = C extends ContractProcedure<infer I, infer O, infer E, infer _M> ? ProcedureUtils<TCtx, InferSchemaInput<I>, InferSchemaOutput<O>, ErrorFromErrorMap<E>> & GeneralUtils<InferSchemaInput<I>> & Identified<OperationOf<C>> : {
    readonly [K in keyof C as K & string]: OrpcUtils<C[K], TCtx>;
} & GeneralUtils<unknown>;
/** The context type of an oRPC client tree (oRPC's `InferClientContext`, without its `any` constraint). */
type ClientContextOf<TClient> = TClient extends NestedClient<infer TCtx> ? TCtx : never;
/**
 * Low level: bind a contract to a client you built (your own link,
 * serializers, context). Walks the contract once, eagerly; throws the
 * `operations()` build-time errors (a key with `.`, a reserved key).
 *
 * @example
 * ```ts
 * const client: ContractRouterClient<typeof rpcContract> = createORPCClient(link);
 * export const orpc = createOrpcUtils(rpcContract, client);
 * orpc.posts.create['~op'].name; // 'posts.create'
 * ```
 */
export declare function createOrpcUtils<const C extends AnyContractRouter, TClient extends ContractRouterClient<C, never>>(contract: C, client: TClient): OrpcUtils<C, ClientContextOf<TClient>>;
export type ORPCClientConfig<TCtx extends ClientContext> = {
    /**
     * Base URL for the oRPC API endpoint
     * @default '/api/orpc'
     */
    readonly url?: string;
    /**
     * Custom headers to include in requests. Called before each request with
     * the call's options, so per-call context can become a header.
     */
    readonly headers?: (options: {
        readonly context?: TCtx;
    }) => Record<string, string> | Promise<Record<string, string>>;
    /** Extra JSON serializers, e.g. `temporalJsonSerializers` from `@arki/date/orpc`. */
    readonly customJsonSerializers?: RPCLinkOptions<TCtx>['customJsonSerializers'];
};
/**
 * High level: link + client + utils in one call.
 *
 * @example
 * ```tsx
 * // lib/orpc.ts
 * import { createORPCReact, getORPCUrl } from '@arki/tanstack-start/orpc/client';
 * import { rpcContract } from '@my-app/backend/rpc';
 *
 * export const { client, orpc } = createORPCReact(rpcContract, { url: getORPCUrl() });
 *
 * // In components — use with TanStack Query hooks:
 * const { data } = useQuery(orpc.documents.list.queryOptions({ input: {} }));
 * const mutation = useMutation(orpc.documents.create.mutationOptions());
 * ```
 */
export declare function createORPCReact<const C extends AnyContractRouter, TCtx extends ClientContext = Record<never, never>>(contract: C, config?: ORPCClientConfig<TCtx>): {
    client: ContractRouterClient<C, TCtx>;
    orpc: OrpcUtils<C, ClientContextOf<ContractRouterClient<C, TCtx>>>;
};
/**
 * Gets the base URL for oRPC based on environment.
 *
 * - Browser: returns relative URL `/api/orpc`
 * - SSR: uses `VITE_ORPC_URL` or `ORPC_URL` env var, falling back to localhost
 */
export declare function getORPCUrl(): string;
export { createORPCClient } from '@orpc/client';
export { RPCLink } from '@orpc/client/fetch';
export { createTanstackQueryUtils } from '@orpc/tanstack-query';
export { type RouterClient } from '@orpc/server';
//# sourceMappingURL=client.d.ts.map