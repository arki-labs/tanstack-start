import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { createAppRuntime } from '@arki/dot/runtime';
import { isFailure } from '@arki/failure';
import { getLogger } from '@arki/log';
import { ApplicationUnavailable, failureResponse, thrownResponse } from './failures.js';
export { withForwardedProto } from './forwarded-proto.js';
const log = getLogger('arki:tanstack-start');
/** Paths that look like files. Only these try the disk, so SSR routes never pay a failed read. */
const FILE_PATH = /\.[a-z0-9]+$/i;
const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.mjs': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};
function mimeType(pathname) {
    return MIME_TYPES[pathname.slice(pathname.lastIndexOf('.'))] ?? 'application/octet-stream';
}
function defaultClientDir() {
    const script = process.argv[1];
    return script === undefined ? undefined : new URL('../client/', pathToFileURL(script));
}
/** A built client file, a 404 for a path no file can have, or `undefined` to fall through to Start. */
async function clientFile(request, client) {
    const { pathname } = new URL(request.url);
    if (!FILE_PATH.test(pathname))
        return undefined;
    let file;
    try {
        file = fileURLToPath(new URL(`.${pathname}`, client));
    }
    catch {
        // An encoded slash (`%2F`, scanner probes) makes the file URL invalid: no client file has that name.
        return new Response('Not Found', { status: 404 });
    }
    let data;
    try {
        data = new Uint8Array(await readFile(file));
    }
    catch {
        return undefined;
    }
    return new Response(data, {
        headers: {
            'Content-Type': mimeType(pathname),
            // Content-hashed files under /assets/ never change. Icons, manifest and service worker can.
            'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
        },
    });
}
/** The boot failure stays in the logs; the client only learns to retry. */
function unavailable(failure) {
    log.error('Application unavailable', { code: failure.code, failure });
    return failureResponse(ApplicationUnavailable());
}
/**
 * The server entry of a Dot app on TanStack Start. Pass the result to
 * `createServerEntry`.
 *
 * Per request: a built client file under the `client` directory is served
 * directly (immutable cache under `/assets/`, one hour elsewhere, 404 for
 * `%2F` probes). Otherwise the started app is fetched; a boot failure is
 * logged and answered 503 without its cause. The request context
 * (`services`, `rpc`, `session`, `requestId`, `signal`) then goes to Start
 * as `handler(request, { context })`. Its type is `RequestContextOf<typeof app>`.
 *
 * @example
 * export const server = startServer(app, { hot: import.meta.hot });
 * export default createServerEntry(server);
 */
export function startServer(app, options = {}) {
    const runtime = createAppRuntime(app, { hot: options.hot, eager: options.eager });
    const handler = options.handler ?? createStartHandler(defaultStreamHandler);
    const client = options.client ?? defaultClientDir();
    return {
        async fetch(request) {
            const file = client === undefined ? undefined : await clientFile(request, client);
            if (file !== undefined)
                return file;
            const started = await runtime.get();
            if (isFailure(started))
                return unavailable(started);
            let own;
            try {
                own = await started.services.tanstackStart.context(request, request.signal);
            }
            catch (error) {
                // Identity lookups return `null` or a failure for expected outcomes. A throw is a refusal failure or a crash.
                log.error('Request context failed', { error: error instanceof Error ? error : String(error) });
                return thrownResponse(error);
            }
            return handler(request, { context: { services: started.services, ...own } });
        },
    };
}
//# sourceMappingURL=start-server.js.map