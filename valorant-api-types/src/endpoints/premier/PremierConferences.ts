import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

const premierConferenceSchema = z.object({
    id: weakUUIDSchema,
    key: z.string().describe('Conference identifier, e.g. "EU_DACH", "EU_NORTH"'),
    isSuper: z.boolean().describe('Whether this is a super conference'),
    gamePods: z.array(z.string()).describe('Game server pod identifiers'),
    timezone: z.string().describe('IANA timezone, e.g. "Europe/Berlin"'),
    superConference: z.string().optional().describe('Parent super conference key (only on non-super conferences)'),
    leaderboardPlayoffQualificationDateTime: z.string(),
    leaderboardPromotionFinalizationDateTime: z.string()
})

export const premierConferencesEndpoint = {
    name: 'Premier Conferences',
    description: 'Get all Premier conferences for a given affinity/region, including both regular and super conferences.',
    queryName: 'Premier_GetConferences',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v1/affinities/{affinity}/conferences',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            PremierConferences: z.array(premierConferenceSchema)
        })
    }
} as const satisfies ValorantEndpoint
