import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Rich `defaultErrorComponent` for TanStack Router.
 *
 * Drop into `createRouter({ defaultErrorComponent: RootErrorComponent })`.
 *
 * Production: minimal recoverable card (icon + title + reason + actions).
 *
 * Development: also dumps the full error name, message, stack, cause chain,
 * and React component stack so the cause is visible without opening devtools.
 * The dev branch is tree-shaken in production via `import.meta.env.DEV`.
 */
import { useEffect } from 'react';
import { ArrowClockwiseIcon, BugIcon, HouseSimpleIcon, WarningIcon } from '@arki/icons/phosphor';
import { Button } from '@arki/ui/button';
import { cn } from '@arki/ui/utils';
import { captureException } from './sentry-bridge.js';
export function RootErrorComponent({ error, info, reset, className }) {
    const normalized = normalizeError(error);
    const isDev = import.meta.env.DEV;
    // Forward to Sentry via the local bridge. No-op when the host app
    // hasn't called `initSentryClient` — which avoids pulling `@sentry/*`
    // into bundles for apps that never opt in.
    useEffect(() => {
        captureException(error, {
            contexts: {
                react: info?.componentStack ? { componentStack: info.componentStack } : {},
                source: { from: '@arki/tanstack-start/error#RootErrorComponent' },
            },
        });
    }, [error, info?.componentStack]);
    return (_jsxs("div", { role: "alert", className: cn('flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-6', className), children: [_jsxs("div", { className: "w-full max-w-2xl rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center", children: [_jsx(WarningIcon, { className: "mx-auto mb-3 size-8 text-destructive", "aria-hidden": "true" }), _jsx("h1", { className: "text-lg font-semibold", children: "Something went wrong" }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: normalized.message || 'An unexpected error interrupted the page render.' }), _jsxs("div", { className: "mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center", children: [_jsxs(Button, { onClick: reset, children: [_jsx(ArrowClockwiseIcon, { className: "size-4", "aria-hidden": "true" }), "Try again"] }), _jsx(Button, { variant: "outline", asChild: true, children: _jsxs("a", { href: "/", children: [_jsx(HouseSimpleIcon, { className: "size-4", "aria-hidden": "true" }), "Back to home"] }) })] })] }), isDev ? (_jsx(DevDiagnostics, { error: normalized, componentStack: info?.componentStack })) : null] }));
}
function normalizeError(error) {
    if (error instanceof Error) {
        // Cause chains are arbitrary user data: they can be cyclic (e.cause === e)
        // or unboundedly deep, and this runs during SSR — walk them guarded.
        const causes = [];
        const seen = new Set([error]);
        let current = error.cause;
        while (current instanceof Error && !seen.has(current) && causes.length < 10) {
            seen.add(current);
            causes.push({ name: current.name, message: current.message, stack: current.stack });
            current = current.cause;
        }
        return { name: error.name, message: error.message, stack: error.stack, causes };
    }
    if (typeof error === 'string') {
        return { name: 'Error', message: error, causes: [] };
    }
    return { name: 'UnknownError', message: safeStringify(error), causes: [] };
}
function safeStringify(value) {
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return String(value);
    }
}
function DevDiagnostics({ error, componentStack, }) {
    return (_jsxs("details", { open: true, className: "w-full max-w-4xl rounded-md border border-border bg-card text-left text-card-foreground shadow-sm", children: [_jsxs("summary", { className: "flex cursor-pointer items-center gap-2 rounded-t-md border-b border-border bg-muted/40 px-4 py-2 text-sm font-medium", children: [_jsx(BugIcon, { className: "size-4 text-muted-foreground", "aria-hidden": "true" }), "Dev diagnostics", _jsx("span", { className: "ml-auto text-xs font-normal text-muted-foreground", children: "dev-only \u2014 never shipped to production" })] }), _jsxs("div", { className: "space-y-4 p-4 font-mono text-xs", children: [_jsx(DiagnosticBlock, { label: error.name, body: error.message, stack: error.stack }), error.causes.map((cause, index) => (_jsx(DiagnosticBlock, { label: `caused by · ${cause.name}`, body: cause.message, stack: cause.stack }, `${cause.name}-${index}`))), componentStack ? (_jsx(DiagnosticBlock, { label: "React component stack", body: "", stack: componentStack })) : null] })] }));
}
function DiagnosticBlock({ label, body, stack, }) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: label }), body ? _jsx("div", { className: "whitespace-pre-wrap text-foreground", children: body }) : null, stack ? (_jsx("pre", { className: "overflow-x-auto whitespace-pre-wrap rounded bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground", children: stack })) : null] }));
}
//# sourceMappingURL=error.js.map