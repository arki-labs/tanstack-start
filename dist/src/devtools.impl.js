import { jsx as _jsx } from "react/jsx-runtime";
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { EnvironmentPanel } from './devtools-environment.js';
import { JotaiPanel } from './devtools-jotai.js';
const ENVIRONMENT_PLUGIN = {
    name: 'Environment',
    render: _jsx(EnvironmentPanel, {}),
};
const ROUTER_PLUGIN = {
    name: 'TanStack Router',
    render: _jsx(TanStackRouterDevtoolsPanel, {}),
};
const QUERY_PLUGIN = {
    name: 'TanStack Query',
    render: _jsx(ReactQueryDevtoolsPanel, {}),
};
export function DevToolsImpl({ position = 'bottom-right', hideUntilHover = true, defaultOpen = false, openHotkey = ['Shift', 'Alt', 'D'], panelLocation = 'bottom', jotaiStore, }) {
    const plugins = [
        ENVIRONMENT_PLUGIN,
        ROUTER_PLUGIN,
        QUERY_PLUGIN,
    ];
    if (jotaiStore) {
        plugins.push({
            name: 'Jotai',
            render: _jsx(JotaiPanel, { store: jotaiStore }),
        });
    }
    return (_jsx(TanStackDevtools, { plugins: plugins, config: {
            position,
            hideUntilHover,
            defaultOpen,
            openHotkey,
            panelLocation,
        } }));
}
//# sourceMappingURL=devtools.impl.js.map