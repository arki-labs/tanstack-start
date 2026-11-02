/**
 * `useOptimisticMutation`: a mutation whose cache edits show at once, roll
 * back on error and refetch when the last concurrent call settles.
 *
 * `apply(cache, input)` only RECORDS typed edits; the mutation runs them:
 *
 *   1. cancel the touched queries, read every snapshot, compute EVERY
 *      replacement — a throwing edit writes nothing and sends no request;
 *   2. write them all;
 *   3. on error, restore each snapshot in reverse — only where the cache
 *      still holds the value this mutation wrote;
 *   4. when the last in-flight mutation of this procedure settles,
 *      invalidate every query any of them touched.
 *
 * Rollback is local cache only: it never reverses a database write, a job or
 * an email. Concurrent edits to one key are last-writer-wins until the refetch.
 */
import { hashKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { keysetKey } from './keyset.js';
/** In development, a snapshot handed to an edit is frozen, so mutating it in place throws. */
function frozenInDev(value) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- Vite's build-mode flag, not an environment variable
    if (import.meta.env.DEV && typeof value === 'object' && value !== null)
        Object.freeze(value);
    return value;
}
function edit(queryClient, queryKey, replace) {
    return {
        queryKey,
        prepare: () => {
            const previous = queryClient.getQueryData(queryKey);
            // Not loaded: nothing to edit (and nothing to create). The key is still refetched.
            if (previous === undefined)
                return;
            const next = replace(previous);
            return {
                write: () => {
                    queryClient.setQueryData(queryKey, next);
                    return { queryKey, previous, written: queryClient.getQueryData(queryKey) };
                },
            };
        },
    };
}
function editKeyset(queryClient, queryKey, fn) {
    return edit(queryClient, queryKey, data => ({
        ...data,
        pages: data.pages.map((page, index) => ({ ...page, items: fn(frozenInDev(page.items), index) })),
    }));
}
/** Keys waiting for the last in-flight mutation of a procedure, per QueryClient and mutation key. */
const pendingRefetch = new WeakMap();
function isThenable(value) {
    return (typeof value === 'object' || typeof value === 'function') && value !== null && 'then' in value;
}
/**
 * Mutation options with optimistic edits. `useOptimisticMutation` is this
 * plus `useQueryClient`; use this one outside React or to add options.
 */
export function optimisticMutationOptions(queryClient, utils, options) {
    const mutationKey = utils.mutationKey();
    return {
        ...utils.mutationOptions(),
        onMutate: async (input) => {
            const edits = [];
            const partialKeys = [];
            const cache = {
                update: (target, targetInput, fn) => edits.push(edit(queryClient, target.queryKey({ input: targetInput }), current => fn(frozenInDev(current)))),
                updateKeyset: (target, args, fn) => edits.push(editKeyset(queryClient, keysetKey(target, args), fn)),
                invalidate: target => partialKeys.push(target.key()),
            };
            const applied = options.apply(cache, input);
            if (isThenable(applied)) {
                throw new TypeError('useOptimisticMutation: `apply` must be synchronous; it only records cache edits.');
            }
            for (const recorded of edits)
                await queryClient.cancelQueries({ queryKey: recorded.queryKey, exact: true });
            // Compute every replacement before writing any: a throwing edit leaves the cache untouched.
            const prepared = edits.map(recorded => recorded.prepare());
            const written = prepared.flatMap(step => (step === undefined ? [] : [step.write()]));
            const refetch = [
                ...edits.map(recorded => ({ queryKey: recorded.queryKey, exact: true })),
                ...partialKeys.map(queryKey => ({ queryKey, exact: false })),
            ];
            return { '~edits': written, '~refetch': refetch };
        },
        onError: (error, input, context) => {
            const written = context?.['~edits'] ?? [];
            for (let index = written.length - 1; index >= 0; index--) {
                const done = written[index];
                // Someone else replaced it since (another mutation, a refetch): keep theirs; the settle step refetches.
                if (done !== undefined && queryClient.getQueryData(done.queryKey) === done.written) {
                    queryClient.setQueryData(done.queryKey, done.previous);
                }
            }
            options.onError?.(error, input);
        },
        onSuccess: (output, input) => {
            options.onSuccess?.(output, input);
        },
        onSettled: (_output, _error, _input, context) => {
            const byKey = pendingRefetch.get(queryClient) ?? new Map();
            pendingRefetch.set(queryClient, byKey);
            const hash = hashKey(mutationKey);
            const keys = [...(byKey.get(hash) ?? []), ...(context?.['~refetch'] ?? [])];
            // The settling mutation still counts as pending here, so 1 means "this is the last one".
            if (queryClient.isMutating({ mutationKey }) > 1) {
                byKey.set(hash, keys);
                return;
            }
            byKey.delete(hash);
            // Overlapping calls often touch the same query: refetch each one once.
            const unique = new Map(keys.map(refetch => [`${String(refetch.exact)}:${hashKey(refetch.queryKey)}`, refetch]));
            for (const { queryKey, exact } of unique.values())
                void queryClient.invalidateQueries({ queryKey, exact });
        },
    };
}
/**
 * A mutation with typed optimistic cache edits, guarded rollback and a
 * refetch when the last concurrent call settles.
 *
 * @example
 * ```tsx
 * const create = useOptimisticMutation(orpc.posts.create, {
 *   apply: (cache, input) =>
 *     cache.updateKeyset(orpc.posts.list, { status: 'published' }, (items, pageIndex) =>
 *       pageIndex === 0 ? [{ ...input, id: tempId() }, ...items] : items),
 * });
 * ```
 */
export function useOptimisticMutation(utils, options) {
    const queryClient = useQueryClient();
    return useMutation(optimisticMutationOptions(queryClient, utils, options), queryClient);
}
//# sourceMappingURL=optimistic.js.map