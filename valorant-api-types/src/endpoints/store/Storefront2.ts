import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {currencyIDSchema, itemIDSchema, itemTypeIDSchema, offerSchema, weakUUIDSchema} from '../../commonTypes'

const bundleItemSchema = z.object({
    Item: z.object({
        ItemTypeID: itemTypeIDSchema,
        ItemID: itemIDSchema,
        Amount: z.number()
    }),
    BasePrice: z.number(),
    CurrencyID: currencyIDSchema,
    DiscountPercent: z.number(),
    DiscountedPrice: z.number(),
    IsPromoItem: z.boolean()
})

const bundleSchema = z.object({
    ID: weakUUIDSchema,
    DataAssetID: weakUUIDSchema,
    CurrencyID: currencyIDSchema,
    Items: z.array(bundleItemSchema),
    ItemOffers: z.array(z.object({
        BundleItemOfferID: weakUUIDSchema,
        Offer: offerSchema,
        DiscountPercent: z.number(),
        DiscountedCost: z.record(weakUUIDSchema, z.number())
    })).nullable(),
    TotalBaseCost: z.record(weakUUIDSchema, z.number()).nullable(),
    TotalDiscountedCost: z.record(weakUUIDSchema, z.number()).nullable(),
    TotalDiscountPercent: z.number(),
    DurationRemainingInSeconds: z.number(),
    WholesaleOnly: z.boolean()
})

const pluginStoreEntrySchema = z.object({
    OfferID: weakUUIDSchema,
    StorefrontItemID: weakUUIDSchema,
    StartDate: z.string(),
    EndDate: z.string(),
    Priority: z.number(),
    Cost: z.record(weakUUIDSchema, z.number()),
    Rewards: z.array(z.object({
        ItemTypeID: itemTypeIDSchema,
        ItemID: itemIDSchema,
        Quantity: z.number()
    }))
})

export const storefront2Endpoint = {
    name: 'Storefront2',
    description: 'Get the currently available items in the store (v3)',
    queryName: 'Store_GetStorefrontV3',
    category: 'Store Endpoints',
    type: 'pd',
    method: 'POST',
    suffix: 'store/v3/storefront/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    body: z.object({}),
    responses: {
        '200': z.object({
            FeaturedBundle: z.object({
                Bundle: bundleSchema,
                Bundles: z.array(bundleSchema),
                BundleRemainingDurationInSeconds: z.number()
            }),
            SkinsPanelLayout: z.object({
                SingleItemOffers: z.array(itemIDSchema),
                SingleItemStoreOffers: z.array(offerSchema),
                SingleItemOffersRemainingDurationInSeconds: z.number()
            }),
            UpgradeCurrencyStore: z.object({
                UpgradeCurrencyOffers: z.array(z.object({
                    OfferID: weakUUIDSchema,
                    StorefrontItemID: itemIDSchema,
                    Offer: offerSchema,
                    DiscountedPercent: z.number()
                }))
            }),
            AccessoryStore: z.object({
                AccessoryStoreOffers: z.array(z.object({
                    Offer: offerSchema,
                    ContractID: weakUUIDSchema
                })),
                AccessoryStoreRemainingDurationInSeconds: z.number(),
                StorefrontID: weakUUIDSchema
            }),
            PluginStores: z.array(z.object({
                PluginID: weakUUIDSchema,
                PluginInstanceID: weakUUIDSchema,
                StorefrontItemID: weakUUIDSchema,
                Offers: z.array(pluginStoreEntrySchema),
                DurationRemainingInSeconds: z.number(),
                StorefrontExpiry: z.string()
            })),
            BonusStore: z.object({
                BonusStoreOffers: z.array(z.object({
                    BonusOfferID: weakUUIDSchema,
                    Offer: offerSchema,
                    DiscountPercent: z.number(),
                    DiscountCosts: z.record(weakUUIDSchema, z.number()),
                    IsSeen: z.boolean()
                })),
                BonusStoreRemainingDurationInSeconds: z.number()
            }).optional().describe('Night market')
        })
    }
} as const satisfies ValorantEndpoint

export type Storefront2Response = z.input<typeof storefront2Endpoint.responses['200']>
