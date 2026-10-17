import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema, playerUUIDSchema} from '../../commonTypes'

const pointDeltasSchema = z.object({
    before: z.number(),
    after: z.number(),
    earned: z.number()
})

const matchEntrySchema = z.object({
    matchId: weakUUIDSchema,
    seasonId: weakUUIDSchema,
    eventId: weakUUIDSchema,
    startTime: z.number().describe('Milliseconds since epoch'),
    pointDeltas: pointDeltasSchema,
    outcome: z.string().describe('e.g. "win", "loss"'),
    opponentRosterID: weakUUIDSchema
})

const tournamentMatchDataSchema = z.object({
    points: z.number(),
    roundNumber: z.number(),
    totalRounds: z.number(),
    bracketType: z.string().describe('e.g. "WINNERS", "LOSERS"')
})

const tournamentEntrySchema = z.object({
    tournamentId: weakUUIDSchema,
    placement: z.number(),
    startTime: z.number().describe('Unix timestamp (seconds)'),
    pointDeltas: pointDeltasSchema,
    matches: z.record(weakUUIDSchema, tournamentMatchDataSchema)
})

const seasonInfoSchema = z.object({
    id: weakUUIDSchema,
    isEnrolled: z.boolean(),
    conference: z.string(),
    division: z.number(),
    isProvisionalDivision: z.boolean(),
    promotionApplied: z.boolean(),
    points: z.number(),
    wins: z.number(),
    gamesPlayed: z.number(),
    seasonMatchRoundWins: z.number(),
    seasonMatchRoundsPlayed: z.number(),
    crest: z.string().describe('e.g. "NONE", "FIRST", "COMPETITOR"'),
    plating: z.string().describe('e.g. "BASIC", "QUALIFIED"'),
    matches: z.record(weakUUIDSchema, matchEntrySchema).optional(),
    tournaments: z.record(weakUUIDSchema, tournamentEntrySchema).optional(),
    hasEarnedPromotionForNextSeason: z.boolean(),
    hasEarnedPrestige: z.boolean()
})

export const premierRosterPublicInfoEndpoint = {
    name: 'Premier Roster Public Info',
    description: 'Get public info for a Premier roster by roster ID, including members, customization, and detailed season match/tournament data.',
    queryName: 'Premier_GetRosterPublicInfo',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v2/rosters/{rosterid}/publicInfo',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            rosterId: weakUUIDSchema,
            name: z.string(),
            tag: z.string(),
            customization: z.object({
                icon: weakUUIDSchema,
                primaryColor: z.string().describe('Unreal Engine color string'),
                secondaryColor: z.string(),
                tertiaryColor: z.string()
            }),
            members: z.array(z.object({
                puuid: playerUUIDSchema,
                role: z.enum(['OWNER', 'MEMBER']),
                roleId: z.number(),
                createdAt: z.number().describe('Unix timestamp (seconds)')
            })),
            season: seasonInfoSchema,
            version: z.object({
                socialVersion: z.number(),
                premierVersion: z.number()
            }),
            createdAt: z.number().describe('Unix timestamp (seconds)'),
            seasonalInfoBySeasonID: z.record(weakUUIDSchema, seasonInfoSchema)
        })
    }
} as const satisfies ValorantEndpoint
