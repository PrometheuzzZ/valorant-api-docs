import type {ZodTypeAny} from 'zod'

// A zod schema flattened into what the docs show for each attribute
export interface SchemaField {
    name: string
    type: string
    // Colour family of the type pill
    tone: 'string' | 'number' | 'object' | 'bool' | 'other'
    optional: boolean
    nullable: boolean
    description?: string
    values?: string[]
    children?: SchemaField[]
}

interface Described {
    type: string
    tone: SchemaField['tone']
    optional: boolean
    nullable: boolean
    description?: string
    values?: string[]
    children?: SchemaField[]
}

const maxDepth = 8

function typeName(schema: ZodTypeAny): string {
    return (schema._def as {typeName?: string}).typeName ?? ''
}

function isUuid(schema: ZodTypeAny) {
    const checks = (schema._def as {checks?: {kind: string, regex?: RegExp}[]}).checks ?? []
    return checks.some(check => check.kind === 'uuid' || (check.kind === 'regex' && check.regex?.source.includes('[a-f0-9]{8}')))
}

function literalValue(schema: ZodTypeAny): string | undefined {
    if(typeName(schema) !== 'ZodLiteral') return undefined
    return JSON.stringify((schema._def as {value: unknown}).value)
}

function describe(schema: ZodTypeAny, depth: number): Described {
    let optional = false
    let nullable = false
    let description = schema.description

    // Peel off wrappers, keeping the first description found
    for(;;) {
        const name = typeName(schema)
        const def = schema._def as any
        if(name === 'ZodOptional' || name === 'ZodDefault') {
            optional = true
            schema = name === 'ZodOptional' ? def.innerType : def.innerType
        } else if(name === 'ZodNullable') {
            nullable = true
            schema = def.innerType
        } else if(name === 'ZodEffects') {
            schema = def.schema
        } else if(name === 'ZodLazy') {
            schema = def.getter()
        } else if(name === 'ZodBranded' || name === 'ZodReadonly' || name === 'ZodCatch') {
            schema = def.type ?? def.innerType
        } else if(name === 'ZodPipeline') {
            schema = def.in
        } else {
            break
        }
        description ??= schema.description
    }

    const base = {optional, nullable, description}
    const def = schema._def as any
    switch(typeName(schema)) {
        case 'ZodString':
            return {...base, type: isUuid(schema) ? 'string · uuid' : 'string', tone: 'string'}
        case 'ZodNumber':
        case 'ZodBigInt':
            return {...base, type: 'number', tone: 'number'}
        case 'ZodBoolean':
            return {...base, type: 'boolean', tone: 'bool'}
        case 'ZodDate':
            return {...base, type: 'date', tone: 'string'}
        case 'ZodNull':
            return {...base, type: 'null', tone: 'other'}
        case 'ZodAny':
        case 'ZodUnknown':
            return {...base, type: 'any', tone: 'other'}
        case 'ZodLiteral':
            return {...base, type: 'literal', tone: 'string', values: [literalValue(schema)!]}
        case 'ZodEnum':
            return {...base, type: 'enum', tone: 'object', values: (def.values as string[]).map(v => JSON.stringify(v))}
        case 'ZodNativeEnum':
            return {...base, type: 'enum', tone: 'object', values: Object.values(def.values as object).map(v => JSON.stringify(v))}
        case 'ZodObject': {
            const shape = typeof def.shape === 'function' ? def.shape() : def.shape
            const children = depth < maxDepth ? fieldsOf(shape, depth + 1) : undefined
            return {...base, type: 'object', tone: 'object', children}
        }
        case 'ZodRecord': {
            const value = describe(def.valueType, depth + 1)
            return {...base, type: `record<string, ${value.type}>`, tone: 'object', children: value.children}
        }
        case 'ZodMap': {
            const value = describe(def.valueType, depth + 1)
            return {...base, type: `map<${value.type}>`, tone: 'object', children: value.children}
        }
        case 'ZodArray':
        case 'ZodSet': {
            const item = describe(typeName(schema) === 'ZodArray' ? def.type : def.valueType, depth + 1)
            return {...base, type: `array[${item.type}]`, tone: 'object', children: item.children, values: item.values}
        }
        case 'ZodTuple': {
            const items = (def.items as ZodTypeAny[]).map(item => describe(item, depth + 1).type)
            return {...base, type: `[${items.join(', ')}]`, tone: 'object'}
        }
        case 'ZodUnion':
        case 'ZodDiscriminatedUnion': {
            const options: ZodTypeAny[] = Array.isArray(def.options) ? def.options : Array.from(def.options.values())
            const literals = options.map(literalValue)
            if(literals.every(v => v !== undefined)) {
                return {...base, type: 'enum', tone: 'object', values: literals as string[]}
            }
            const described = options.map(option => describe(option, depth + 1))
            // "string | ''" style unions read better as the main type
            const types = Array.from(new Set(described.map(d => d.type)))
            const withChildren = described.find(d => d.children !== undefined)
            return {
                ...base,
                type: types.join(' | '),
                tone: described[0]?.tone ?? 'other',
                children: withChildren?.children,
                optional: base.optional || described.some(d => d.optional),
                nullable: base.nullable || described.some(d => d.nullable)
            }
        }
        case 'ZodIntersection': {
            const left = describe(def.left, depth + 1)
            const right = describe(def.right, depth + 1)
            return {...base, type: 'object', tone: 'object', children: [...(left.children ?? []), ...(right.children ?? [])]}
        }
        default:
            return {...base, type: typeName(schema).replace(/^Zod/, '').toLowerCase() || 'unknown', tone: 'other'}
    }
}

function fieldsOf(shape: Record<string, ZodTypeAny>, depth: number): SchemaField[] {
    return Object.entries(shape).map(([name, schema]) => ({name, ...describe(schema, depth)}))
}

// The attributes of a schema; a top-level non-object schema becomes a single unnamed field
export function schemaToFields(schema: ZodTypeAny): {root: Described, fields: SchemaField[]} {
    const root = describe(schema, 0)
    return {root, fields: root.children ?? []}
}

export function schemaType(schema: ZodTypeAny): Described {
    return describe(schema, maxDepth)
}
