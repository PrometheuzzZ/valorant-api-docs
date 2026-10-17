import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema, weakUUIDSchema} from '../../commonTypes'

export const premierPlayerEndpoint = {
    name: 'Premier Player',
    description: 'Get Premier player data including roster membership and invite status.',
    queryName: 'Premier_GetPlayer_V2',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v2/players/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            puuid: playerUUIDSchema,
            rosterId: weakUUIDSchema.describe('The Premier roster (team) ID the player belongs to'),
            invites: z.array(z.unknown()).describe('Pending Premier roster invites'),
            version: z.number(),
            createdAt: z.number().describe('Unix timestamp (seconds)'),
            updatedAt: z.number().describe('Unix timestamp (seconds)')
        })
    }
} as const satisfies ValorantEndpoint
