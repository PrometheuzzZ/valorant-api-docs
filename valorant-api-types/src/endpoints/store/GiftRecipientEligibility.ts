import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'

export const giftRecipientEligibilityEndpoint = {
    name: 'Gift Recipient Eligibility',
    description: 'Check whether a specific recipient player is eligible to receive a gift from the purchaser.',
    queryName: 'Store_CheckGiftRecipientEligibility',
    category: 'Store Endpoints',
    type: 'pd',
    method: 'POST',
    suffix: 'store/v1/gifts/{puuid}/eligibility/{recipientpuuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            PurchaserFailureReasons: z.array(z.string()),
            RecipientFailureReasons: z.array(z.string()),
            RecipientOffers: z.array(z.unknown())
        })
    }
} as const satisfies ValorantEndpoint
