import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema} from '../../commonTypes'
import {z} from 'zod'

export const partyEndpoint = {
    name: 'Party',
    description: 'Get the party information for the given party ID',
    queryName: 'Party_FetchParty',
    category: 'Party',
    type: 'glz',
    suffix: 'parties/v1/parties/{party id}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': partySchema
    }
} as const satisfies ValorantEndpoint

export type PartyResponse = z.input<typeof partyEndpoint.responses['200']>