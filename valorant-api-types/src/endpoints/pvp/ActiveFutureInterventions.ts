import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'

const interventionSchema = z.object({
    InterventionName: z.string(),
    Expiry: z.string(),
    IssuingTime: z.string(),
    OriginInfraction: z.string()
})

export const activeFutureInterventionsEndpoint = {
    name: 'Active Future Interventions',
    description: 'Get active and upcoming behavioral interventions (penalties) for the player, grouped by behavior category such as AFK or queue dodging.',
    queryName: 'Restrictions_FetchActiveFutureInterventions',
    category: 'PVP Endpoints',
    type: 'pd',
    suffix: 'restrictions/v1/activeFutureInterventions',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Subject: playerUUIDSchema,
            InterventionsByCategory: z.array(z.object({
                BehaviorCategory: z.string().describe('e.g. "PARTICIPATION"'),
                BehaviorRatingName: z.string().describe('e.g. "afk"'),
                LastRatingReduction: z.string(),
                ActiveInterventions: z.array(interventionSchema),
                NextInterventionNames: z.array(z.string()),
                AppliedInfractions: z.record(z.string(), z.object({
                    InfractionName: z.string(),
                    Severity: z.string().describe('e.g. "MODERATE"'),
                    AppliedInterventions: z.array(interventionSchema)
                }))
            }))
        })
    }
} as const satisfies ValorantEndpoint
