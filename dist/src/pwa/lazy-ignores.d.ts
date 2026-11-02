/**
 * Curated `globIgnores` patterns for known dynamically-imported chunk
 * families. Pass these into {@link CreatePwaPluginOptions.injectManifest}'s
 * `globIgnores` to exclude chunks that the runtime fetches on demand,
 * shrinking the precache manifest without affecting features.
 *
 * Each chunk family corresponds to a library that uses `import()` to
 * load assets the first time a user actually needs them:
 *
 * - **Shiki** loads a separate ESM bundle per TextMate grammar
 *   (e.g. `cpp-DhlOAK4K.js`) and per theme (e.g. `gruvbox-light-hard-*.js`)
 *   on first render of a code block in that language/theme.
 * - **Mermaid** loads one chunk per diagram renderer (e.g. `sequenceDiagram-*.js`)
 *   on first render of that diagram type.
 *
 * Precaching these wastes bandwidth and storage — most users will only
 * ever hit a small subset. The browser still caches what does get loaded,
 * and the SW will fall through to the network for anything missed.
 *
 * Filenames are emitted by Rolldown as `<lib-module-name>-<hash>.js`,
 * so a prefix-with-literal-hyphen glob (`cpp-*.js`) is precise enough
 * to avoid colliding with similarly-named user chunks (`cpp17-...` would
 * still match if it existed; nothing else does).
 */
/**
 * Shiki language grammar chunk patterns.
 *
 * Each grammar lands at `assets/<lang>-<hash>.js` — only loaded when a
 * code block in that language renders. Precaching all 200+ wastes ~7 MB
 * for a typical app.
 */
export declare const SHIKI_LANG_IGNORES: readonly string[];
/**
 * Shiki theme chunk patterns.
 *
 * Each theme lands at `assets/<theme>-<hash>.js` — only loaded when shiki
 * is configured to use that theme.
 */
export declare const SHIKI_THEME_IGNORES: readonly string[];
/**
 * Mermaid diagram-renderer chunk patterns.
 *
 * Mermaid uses `import()` for each diagram type. The chunk filename is
 * the renderer module name (e.g. `sequenceDiagram-*.js`,
 * `architectureDiagram-*.js`, `flowchart-*.js`). Only the diagram types
 * actually used at runtime need to be loaded.
 */
export declare const MERMAID_DIAGRAM_IGNORES: readonly string[];
/**
 * All known lazy-chunk patterns combined.
 *
 * Spread into `injectManifest.globIgnores` to exclude every chunk family
 * this module knows about in a single line:
 *
 * @example
 * ```ts
 * createPwaPlugin({
 *   injectManifest: {
 *     globIgnores: [...LAZY_CHUNK_IGNORES],
 *   },
 * });
 * ```
 */
export declare const LAZY_CHUNK_IGNORES: readonly string[];
//# sourceMappingURL=lazy-ignores.d.ts.map