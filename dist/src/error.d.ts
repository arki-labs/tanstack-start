import type { ErrorComponentProps } from '@tanstack/react-router';
type RootErrorComponentProps = ErrorComponentProps<unknown> & {
    /**
     * Optional className applied to the outer wrapper. Use this when an app
     * wants to override the default centered layout (e.g. embed inside a
     * narrower shell).
     */
    className?: string;
};
export declare function RootErrorComponent({ error, info, reset, className }: RootErrorComponentProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=error.d.ts.map