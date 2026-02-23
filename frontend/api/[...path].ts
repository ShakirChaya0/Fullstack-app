// Vercel Serverless Function - runs in Node.js, types resolved at deploy time
declare const process: { env: Record<string, string | undefined> };
declare const Buffer: { from(data: ArrayBuffer): { length: number } & Uint8Array };

interface VercelRequest {
    url?: string;
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body?: unknown;
}

interface VercelResponse {
    setHeader(name: string, value: string | string[]): VercelResponse;
    status(code: number): VercelResponse;
    json(body: unknown): VercelResponse;
    send(body: unknown): VercelResponse;
    end(): void;
}

const BACKEND_URL = process.env.BACKEND_URL || 'https://fullstack-app-production-a43d.up.railway.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Build target URL preserving path and query string
        const strippedUrl = (req.url || '').replace(/^\/api\/?/, '');
        const targetUrl = `${BACKEND_URL}/${strippedUrl}`;

        // Forward request headers (skip hop-by-hop headers)
        const headers: Record<string, string> = {};
        const skipHeaders = new Set(['host', 'connection', 'transfer-encoding', 'content-length']);

        for (const [key, value] of Object.entries(req.headers)) {
            if (!skipHeaders.has(key.toLowerCase()) && value) {
                headers[key] = Array.isArray(value) ? value[0] : value;
            }
        }

        // Prepare request body (Vercel auto-parses JSON, so re-stringify)
        let body: string | undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body != null) {
            body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        // Forward request to backend
        const backendResponse = await fetch(targetUrl, {
            method: req.method || 'GET',
            headers,
            body,
            redirect: 'manual',
        });

        // Forward response headers (skip problematic ones)
        const skipResHeaders = new Set(['transfer-encoding', 'connection', 'content-encoding', 'content-length']);
        backendResponse.headers.forEach((value: string, key: string) => {
            if (!skipResHeaders.has(key.toLowerCase()) && key.toLowerCase() !== 'set-cookie') {
                res.setHeader(key, value);
            }
        });

        // Handle Set-Cookie headers separately (multiple cookies possible)
        const rawHeaders = backendResponse.headers as unknown as { getSetCookie?: () => string[] };
        const setCookieHeaders = rawHeaders.getSetCookie?.();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            res.setHeader('set-cookie', setCookieHeaders);
        }

        // Send response
        const arrayBuffer = await backendResponse.arrayBuffer();
        const responseBuffer = Buffer.from(arrayBuffer);
        res.status(backendResponse.status);

        if (responseBuffer.length > 0) {
            res.send(responseBuffer);
        } else {
            res.end();
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(502).json({ error: 'Bad Gateway', message: 'Failed to connect to backend' });
    }
}
