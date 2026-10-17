import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema, playerUUIDSchema} from '../../commonTypes'

const rosterSeasonInfoSchema = z.object({
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
    crest: z.string().describe('e.g. "NONE", "COMPETITOR", "PLAYOFFS"'),
    hasEarnedPromotionForNextSeason: z.boolean(),
    hasEarnedPrestige: z.boolean()
})

export const premierRosterEndpoint = {
    name: 'Roster',
    description: 'Get Premier roster (team) data by roster ID, including members, customization, and seasonal stats.',
    queryName: 'Premier_GetRoster',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v2/rosters/{rosterid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            rosterId: weakUUIDSchema,
            affinity: z.string().describe('Region affinity, e.g. "eu", "na"'),
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
            invites: z.array(z.unknown()),
            locks: z.array(z.unknown()),
            season: rosterSeasonInfoSchema,
            minimumRequiredMembersForEnrollment: z.number(),
            matchesSinceReset: z.number(),
            tournamentsSinceReset: z.number(),
            version: z.object({
                socialVersion: z.number(),
                premierVersion: z.number()
            }),
            updatedAt: z.number().describe('Unix timestamp (seconds)'),
            createdAt: z.number().describe('Unix timestamp (seconds)'),
            seasonalInfoBySeasonID: z.record(weakUUIDSchema, rosterSeasonInfoSchema),
            prestige: z.object({
                earnedPrestige: z.boolean(),
                plating: z.string()
            })
        })
    }
} as const satisfies ValorantEndpoint
