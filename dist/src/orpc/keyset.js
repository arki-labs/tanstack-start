/**
 * `useKeysetQuery`: a keyset-paged list over the `pageInput` / `page`
 * contract of `@arki/contracts`, as `items`, `status` and `loadMore(n)`.
 *
 * Takes any oRPC `ProcedureUtils` — contract-built (`createOrpcUtils`),
 * router-built or `createTanstackQueryUtils` — whose output is `Page<T>`
 * and whose input has a `cursor`. Types come from the procedure; nothing is
 * written at the call site.
 */
import { useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
/**
 * The page input for a cursor. The first page sends `args` as given: the
 * query key is derived from it, so it never changes when `loadMore` picks a
 * new size. Later pages add the cursor and, when set, the `loadMore` size.
 */
function pageInputFor(args, nextLimit) {
    return (cursor) => {
        if (cursor === undefined)
            return args;
        const limit = nextLimit.current;
        return limit === undefined ? { ...args, cursor } : { ...args, cursor, limit };
    };
}
function infiniteOptionsWith(utils, args, options, nextLimit) {
    return utils.infiniteOptions({
        input: pageInputFor(args, nextLimit),
        initialPageParam: undefined,
        getNextPageParam: (last) => last.nextCursor ?? undefined,
        ...(options.enabled === undefined ? {} : { enabled: options.enabled }),
        ...(options.staleTime === undefined ? {} : { staleTime: options.staleTime }),
    });
}
/**
 * Infinite-query options for a keyset list. For loaders:
 * `queryClient.infiniteQuery({ ...keysetOptions(orpc.posts.list, args), staleTime: 'static' })`.
 */
export function keysetOptions(utils, args, options = {}) {
    return infiniteOptionsWith(utils, args, options, { current: undefined });
}
/** The exact key `useKeysetQuery` registers for these args. */
export function keysetKey(utils, args) {
    return utils.infiniteKey({ input: pageInputFor(args, { current: undefined }), initialPageParam: undefined });
}
function statusOf(query, enabled) {
    if (query.data === undefined) {
        if (query.isError)
            return 'error';
        if (query.isFetching)
            return 'loadingFirstPage';
        return enabled ? 'loadingFirstPage' : 'idle';
    }
    if (query.isFetchingNextPage)
        return 'loadingMore';
    if (query.isFetchNextPageError)
        return 'error';
    return query.hasNextPage ? 'canLoadMore' : 'exhausted';
}
/**
 * A keyset-paged list: `items`, `status` and `loadMore(n)`.
 *
 * @example
 * ```tsx
 * const { items, status, loadMore } = useKeysetQuery(orpc.posts.list, { status: 'published' });
 * {status === 'canLoadMore' && <button onClick={() => void loadMore(50)}>More</button>}
 * ```
 */
export function useKeysetQuery(utils, args, options = {}) {
    const nextLimit = useRef(undefined);
    const query = useInfiniteQuery(infiniteOptionsWith(utils, args, options, nextLimit));
    const status = statusOf(query, options.enabled !== false);
    const { fetchNextPage } = query;
    const pages = query.data?.pages;
    const items = useMemo(() => pages?.flatMap(page => page.items) ?? [], [pages]);
    const loadMore = useCallback(async (count) => {
        if (status !== 'canLoadMore')
            return;
        nextLimit.current = count;
        // `cancelRefetch: false`: a second call while this page is in flight (a
        // double click in one tick) joins it instead of sending another request.
        await fetchNextPage({ cancelRefetch: false });
    }, [status, fetchNextPage]);
    return {
        items,
        status,
        error: query.error,
        isFetching: query.isFetching && !query.isFetchingNextPage && query.data !== undefined,
        loadMore,
        query,
    };
}
//# sourceMappingURL=keyset.js.map