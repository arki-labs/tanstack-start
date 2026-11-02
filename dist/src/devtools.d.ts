import type { createStore } from 'jotai';
type JotaiStore = ReturnType<typeof createStore>;
type TriggerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right';
export type DevToolsProps = {
    /**
     * Where the floating trigger button lives.
     * @default 'bottom-right'
     */
    position?: TriggerPosition;
    /**
     * Hide the trigger button until the cursor is near it. Less obtrusive
     * during normal use, instantly visible when you reach for it.
     * @default true
     */
    hideUntilHover?: boolean;
    /**
     * Open the devtools panel on first mount. Settings persist in localStorage,
     * so this only applies the first time an app loads.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Hotkey to toggle the devtools panel. Pass an array of TanStack devtools
     * KeyboardKey strings (e.g. `['Shift', 'Alt', 'D']` or `['CtrlOrMeta', 'I']`).
     * @default ['Shift', 'Alt', 'D']
     */
    openHotkey?: string[];
    /**
     * Render the panel above or below the page. Bottom is more common.
     * @default 'bottom'
     */
    panelLocation?: 'top' | 'bottom';
    /**
     * Optional Jotai store. When provided, a "Jotai" tab is added to the
     * shell that embeds `jotai-devtools`'s `<DevTools />`. Apps that pass
     * this should remove their inline `<DevTools from 'jotai-devtools'>`
     * mount so only one floating button remains.
     *
     * Pass either a custom store created with `createStore()` from `jotai`,
     * or `undefined` to skip the panel entirely.
     */
    jotaiStore?: JotaiStore;
};
/**
 * Mount inside `__root.tsx` after `<Scripts />`. Returns `null` in production.
 */
export declare function DevTools(props?: DevToolsProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=devtools.d.ts.map