import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'

export const giftPurchaserEligibilityEndpoint = {
    name: 'Gift Purchaser Eligibility',
    description: 'Check whether a player is eligible to send gifts to others.',
    queryName: 'Store_GetGiftPurchaserEligibility',
    category: 'Store Endpoints',
    type: 'pd',
    suffix: 'store/v1/gifts/{puuid}/purchasereligibility',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            FailureReasons: z.array(z.string()),
            GiftingEligibleStatus: z.number().describe('0 = not eligible, 2 = eligible')
        })
    }
} as const satisfies ValorantEndpoint
