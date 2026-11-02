import type { DataTag, InfiniteData, QueryKey, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { ProcedureUtils } from '@orpc/tanstack-query';
import type { Page } from '@arki/contracts';
/**
 * The input of a keyset list: an optional cursor and page size, plus the
 * list's own filters. The caller passes it without the cursor; `limit`
 * stays — it is the first page's size and part of the query key.
 */
export type PagedInput = {
    readonly cursor?: string | undefined;
    readonly limit?: number | undefined;
};
export type KeysetStatus = 'idle' | 'loadingFirstPage' | 'canLoadMore' | 'loadingMore' | 'exhausted' | 'error';
export type KeysetOptions = {
    /** `false` keeps the list `idle`: no request. */
    readonly enabled?: boolean;
    readonly staleTime?: number;
};
/**
 * The client context the hooks accept: optional, as oRPC's default. The hooks
 * send no per-call context, so utils whose client REQUIRES a context are a
 * compile error here — call their own `infiniteOptions` / `mutationOptions`.
 */
export type OptionalContext = Record<never, never>;
type KeysetData<TPage> = InfiniteData<TPage, string | undefined>;
export type KeysetResult<TItem, TError, TPage extends Page<TItem> = Page<TItem>> = {
    /** Every loaded row, in server order. */
    readonly items: readonly TItem[];
    readonly status: KeysetStatus;
    readonly error: TError | null;
    /** A background refetch is running (not the first load, not `loadMore`). */
    readonly isFetching: boolean;
    /**
     * Fetch one more page of `count` rows (default: the args' limit, else the
     * contract default). A no-op unless `status` is `'canLoadMore'`. Resolves
     * when the page lands; never rejects — a failure shows as `status: 'error'`.
     */
    readonly loadMore: (count?: number) => Promise<void>;
    /** Escape hatch: the underlying TanStack infinite query. */
    readonly query: UseInfiniteQueryResult<KeysetData<TPage>, TError>;
};
/**
 * Utils of a keyset list: output `Page<TItem>`, plus any extra fields the
 * procedure returns (`hasMore`, totals). oRPC's utils are invariant in their
 * output, so the extra fields ride in `TOutput` and the page part is checked.
 */
export type KeysetUtils<TInput extends PagedInput, TOutput, TItem, TError> = ProcedureUtils<OptionalContext, TInput, TOutput & Page<TItem>, TError>;
/**
 * Infinite-query options for a keyset list. For loaders:
 * `queryClient.infiniteQuery({ ...keysetOptions(orpc.posts.list, args), staleTime: 'static' })`.
 */
export declare function keysetOptions<TInput extends PagedInput, TOutput, TItem, TError>(utils: KeysetUtils<TInput, TOutput, TItem, TError>, args: NoInfer<TInput>, options?: KeysetOptions): NoInfer<{
    input: (cursor: string | undefined) => TInput;
    initialPageParam: undefined;
    getNextPageParam: (last: TOutput & Page<TItem>) => string | undefined;
    enabled?: boolean | undefined;
    staleTime?: number | undefined;
} & Omit<import("@orpc/tanstack-query").InfiniteOptionsBase<TOutput & Page<TItem>, TError, string | undefined>, "enabled" | "getNextPageParam" | "initialPageParam" | "input" | "staleTime">>;
/** The exact key `useKeysetQuery` registers for these args. */
export declare function keysetKey<TInput extends PagedInput, TOutput, TItem, TError>(utils: KeysetUtils<TInput, TOutput, TItem, TError>, args: NoInfer<TInput>): DataTag<QueryKey, KeysetData<TOutput & Page<TItem>>, TError>;
/**
 * A keyset-paged list: `items`, `status` and `loadMore(n)`.
 *
 * @example
 * ```tsx
 * const { items, status, loadMore } = useKeysetQuery(orpc.posts.list, { status: 'published' });
 * {status === 'canLoadMore' && <button onClick={() => void loadMore(50)}>More</button>}
 * ```
 */
export declare function useKeysetQuery<TInput extends PagedInput, TOutput, TItem, TError>(utils: KeysetUtils<TInput, TOutput, TItem, TError>, args: NoInfer<TInput>, options?: KeysetOptions): KeysetResult<TItem, TError, TOutput & Page<TItem>>;
export {};
//# sourceMappingURL=keyset.d.ts.map