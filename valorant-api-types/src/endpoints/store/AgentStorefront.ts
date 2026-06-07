import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

const storeOfferSchema = z.object({
    OfferID: weakUUIDSchema,
    IsDirectPurchase: z.boolean(),
    StartDate: z.string().describe('ISO 8601 datetime'),
    Cost: z.record(weakUUIDSchema, z.number()).describe('Map of currency ID to price'),
    Rewards: z.array(z.object({
        ItemTypeID: weakUUIDSchema,
        ItemID: weakUUIDSchema,
        Quantity: z.number()
    }))
})

export const agentStorefrontEndpoint = {
    name: 'Agent Storefront',
    description: 'Get the agent store, listing all purchasable agents with their available offers and costs.',
    queryName: 'Store_GetAgentStorefront',
    category: 'Store Endpoints',
    type: 'pd',
    suffix: 'store/v1/storefronts/agent',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            AgentStore: z.object({
                AgentStoreOffers: z.array(z.object({
                    AgentID: weakUUIDSchema,
                    StoreOffers: z.array(storeOfferSchema)
                })),
                CurrentFeaturedAgent: weakUUIDSchema,
                NextFeaturedAgent: weakUUIDSchema
            })
        })
    }
} as const satisfies ValorantEndpoint
