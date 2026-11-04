import type { tanstackStart } from '@tanstack/react-start/plugin/vite';
import type { NitroModule } from 'nitro/types';
import type { Plugin } from 'vite';
/**
 * Vite plugin for Foreman-federated TanStack Start apps.
 *
 * Excludes server-only packages reached through the `GET /api/fleet` handler
 * from the client dev dep-scan, so the scanner stops at the server-import
 * boundary instead of failing to resolve a `node`-only subpath under browser
 * conditions. No-op for the client/SSR bundles themselves — TanStack Start
 * already strips `server.handlers` from the client output.
 *
 * Bundles every `@arki/*` package into the SSR build, next to the app's own
 * `ssr.noExternal` entries (Vite merges the lists). See `BUNDLED_IN_SSR`.
 *
 * Also installs a Nitro module (Nitro's Vite plugin installs any plugin's
 * `nitro` field) so a missing `/assets/*` file is never cached as a 404 for a
 * year. See `missingAssetsNotCached`.
 *
 * Every TanStack Start app in the fleet adds it to `plugins`, and so does the
 * application template.
 */
export declare function fleetVite(): Plugin & {
    nitro: NitroModule;
};
type StartRouterOptions = NonNullable<NonNullable<Parameters<typeof tanstackStart>[0]>['router']>;
/**
 * One lazy chunk per route: the loader travels with the component.
 *
 * By default TanStack Router splits the component out of a route but keeps its
 * loader in the entry chunk, so the first page downloads every route's loader
 * imports: validators, server-function stubs, content. Grouping loader and
 * component keeps it one request per route and an entry chunk that holds the
 * router only. Pass as `tanstackStart({ router: { codeSplittingOptions: oneChunkPerRoute } })`.
 */
export declare const oneChunkPerRoute: NonNullable<StartRouterOptions['codeSplittingOptions']>;
/**
 * Compiled Zod on the server: every schema the server constructs parses
 * through a generated validator instead of the interpreter (Zod's own median
 * is 2.4x, more for wide objects). This covers oRPC input validation, server
 * function validators, env and every other `parse` on the server.
 *
 * Zod's `zod/compile` shim compiles the schemas constructed after it loads, so
 * it must be the first import of the server bundle. This plugin prepends that
 * import to every entry module of the server build (TanStack Start's own
 * server entry included), whether the app configures `server.entry` or not.
 * ES modules evaluate imports in order, so the shim installs before the route
 * tree, the Dot app and every other module construct a schema. The client is
 * untouched: the compiler is 7 KB and the browser runs no hot validation loop.
 * A schema the compiler cannot model (async refinements, transforms,
 * `z.coerce`, recursion) falls back to the interpreter with the same results.
 */
export declare function zodCompiled(): Plugin;
export {};
//# sourceMappingURL=vite.d.ts.map