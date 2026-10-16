import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {bloomlinePlayerSchema} from './BloomlineTypes'

// The client sends IDs as 32 uppercase hex digits without dashes
const compactIDSchema = z.string().describe('ID as 32 hex digits without dashes')

export const updateBloomlinePlayerBonsaiEndpoint = {
    name: 'Update Bloomline Player Bonsai',
    description: 'Set the hype, background, clip, border and number modules shown for an agent. ' +
        'IDs in the body are written as 32 uppercase hex digits without dashes, and `00000000000000000000000000000000` clears a slot.',
    queryName: 'Bloomline_UpdateBloomlinePlayerForBonsai',
    category: 'Bloomline',
    type: 'pd',
    method: 'POST',
    suffix: 'bloomline/v0/players/{puuid}/bonsai/{agent id}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    body: z.object({
        bonsaiId: compactIDSchema.describe('The agent UUID without dashes'),
        hypeId: compactIDSchema,
        backgroundId: compactIDSchema,
        clipId: compactIDSchema,
        borderId: compactIDSchema,
        moduleUpdates: z.array(z.object({
            iD: compactIDSchema.describe('Module slot ID'),
            type: compactIDSchema,
            item: compactIDSchema.describe('Stat ID to show in the slot')
        }))
    }),
    responses: {
        '200': bloomlinePlayerSchema
    }
} as const satisfies ValorantEndpoint

export type UpdateBloomlinePlayerBonsaiResponse = z.input<typeof updateBloomlinePlayerBonsaiEndpoint.responses['200']>
