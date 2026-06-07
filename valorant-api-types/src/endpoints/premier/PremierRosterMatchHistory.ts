import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const premierRosterMatchHistoryEndpoint = {
    name: 'Premier Roster Match History',
    description: 'Get the Premier match history for a roster, split by league and tournament matches.',
    queryName: 'Premier_GetRosterMatchHistory',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v2/rosters/{rosterid}/matchhistory',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            id: weakUUIDSchema.describe('Roster ID'),
            leagueMatchHistory: z.array(z.unknown()),
            tournamentMatchHistory: z.array(z.unknown())
        })
    }
} as const satisfies ValorantEndpoint
