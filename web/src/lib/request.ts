import type {AugmentedValorantEndpoint} from '../types/AugmentedValorantEndpoint'

export function getSlug(str: string) {
    return str.toLowerCase().replace(/ /g, '-')
}

export function endpointToURL(endpoint: AugmentedValorantEndpoint): string {
    switch(endpoint.type) {
        case 'pd': return `https://pd.{shard}.a.pvp.net/${endpoint.suffix}`
        case 'glz': return `https://glz-{region}-1.{shard}.a.pvp.net/${endpoint.suffix}`
        case 'shared': return `https://shared.{shard}.a.pvp.net/${endpoint.suffix}`
        case 'local': return `https://127.0.0.1:{port}/${endpoint.suffix}`
        case 'other': return endpoint.suffix
    }
}

export function isHttpEndpoint(endpoint: AugmentedValorantEndpoint): endpoint is AugmentedValorantEndpoint & {method?: 'GET' | 'POST' | 'PUT' | 'DELETE'} {
    return endpoint.method !== 'WSS' && endpoint.method !== 'TCP'
}

// The headers an endpoint needs, with {placeholder} values matching the variable names used on the endpoint page
export function getRequestHeaders(endpoint: AugmentedValorantEndpoint): [string, string][] {
    const headers = new Map<string, string>(endpoint.headers ?? [])
    const req = endpoint.riotRequirements ?? {}
    if(req.clientPlatform) headers.set('X-Riot-ClientPlatform', '{client platform}')
    if(req.clientVersion) headers.set('X-Riot-ClientVersion', '{client version}')
    if(req.entitlement) headers.set('X-Riot-Entitlements-JWT', '{entitlement token}')
    if(req.token) headers.set('Authorization', 'Bearer {auth token}')
    return Array.from(headers)
}

function shellQuote(str: string) {
    return `'${str.replaceAll(`'`, `'\\''`)}'`
}

export function toCurl(endpoint: AugmentedValorantEndpoint): string {
    let url = endpointToURL(endpoint)
    if(endpoint.query !== undefined && endpoint.query.size > 0) {
        const params = Array.from(endpoint.query.keys()).map(name => `${name}={${name}}`)
        url += (url.includes('?') ? '&' : '?') + params.join('&')
    }

    const lines = [`curl -X ${endpoint.method ?? 'GET'} ${shellQuote(url)}`]
    // The local client API uses a self-signed certificate
    if(endpoint.type === 'local') lines.push('-k')
    if(endpoint.riotRequirements?.localAuth) lines.push(`-u ${shellQuote('riot:{lockfile password}')}`)

    const headers = getRequestHeaders(endpoint)
    if(endpoint.body !== undefined && !headers.some(([name]) => name.toLowerCase() === 'content-type')) {
        headers.push(['Content-Type', 'application/json'])
    }
    for(const [name, value] of headers) {
        lines.push(`-H ${shellQuote(`${name}: ${value}`)}`)
    }

    if(endpoint.body !== undefined) {
        // The body shape is documented in the Body section of the endpoint page
        lines.push(`--data ${shellQuote('{body}')}`)
    }

    return lines.join(' \\\n  ')
}
