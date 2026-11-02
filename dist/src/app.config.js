/**
 * TanStack Start App Configuration
 *
 * Convenience builder that returns a Vite `UserConfig` pre-wired with the
 * TanStack Start plugin and React plugin. Apps can spread the result into
 * their own `vite.config.ts` or use it directly. Mirrors the role
 * `app.config.ts` played in earlier TanStack Start versions before the
 * project moved fully onto Vite.
 */
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
/**
 * Creates a TanStack Start Vite configuration with sensible defaults.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { createAppConfig } from '@arki/tanstack-start/config';
 *
 * export default createAppConfig({
 *   reactStrictMode: true,
 *   tanstackStart: { server: { entry: './entry-server.ts' } },
 * });
 * ```
 */
export function createAppConfig(config = {}) {
    const { basePath, reactStrictMode = true, vitePlugins = [], clientEnvPrefix = 'VITE_', tanstackStart: tanstackStartOptions, vite = {}, } = config;
    return defineConfig({
        base: basePath,
        envPrefix: clientEnvPrefix,
        resolve: {
            tsconfigPaths: true,
            ...vite.resolve,
        },
        build: {
            sourcemap: 'hidden',
            ...vite.build,
        },
        define: reactStrictMode
            ? {
                'import.meta.env.REACT_STRICT_MODE': JSON.stringify(true),
                ...vite.define,
            }
            : vite.define,
        plugins: [...vitePlugins, tanstackStart(tanstackStartOptions), viteReact(), ...(vite.plugins ?? [])],
        ...vite,
    });
}
export { defineConfig };
//# sourceMappingURL=app.config.js.map