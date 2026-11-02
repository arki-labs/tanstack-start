import type { createStore } from 'jotai';
import 'jotai-devtools/styles.css';
type JotaiStore = ReturnType<typeof createStore>;
export declare function JotaiPanel({ store }: {
    store?: JotaiStore;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=devtools-jotai.d.ts.map