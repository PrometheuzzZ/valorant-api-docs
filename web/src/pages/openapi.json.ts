import {endpoints} from 'valorant-api-types'
import type {ValorantEndpoint} from 'valorant-api-types'
import type {ZodType} from 'zod'
import {zodToJsonSchema} from 'zod-to-json-schema'
import typesPackageJson from '../../../valorant-api-types/package.json'
import {getSlug} from '../lib/request'

const shardVariable = {
    default: 'na',
    enum: ['na', 'pbe', 'eu', 'ap', 'kr'],
    description: 'The shard the account was created on'
}
const regionVariable = {
    default: 'na',
    enum: ['na', 'latam', 'br', 'eu', 'ap', 'kr'],
    description: 'The region of the account'
}
const serverVariables: Record<string, {default: string, enum?: string[], description: string}> = {
    shard: shardVariable,
    region: regionVariable,
    port: {default: '0', description: 'The port from the Riot Client lockfile'},
    cluster: {
        default: 'usw2',
        enum: ['euc1', 'usw2', 'apse1', 'apne1'],
        description: 'The SGP cluster for the player\'s region'
    }
}

function getServer(endpoint: ValorantEndpoint): {server: string, path: string, query: Map<string, string>} {
    let url: string
    switch(endpoint.type) {
        case 'pd': url = `https://pd.{shard}.a.pvp.net/${endpoint.suffix}`; break
        case 'glz': url = `https://glz-{region}-1.{shard}.a.pvp.net/${endpoint.suffix}`; break
        case 'shared': url = `https://shared.{shard}.a.pvp.net/${endpoint.suffix}`; break
        case 'local': url = `https://127.0.0.1:{port}/${endpoint.suffix}`; break
        case 'other': url = endpoint.suffix; break
    }

    const [, server, rest] = url.match(/^(\w+:\/\/[^/]+)(.*)$/)!
    const [path, queryString] = rest.split('?')
    return {server, path: path || '/', query: new Map(new URLSearchParams(queryString ?? ''))}
}

// OpenAPI path parameters can't reliably contain spaces or dashes, so `{party id}` becomes `{partyId}`
function toParamName(name: string) {
    return name.replace(/[ -]+(\w)/g, (_, c: string) => c.toUpperCase())
}

function toSchema(schema: ZodType) {
    // Documented schemas describe the wire format, so use the pre-transform input types
    const {$schema, ...jsonSchema} = zodToJsonSchema(schema, {target: 'jsonSchema7', effectStrategy: 'input', $refStrategy: 'none'}) as Record<string, unknown>
    return jsonSchema
}

function headerParam(name: string, description: string) {
    return {name, in: 'header', required: true, description, schema: {type: 'string'}}
}

export async function GET() {
    const paths: Record<string, Record<string, any>> = {}
    const tags = new Set<string>()

    for(const endpoint of Object.values(endpoints) as ValorantEndpoint[]) {
        const {server, path: rawPath, query: fixedQuery} = getServer(endpoint)
        const method = (endpoint.method ?? 'GET').toLowerCase()

        const path = rawPath.replace(/\{([^}]+)\}/g, (_, name: string) => `{${toParamName(name)}}`)
        const parameters: any[] = []

        for(const [, name] of rawPath.matchAll(/\{([^}]+)\}/g)) {
            const varType = endpoint.variables?.get(name)
            parameters.push({
                name: toParamName(name),
                in: 'path',
                required: true,
                ...(varType?.description !== undefined ? {description: varType.description} : {}),
                schema: varType !== undefined ? toSchema(varType) : {type: 'string'}
            })
        }
        for(const [name, value] of fixedQuery) {
            parameters.push({name, in: 'query', required: true, schema: {type: 'string', enum: [value]}})
        }
        for(const [name, type] of endpoint.query ?? []) {
            parameters.push({
                name,
                in: 'query',
                required: !type.isOptional(),
                ...(type.description !== undefined ? {description: type.description} : {}),
                schema: toSchema(type)
            })
        }

        const req = endpoint.riotRequirements ?? {}
        if(req.clientPlatform) parameters.push(headerParam('X-Riot-ClientPlatform', 'Base64-encoded client platform JSON'))
        if(req.clientVersion) parameters.push(headerParam('X-Riot-ClientVersion', 'The current client version'))
        if(req.entitlement) parameters.push(headerParam('X-Riot-Entitlements-JWT', 'The entitlement token'))
        for(const [name, value] of endpoint.headers ?? []) {
            if(name.toLowerCase() === 'content-type') continue
            parameters.push({name, in: 'header', required: true, schema: {type: 'string', default: value}})
        }

        const security = []
        if(req.token) security.push({riotToken: []})
        if(req.localAuth) security.push({localAuth: []})

        const responses: Record<string, any> = {}
        for(const [code, schema] of Object.entries(endpoint.responses ?? {})) {
            responses[code] = {
                description: code === '200' ? 'Success' : `HTTP ${code}`,
                content: {'application/json': {schema: toSchema(schema)}}
            }
        }
        if(Object.keys(responses).length === 0) responses['200'] = {description: 'Success'}

        const tag = Array.isArray(endpoint.category) ? endpoint.category : endpoint.category !== undefined ? [endpoint.category] : []
        tag.forEach(t => tags.add(t))

        const operation = {
            operationId: toParamName(getSlug(endpoint.name)),
            summary: endpoint.name,
            description: endpoint.description,
            ...(tag.length > 0 ? {tags: tag} : {}),
            servers: [{
                url: server,
                variables: Object.fromEntries(
                    Array.from(server.matchAll(/\{([^}]+)\}/g), ([, name]) => [name, serverVariables[name] ?? {default: name}])
                )
            }],
            parameters,
            ...(endpoint.body !== undefined ? {requestBody: {required: true, content: {'application/json': {schema: toSchema(endpoint.body)}}}} : {}),
            ...(security.length > 0 ? {security} : {security: []}),
            responses
        }

        paths[path] ??= {}
        if(paths[path][method] !== undefined) {
            // OpenAPI allows one operation per path and method (e.g. Auth Request and Multi-Factor Authentication share one)
            paths[path][method].description += `\n\nThis path is also used by **${endpoint.name}**: ${endpoint.description}`
            continue
        }
        paths[path][method] = operation
    }

    const spec = {
        openapi: '3.1.0',
        info: {
            title: 'Valorant API (unofficial)',
            version: typesPackageJson.version,
            description: 'Unofficial documentation of the Valorant client and server API, generated from the valorant-api-types package. Each operation has its own server since endpoints live on different hosts.'
        },
        tags: Array.from(tags).sort().map(name => ({name})),
        components: {
            securitySchemes: {
                riotToken: {type: 'http', scheme: 'bearer', description: 'The Riot auth (access) token'},
                localAuth: {type: 'http', scheme: 'basic', description: 'Username `riot` and the password from the Riot Client lockfile'}
            }
        },
        paths
    }

    return new Response(JSON.stringify(spec, null, 2), {headers: {'Content-Type': 'application/json'}})
}
