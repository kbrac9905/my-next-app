/**
 * Simple request proxy utility for Next.js (app router route handlers / edge runtimes).
 *
 * Features:
 * - Forwards method, headers (with safe filtering), and body
 * - Preserves status, headers and streams response back to the client
 * - Works with Edge runtimes and Node (uses global fetch / Request / Response Web APIs)
 *
 * Usage example (inside `src/app/api/proxy/route.ts`):
 *
 * import { proxy } from '@/lib/proxy';
 *
 * export async function GET(req: Request) {
 *   return proxy(req, 'https://example.com/api/data');
 * }
 */

const hopByHopHeaders = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
]);

function filterRequestHeaders(headers: Headers): Headers {
  const out = new Headers();
  for (const [key, value] of headers) {
    if (hopByHopHeaders.has(key.toLowerCase())) continue;
    // Avoid Host header being forwarded by default; let fetch set it.
    if (key.toLowerCase() === 'host') continue;
    out.set(key, value);
  }
  return out;
}

function filterResponseHeaders(headers: Headers): Headers {
  const out = new Headers();
  for (const [key, value] of headers) {
    if (hopByHopHeaders.has(key.toLowerCase())) continue;
    out.set(key, value);
  }
  return out;
}

/**
 * Proxy a Next.js Request to an external origin.
 * @param req - incoming Request from Next.js route handler
 * @param destination - full destination URL or path (if absolute will be used as-is)
 * @param opts - optional fetch init overrides
 * @returns a Response streamed from the destination
 */
export async function proxy(
  req: Request,
  destination: string,
  opts?: Omit<RequestInit, 'headers' | 'body' | 'method'>,
): Promise<Response> {
  // Build URL: if destination is an absolute URL use it; otherwise treat as origin + path
  const destUrl = new URL(
    destination,
    typeof window === 'undefined' ? 'http://localhost' : window.location.href,
  ).toString();

  const method = req.method;

  // Clone and filter headers
  const incomingHeaders = new Headers(req.headers as any);
  const headers = filterRequestHeaders(incomingHeaders);

  // Optionally add X-Forwarded headers
  const forwardedFor =
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  if (forwardedFor) {
    headers.set('x-forwarded-for', forwardedFor);
  }

  // Forward body for applicable methods
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let body: BodyInit | undefined = undefined;
  if (hasBody) {
    try {
      // Request might be a stream - let fetch consume the same stream via req.body
      body = (req.body as BodyInit | null) ?? undefined;
    } catch (e) {
      // fall back to undefined
      body = undefined;
    }
  }

  const fetchInit: RequestInit = {
    method,
    headers,
    body,
    // keep other options (redirect, signal, etc.) from opts
    ...(opts ?? {}),
  };

  // Perform fetch to destination
  const res = await fetch(destUrl, fetchInit);

  // Filter response headers
  const resHeaders = filterResponseHeaders(new Headers(res.headers as any));

  // Stream response body back
  const responseInit: ResponseInit = {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  };

  // In Edge runtimes / modern environments, res.body is a ReadableStream and can be returned directly.
  return new Response(res.body, responseInit);
}

export default proxy;
