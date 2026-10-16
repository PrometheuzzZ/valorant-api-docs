// Everything the "Try it" panel needs, shared by the build (initial render) and the browser (live updates).
// Must stay free of Node and zod imports so it can be bundled into the page script.

export interface PlaygroundVariable {
    name: string
    // Where the variable is used, to group the inputs
    group: 'path' | 'query' | 'header'
    kind: 'text' | 'secret' | 'select'
    options?: string[]
    defaultValue?: string
    optional?: boolean
    hint?: string
}

export interface PlaygroundSpec {
    method: string
    // URL with {variable} placeholders, without the query string
    url: string
    query: {name: string, optional: boolean}[]
    // Header values may contain {variable} placeholders
    headers: [string, string][]
    // Basic auth for the local client API, the password being a {variable} template
    basicAuth?: {user: string, password: string}
    bodyExample?: string
    // The local client API lives on the user's machine with a self-signed certificate
    local: boolean
    variables: PlaygroundVariable[]
}

export type Values = Record<string, string>

const placeholderPattern = /\{([a-zA-Z][\w\- ]*)\}/g

// The client platform the current Windows client sends: PC / Windows 10.0.26200 / Unknown chipset
export const defaultClientPlatform = 'ewoJInBsYXRmb3JtVHlwZSI6ICJQQyIsCgkicGxhdGZvcm1PUyI6ICJXaW5kb3dzIiwKCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjI2MjAwLjEuMjU2LjY0Yml0IiwKCSJwbGF0Zm9ybUNoaXBzZXQiOiAiVW5rbm93biIKfQ=='

const knownVariables: Record<string, Partial<PlaygroundVariable>> = {
    'shard': {kind: 'select', options: ['na', 'pbe', 'eu', 'ap', 'kr']},
    'region': {kind: 'select', options: ['na', 'latam', 'br', 'eu', 'ap', 'kr']},
    'cluster': {kind: 'select', options: ['euc1', 'usw2', 'apse1', 'apne1']},
    'client platform': {defaultValue: defaultClientPlatform},
    'auth token': {kind: 'secret'},
    'entitlement token': {kind: 'secret'},
    'lockfile password': {kind: 'secret'},
    'access token': {kind: 'secret'},
    'id token': {kind: 'secret'}
}

export function describeVariable(name: string, group: PlaygroundVariable['group'], extra: Partial<PlaygroundVariable> = {}): PlaygroundVariable {
    return {name, group, kind: 'text', ...knownVariables[name.toLowerCase()], ...extra}
}

export function findPlaceholders(str: string): string[] {
    return Array.from(str.matchAll(placeholderPattern), m => m[1])
}

// Replaces {variable} with its value; unknown or empty variables stay as placeholders
export function fill(template: string, values: Values): string {
    return template.replace(placeholderPattern, (match, name: string) => {
        const value = values[name]
        return value !== undefined && value !== '' ? value : match
    })
}

function encodeQueryValue(value: string) {
    return /^\{[^}]+\}$/.test(value) ? value : encodeURIComponent(value)
}

export interface BuiltRequest {
    method: string
    url: string
    headers: [string, string][]
    body?: string
    basicAuth?: {user: string, password: string}
    // Required variables that have no value yet
    missing: string[]
}

export function buildRequest(spec: PlaygroundSpec, values: Values, body?: string): BuiltRequest {
    const used = new Set<string>()
    const track = (template: string) => {
        findPlaceholders(template).forEach(name => used.add(name))
        return fill(template, values)
    }

    let url = track(spec.url)
    const query = spec.query
        .filter(param => !param.optional || (values[param.name] ?? '') !== '')
        .map(param => `${param.name}=${encodeQueryValue(track(`{${param.name}}`))}`)
    if(query.length > 0) url += (url.includes('?') ? '&' : '?') + query.join('&')

    const headers = spec.headers.map(([name, value]) => [name, track(value)] as [string, string])
    const basicAuth = spec.basicAuth && {user: spec.basicAuth.user, password: track(spec.basicAuth.password)}

    const requestBody = body ?? spec.bodyExample
    if(requestBody !== undefined && !headers.some(([name]) => name.toLowerCase() === 'content-type')) {
        headers.push(['Content-Type', 'application/json'])
    }

    const optional = new Set(spec.variables.filter(v => v.optional).map(v => v.name))
    const missing = Array.from(used).filter(name => !optional.has(name) && (values[name] ?? '') === '')
    return {method: spec.method, url, headers, body: requestBody, basicAuth, missing}
}

function shellQuote(str: string) {
    return `'${str.replaceAll(`'`, `'\\''`)}'`
}

function jsString(str: string) {
    return `'${str.replaceAll('\\', '\\\\').replaceAll(`'`, `\\'`)}'`
}

function pyString(str: string) {
    return `"${str.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
}

function indentBody(body: string, indent: string) {
    return body.trim().split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n')
}

export function toCurlSnippet(req: BuiltRequest, local: boolean): string {
    const lines = [`curl -X ${req.method} ${shellQuote(req.url)}`]
    // The local client API uses a self-signed certificate
    if(local) lines.push('-k')
    if(req.basicAuth) lines.push(`-u ${shellQuote(`${req.basicAuth.user}:${req.basicAuth.password}`)}`)
    for(const [name, value] of req.headers) lines.push(`-H ${shellQuote(`${name}: ${value}`)}`)
    if(req.body !== undefined) lines.push(`--data ${shellQuote(req.body.trim())}`)
    return lines.join(' \\\n  ')
}

export function toFetchSnippet(req: BuiltRequest, local: boolean): string {
    const headers = req.headers.map(([name, value]) => `    ${jsString(name)}: ${jsString(value)},`)
    if(req.basicAuth) {
        headers.push(`    'Authorization': 'Basic ' + btoa(${jsString(`${req.basicAuth.user}:${req.basicAuth.password}`)}),`)
    }
    const options = [`  method: ${jsString(req.method)},`]
    if(headers.length > 0) options.push(`  headers: {\n${headers.join('\n')}\n  },`)
    if(req.body !== undefined) options.push(`  body: JSON.stringify(${indentBody(req.body, '  ')}),`)

    const lines = []
    // Node.js rejects the local client API's self-signed certificate
    if(local) lines.push(`// Node.js: run with NODE_TLS_REJECT_UNAUTHORIZED=0 (self-signed certificate)`)
    lines.push(`const res = await fetch(${jsString(req.url)}, {\n${options.join('\n')}\n})`, '', 'const data = await res.json()')
    return lines.join('\n')
}

export function toPythonSnippet(req: BuiltRequest, local: boolean): string {
    const lines = ['import requests', '']
    lines.push(`url = ${pyString(req.url)}`)
    const args = ['url']
    if(req.headers.length > 0) {
        lines.push('headers = {', ...req.headers.map(([name, value]) => `    ${pyString(name)}: ${pyString(value)},`), '}')
        args.push('headers=headers')
    }
    if(req.basicAuth) args.push(`auth=(${pyString(req.basicAuth.user)}, ${pyString(req.basicAuth.password)})`)
    if(req.body !== undefined) {
        lines.push(`payload = ${indentBody(req.body, '').replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None')}`)
        args.push('json=payload')
    }
    if(local) args.push('verify=False')
    lines.push('', `res = requests.request(${pyString(req.method)}, ${args.join(', ')})`, 'data = res.json()')
    return lines.join('\n')
}

export const snippetLanguages = [
    {id: 'curl', label: 'cURL', build: toCurlSnippet},
    {id: 'js', label: 'JavaScript', build: toFetchSnippet},
    {id: 'py', label: 'Python', build: toPythonSnippet}
] as const

function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function highlightPlaceholders(escaped: string) {
    return escaped.replace(/\$?\{[a-zA-Z][\w\- ]*\}/g, m => `<span class="tv">${m}</span>`)
}

const keywords = new Set(['curl', 'const', 'await', 'fetch', 'import', 'requests', 'True', 'False', 'None', 'true', 'false', 'null', 'JSON', 'btoa'])

// A tiny highlighter for the generated snippets: strings, keywords, numbers, comments and {placeholders}
export function highlightCode(code: string): string {
    let out = ''
    let i = 0
    while(i < code.length) {
        const ch = code[i]
        if(ch === `'` || ch === '"' || ch === '`') {
            let j = i + 1
            while(j < code.length && code[j] !== ch) j += code[j] === '\\' ? 2 : 1
            out += `<span class="ts">${highlightPlaceholders(escapeHtml(code.slice(i, j + 1)))}</span>`
            i = j + 1
        } else if(ch === '/' && code[i + 1] === '/') {
            const end = code.indexOf('\n', i)
            const j = end === -1 ? code.length : end
            out += `<span class="tc">${escapeHtml(code.slice(i, j))}</span>`
            i = j
        } else if(/[A-Za-z_]/.test(ch)) {
            let j = i
            while(j < code.length && /[\w]/.test(code[j])) j++
            const word = code.slice(i, j)
            out += keywords.has(word) ? `<span class="tk">${word}</span>` : word
            i = j
        } else if(/[0-9]/.test(ch)) {
            let j = i
            while(j < code.length && /[0-9.]/.test(code[j])) j++
            out += `<span class="tn">${code.slice(i, j)}</span>`
            i = j
        } else if('{}[](),:'.includes(ch)) {
            out += `<span class="tp">${ch}</span>`
            i++
        } else {
            out += escapeHtml(ch)
            i++
        }
    }
    return out
}

export function highlightJson(json: string): string {
    const pattern = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}\[\],])/g
    let out = ''
    let last = 0
    for(const m of json.matchAll(pattern)) {
        out += escapeHtml(json.slice(last, m.index))
        const [all, str, colon, literal, num, punct] = m
        if(str !== undefined) {
            out += colon !== undefined ?
                `<span class="tf">${escapeHtml(str)}</span><span class="tp">${colon}</span>` :
                `<span class="ts">${escapeHtml(str)}</span>`
        } else if(literal !== undefined) out += `<span class="tk">${literal}</span>`
        else if(num !== undefined) out += `<span class="tn">${num}</span>`
        else if(punct !== undefined) out += `<span class="tp">${punct}</span>`
        else out += escapeHtml(all)
        last = m.index! + all.length
    }
    return out + escapeHtml(json.slice(last))
}

// Values a response hands out that other endpoints need, so they can be reused with one click
export const capturableValues: {path: string[], variable: string}[] = [
    {path: ['accessToken'], variable: 'auth token'},
    {path: ['token'], variable: 'entitlement token'},
    {path: ['entitlements_token'], variable: 'entitlement token'},
    {path: ['subject'], variable: 'puuid'},
    {path: ['sub'], variable: 'puuid'},
    {path: ['Subject'], variable: 'puuid'},
    {path: ['puuid'], variable: 'puuid'},
    {path: ['CurrentPartyID'], variable: 'party id'},
    {path: ['affinities', 'live'], variable: 'region'}
]

export function captureValues(data: unknown): Values {
    const found: Values = {}
    for(const {path, variable} of capturableValues) {
        let value: unknown = data
        for(const key of path) value = value !== null && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined
        if(typeof value === 'string' && value.length > 0 && found[variable] === undefined) found[variable] = value
    }
    return found
}
