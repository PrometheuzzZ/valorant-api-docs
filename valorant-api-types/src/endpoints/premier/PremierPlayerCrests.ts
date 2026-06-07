import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema, weakUUIDSchema} from '../../commonTypes'

const premierSeasonSchema = z.object({
    seasonId: weakUUIDSchema,
    rosterId: weakUUIDSchema,
    rosterName: z.string(),
    rosterTag: z.string(),
    conference: z.string().describe('e.g. "EU_WEST", "EU_NORTH"'),
    division: z.number(),
    points: z.number(),
    crest: z.string().describe('e.g. "NONE", "COMPETITOR", "PLAYOFFS"'),
    championshipPointRequirement: z.number(),
    gamesPlayedByEventType: z.record(z.string(), z.number()).describe('Map of event type (e.g. "LEAGUE", "TOURNAMENT") to games played')
})

export const premierPlayerCrestsEndpoint = {
    name: 'Get Premier Player Crests',
    description: 'Get Premier season history and crest data for a player.',
    queryName: 'Premier_GetPlayerCrests',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v2/players/{puuid}/crests',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            puuid: playerUUIDSchema,
            contenderEligibilityExpiry: z.string().describe('ISO 8601 date string'),
            seasons: z.record(weakUUIDSchema, premierSeasonSchema).describe('Map of season ID to season crest data')
        })
    }
} as const satisfies ValorantEndpoint
