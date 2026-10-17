import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {entitlementsSchema} from './OwnedItems'

export const allOwnedItemsEndpoint = {
    name: 'All Owned Items',
    description: 'List everything the player owns across every item type. ' +
        'This is the [GET Owned Items] endpoint without an item type, so the response contains one ' +
        '`EntitlementsByTypes` entry per item type the player owns items of.\n\n' +
        'Note that item types the player owns nothing of are omitted from the response.',
    queryName: 'Store_GetEntitlements',
    category: 'Store',
    type: 'pd',
    suffix: 'store/v1/entitlements/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': entitlementsSchema
    }
} as const satisfies ValorantEndpoint

export type AllOwnedItemsResponse = z.input<typeof allOwnedItemsEndpoint.responses['200']>
