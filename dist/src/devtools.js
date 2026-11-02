import { jsx as _jsx } from "react/jsx-runtime";
/// <reference types="vite/client" />
/**
 * Unified dev-only devtools shell for TanStack Start apps.
 *
 * Mounts the TanStack devtools host with router + query panels (and a
 * built-in Environment panel) as tabs in one floating button. Renders
 * `null` in production — the entire module body is gated by
 * `import.meta.env.DEV` so production bundles tree-shake it away.
 *
 * Usage in `__root.tsx`:
 * ```tsx
 * import { DevTools } from '@arki/tanstack-start/devtools';
 * // ...
 * <Scripts />
 * <DevTools />
 * ```
 *
 * The default behaviour is intentionally non-intrusive:
 *   - trigger button hides until you mouse near the corner (`hideUntilHover`)
 *   - panel opens at the bottom of the viewport
 *   - hotkey `Shift+Alt+D` toggles the panel
 *
 * Apps can override every default via props.
 */
import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { getLogger } from '@arki/log';
const log = getLogger('arki:tanstack-start');
const isDev = import.meta.env.DEV;
const LazyDevToolsImpl = isDev
    ? lazy(() => import('./devtools.impl.js').then((mod) => ({ default: mod.DevToolsImpl })))
    : null;
/**
 * Mount inside `__root.tsx` after `<Scripts />`. Returns `null` in production.
 */
export function DevTools(props = {}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!isDev || !LazyDevToolsImpl || !mounted)
        return null;
    return (_jsx(DevToolsBoundary, { children: _jsx(Suspense, { fallback: null, children: _jsx(LazyDevToolsImpl, { ...props }) }) }));
}
/**
 * Keeps a devtools failure inside the devtools. The lazy chunk is large
 * (jotai-devtools alone is ~8 MB in dev), so a proxy that cuts responses short
 * or a stale Vite optimize hash makes its `import()` reject. Without this, the
 * rejection reaches the root route and the whole page stops rendering.
 */
class DevToolsBoundary extends Component {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch(error) {
        log.warn('Devtools failed to load; the app keeps running without them', { error });
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}
//# sourceMappingURL=devtools.js.map