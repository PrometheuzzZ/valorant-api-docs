import type {AugmentedValorantEndpoint} from '../types/AugmentedValorantEndpoint'
import {describeVariable, findPlaceholders, type PlaygroundSpec, type PlaygroundVariable} from './playground'

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

// What the "Try it" panel needs to build the request in the browser
export function toPlaygroundSpec(endpoint: AugmentedValorantEndpoint, bodyExample?: string): PlaygroundSpec {
    const url = endpointToURL(endpoint)
    const headers = getRequestHeaders(endpoint)
    const query = Array.from(endpoint.query?.entries() ?? []).map(([name, type]) => ({name, optional: type.isOptional()}))
    const basicAuth = endpoint.riotRequirements?.localAuth ? {user: 'riot', password: '{lockfile password}'} : undefined

    const variables = new Map<string, PlaygroundVariable>()
    const add = (name: string, group: PlaygroundVariable['group'], extra: Partial<PlaygroundVariable> = {}) => {
        if(!variables.has(name)) variables.set(name, describeVariable(name, group, extra))
    }
    findPlaceholders(url).forEach(name => add(name, 'path'))
    query.forEach(param => add(param.name, 'query', {optional: param.optional}))
    headers.forEach(([, value]) => findPlaceholders(value).forEach(name => add(name, 'header')))
    if(basicAuth) add('lockfile password', 'header')

    return {
        method: endpoint.method ?? 'GET',
        url,
        query,
        headers,
        basicAuth,
        bodyExample,
        local: endpoint.type === 'local',
        variables: Array.from(variables.values())
    }
}

// Shorter names for categories whose internal name is unwieldy in the sidebar
const categoryDisplayNames: Record<string, string> = {
    'ItemProgressionDefinitionsV2': 'ItemProgression'
}

export function getCategoryLabel(endpoint: AugmentedValorantEndpoint): string {
    const parts = Array.isArray(endpoint.category) ? endpoint.category : [endpoint.category ?? 'Other']
    return parts.map(part => categoryDisplayNames[part] ?? part).join(' — ')
}
