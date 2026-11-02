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
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { isContractProcedure } from '@orpc/contract';
import { createGeneralUtils, createProcedureUtils } from '@orpc/tanstack-query';
import { OPERATION, operations } from '@arki/contracts/orpc';
// oRPC's client is a callable Proxy at every node, so a leaf is a function.
function isClient(value) {
    return typeof value === 'function';
}
/** `value[key]` for an object or a callable Proxy; `undefined` otherwise. */
function child(value, key) {
    return (typeof value === 'object' || typeof value === 'function') && value !== null ? Reflect.get(value, key) : undefined;
}
function build(node, ops, client, path) {
    if (isContractProcedure(node)) {
        if (!isClient(client))
            throw new TypeError(`The client has no procedure at ${path.join('.')}`);
        return { ...createGeneralUtils(path), ...createProcedureUtils(client, { path }), [OPERATION]: ops };
    }
    const group = { ...createGeneralUtils(path) };
    for (const [key, next] of Object.entries(node)) {
        Object.defineProperty(group, key, {
            value: build(next, child(ops, key), child(client, key), [...path, key]),
            enumerable: true,
            configurable: true,
            writable: true,
        });
    }
    return group;
}
// Erasure seam: TypeScript cannot check a recursive walk against the recursive
// mapped type `OrpcUtils<C, …>` (same as `routerFor` in `@arki/dot`), so the
// implementation returns `unknown` and the overload above states the result.
// `client.test-d.ts` pins it.
export function createOrpcUtils(contract, client) {
    return build(contract, operations(contract), client, []);
}
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
export function createORPCReact(contract, config = {}) {
    const { url = '/api/orpc', headers, customJsonSerializers } = config;
    const link = new RPCLink({
        url,
        headers: options => headers?.(options) ?? {},
        ...(customJsonSerializers === undefined ? {} : { customJsonSerializers }),
    });
    const client = createORPCClient(link);
    return { client, orpc: createOrpcUtils(contract, client) };
}
/**
 * Gets the base URL for oRPC based on environment.
 *
 * - Browser: returns relative URL `/api/orpc`
 * - SSR: uses `VITE_ORPC_URL` or `ORPC_URL` env var, falling back to localhost
 */
export function getORPCUrl() {
    // Browser: use relative URL
    if (typeof window !== 'undefined') {
        return '/api/orpc';
    }
    // SSR: use environment variable or localhost
    const url = process.env.VITE_ORPC_URL ?? process.env.ORPC_URL;
    if (url)
        return url;
    // Default to localhost for development
    const port = process.env.PORT ?? '3000';
    return `http://localhost:${port}/api/orpc`;
}
export { createORPCClient } from '@orpc/client';
export { RPCLink } from '@orpc/client/fetch';
export { createTanstackQueryUtils } from '@orpc/tanstack-query';
export {} from '@orpc/server';
//# sourceMappingURL=client.js.map