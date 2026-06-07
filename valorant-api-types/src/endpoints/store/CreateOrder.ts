import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const createOrderEndpoint = {
    name: 'Create Order',
    description: 'Create an in-game purchase order. The `OfferID` can be obtained from the [POST Storefront](storefront) endpoint.',
    queryName: 'Store_CreateOrder',
    category: 'Store Endpoints',
    type: 'pd',
    method: 'POST',
    suffix: 'store/v1/order/',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    body: z.object({
        XID: z.string().length(36).describe('Unique Riot identifier (36 characters, UUID format)'),
        OfferID: weakUUIDSchema.describe('The offer to purchase. Available offers can be found from the Storefront endpoint.')
    }),
    responses: {
        '200': z.object({
            OrderID: weakUUIDSchema.describe('The order UUID. Use with the Get Order endpoint to check order status.'),
            Status: z.enum(['ACCEPTED', 'COMPLETE', 'FAILED'])
        })
    }
} as const satisfies ValorantEndpoint
