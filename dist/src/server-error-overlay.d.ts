/** A fetch handler; whatever follows the request (Start's `{ context }`) passes through untouched. */
type FetchHandler<Rest extends readonly unknown[]> = (request: Request, ...rest: Rest) => Promise<Response> | Response;
export declare function withServerErrorOverlay<Rest extends readonly unknown[]>(handler: FetchHandler<Rest>): (request: Request, ...rest: Rest) => Promise<Response>;
export {};
//# sourceMappingURL=server-error-overlay.d.ts.map