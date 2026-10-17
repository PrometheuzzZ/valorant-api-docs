import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema, itemIDSchema} from '../../commonTypes'

const orderRewardItemSchema = z.object({
    RewardID: itemIDSchema,
    Amount: z.number()
})

export const getOrderEndpoint = {
    name: 'Get Order',
    description: 'Get the status and rewards of a purchase order. The `{order id}` can be obtained from the [POST Create Order](create-order) endpoint.',
    queryName: 'Store_GetOrder',
    category: 'Store',
    type: 'pd',
    suffix: 'store/v1/order/{order id}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            OrderID: weakUUIDSchema,
            Status: z.enum(['ACCEPTED', 'COMPLETE', 'FAILED']),
            OrderRewards: z.record(z.string(), z.array(orderRewardItemSchema))
                .describe('Map of reward category (e.g. "Cards", "Skins", "Buddies", "Bundles") to reward items')
        })
    }
} as const satisfies ValorantEndpoint
