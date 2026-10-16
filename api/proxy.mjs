// Forwards "Try it" requests from the docs site to Riot's servers.
// Riot's APIs don't send CORS headers, so a browser can't call them directly.
// Deployed as a Vercel function and mounted on the Astro dev server (see web/astro.config.mjs).
// Nothing is logged or stored: the request is forwarded and the response handed back as JSON.

// Only Riot and Valorant hosts can be reached, so this can't be used as a general-purpose proxy
const allowedHosts = [
    /(^|\.)pvp\.net$/,
    /(^|\.)riotgames\.com$/,
    /(^|\.)riotcdn\.net$/,
    /(^|\.)valorant-api\.com$/
]
const allowedMethods = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
// Set by fetch itself or meaningless for the upstream request
const droppedHeaders = new Set(['host', 'connection', 'content-length', 'transfer-encoding', 'origin', 'referer', 'accept-encoding'])

const maxRequestBytes = 1024 * 1024
const maxResponseBytes = 8 * 1024 * 1024
const timeoutMs = 20000

async function readBody(req) {
    const chunks = []
    let size = 0
    for await (const chunk of req) {
        size += chunk.length
        if(size > maxRequestBytes) throw new Error('Request too large')
        chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString('utf-8')
}

function send(res, status, data) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(data))
}

function parseTarget(input) {
    let url
    try {
        url = new URL(input.url)
    } catch {
        throw new Error('Invalid URL')
    }
    if(url.protocol !== 'https:') throw new Error('Only https URLs can be proxied')
    if(url.username || url.password) throw new Error('Credentials in the URL are not supported')
    if(!allowedHosts.some(host => host.test(url.hostname))) {
        throw new Error(`${url.hostname} is not a Riot host, so it can't be proxied`)
    }

    const method = String(input.method ?? 'GET').toUpperCase()
    if(!allowedMethods.has(method)) throw new Error(`Unsupported method ${method}`)

    const headers = new Headers()
    for(const pair of Array.isArray(input.headers) ? input.headers : []) {
        if(!Array.isArray(pair) || pair.length !== 2) continue
        const [name, value] = pair.map(String)
        if(droppedHeaders.has(name.toLowerCase())) continue
        try {
            headers.append(name, value)
        } catch {
            throw new Error(`Invalid header ${name}`)
        }
    }

    const body = typeof input.body === 'string' && method !== 'GET' ? input.body : undefined
    return {url, method, headers, body}
}

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return send(res, 405, {error: 'Use POST'})
    }

    let target
    try {
        target = parseTarget(JSON.parse(await readBody(req)))
    } catch(e) {
        return send(res, 400, {error: e instanceof Error ? e.message : 'Invalid request'})
    }

    const start = Date.now()
    let upstream
    try {
        upstream = await fetch(target.url, {
            method: target.method,
            headers: target.headers,
            body: target.body,
            redirect: 'manual',
            signal: AbortSignal.timeout(timeoutMs)
        })
    } catch(e) {
        const timedOut = e instanceof Error && e.name === 'TimeoutError'
        return send(res, 502, {error: timedOut ? `No response within ${timeoutMs / 1000}s` : `Could not reach ${target.url.hostname}`})
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())
    const truncated = buffer.length > maxResponseBytes
    const headers = []
    upstream.headers.forEach((value, name) => {
        if(name !== 'set-cookie') headers.push([name, value])
    })
    // Auth endpoints hand out cookies that the next request needs, so pass them along as data
    for(const cookie of upstream.headers.getSetCookie?.() ?? []) headers.push(['set-cookie', cookie])

    send(res, 200, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
        body: buffer.subarray(0, maxResponseBytes).toString('utf-8'),
        size: buffer.length,
        truncated,
        timeMs: Date.now() - start
    })
}
