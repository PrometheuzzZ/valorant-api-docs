import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

const leagueMatchEntrySchema = z.object({
    matchId: weakUUIDSchema,
    leaguePointsBefore: z.number(),
    leaguePointsAfter: z.number(),
    leaguePointsEarned: z.number(),
    startTime: z.number().describe('Milliseconds since epoch')
})

const tournamentMatchDataEntrySchema = z.object({
    points: z.number(),
    roundNumber: z.number(),
    totalRounds: z.number(),
    bracketType: z.string().describe('e.g. "WINNERS", "LOSERS"')
})

const tournamentMatchEntrySchema = z.object({
    tournamentId: weakUUIDSchema,
    finalPlacement: z.number(),
    finalPlacementLeaguePointsBonus: z.number(),
    leaguePointsBefore: z.number(),
    leaguePointsAfter: z.number(),
    leaguePointsEarned: z.number(),
    startTime: z.number().describe('Unix timestamp (seconds)'),
    matchEntries: z.record(weakUUIDSchema, z.number()).describe('Map of match ID to score'),
    tournamentMatchData: z.record(weakUUIDSchema, tournamentMatchDataEntrySchema)
})

export const premierRosterMatchHistoryEndpoint = {
    name: 'Premier Roster Match History',
    description: 'Get the Premier match history for a roster, split by league and tournament matches.',
    queryName: 'Premier_GetRosterMatchHistory',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v1/rosters/{rosterid}/matchhistory',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            id: weakUUIDSchema.describe('Roster ID'),
            leagueMatchHistory: z.array(leagueMatchEntrySchema),
            tournamentMatchHistory: z.array(tournamentMatchEntrySchema)
        })
    }
} as const satisfies ValorantEndpoint
