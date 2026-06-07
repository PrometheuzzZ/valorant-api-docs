import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'

export const premierEligibilityEndpoint = {
    name: 'Premier Eligibility',
    description: 'Get the Premier eligibility status for the player, including account verification, ranked placement, and any active restrictions.',
    queryName: 'Premier_GetEligibility',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v1/player/eligibility',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            subject: playerUUIDSchema,
            accountVerificationStatus: z.boolean(),
            rankedPlacementCompletionStatus: z.boolean(),
            matchLimitReached: z.boolean(),
            isOnProvidedRoster: z.boolean(),
            playerRestrictions: z.unknown().nullable()
        })
    }
} as const satisfies ValorantEndpoint
