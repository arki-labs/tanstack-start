import type { QueryClient, QueryKey, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { GeneralUtils, ProcedureUtils } from '@orpc/tanstack-query';
import type { KeysetUtils, OptionalContext, PagedInput } from './keyset.js';
/** Typed cache edits. `apply` records them; the mutation executes them. */
export type Cache = {
    /** Replace one query's data. `fn` runs only if the query is in the cache. */
    update<TInput, TOutput, TError>(utils: ProcedureUtils<OptionalContext, TInput, TOutput, TError>, input: NoInfer<TInput>, fn: (current: TOutput) => NoInfer<TOutput>): void;
    /** Edit the loaded pages of a keyset list, page by page. Cursors and pageParams are kept. */
    updateKeyset<TInput extends PagedInput, TOutput, TItem, TError>(utils: KeysetUtils<TInput, TOutput, TItem, TError>, args: NoInfer<TInput>, fn: (items: readonly TItem[], pageIndex: number) => NoInfer<TItem>[]): void;
    /** Refetch everything under a utils node (partial key) when the mutation settles. */
    invalidate(utils: GeneralUtils<unknown>): void;
};
export type OptimisticOptions<TInput, TOutput, TError> = {
    readonly apply: (cache: Cache, input: TInput) => void;
    readonly onSuccess?: (output: TOutput, input: TInput) => void;
    readonly onError?: (error: TError, input: TInput) => void;
};
/** One edit as written: restored on error only if the cache still holds `written`. */
type WrittenEdit = {
    readonly queryKey: QueryKey;
    readonly previous: unknown;
    readonly written: unknown;
};
/** A query to refetch when the mutation settles: an edited key exactly, an `invalidate` node by prefix. */
type Refetch = {
    readonly queryKey: QueryKey;
    readonly exact: boolean;
};
/** Opaque to callers: the edits this mutation wrote, and the queries to refetch when it settles. */
export type OptimisticContext = {
    readonly '~edits': readonly WrittenEdit[];
    readonly '~refetch': readonly Refetch[];
};
/**
 * Mutation options with optimistic edits. `useOptimisticMutation` is this
 * plus `useQueryClient`; use this one outside React or to add options.
 */
export declare function optimisticMutationOptions<TInput, TOutput, TError>(queryClient: QueryClient, utils: ProcedureUtils<OptionalContext, TInput, TOutput, TError>, options: OptimisticOptions<TInput, TOutput, TError>): UseMutationOptions<TOutput, TError, TInput, OptimisticContext>;
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
export declare function useOptimisticMutation<TInput, TOutput, TError>(utils: ProcedureUtils<OptionalContext, TInput, TOutput, TError>, options: OptimisticOptions<TInput, TOutput, TError>): UseMutationResult<TOutput, TError, TInput, OptimisticContext>;
export {};
//# sourceMappingURL=optimistic.d.ts.map