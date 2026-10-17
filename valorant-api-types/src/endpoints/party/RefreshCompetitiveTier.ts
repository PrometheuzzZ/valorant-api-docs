import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema} from '../../commonTypes'
import {z} from 'zod'

export const refreshCompetitiveTierEndpoint = {
    name: 'Refresh Competitive Tier',
    description: 'Refresh the competitive tier of the specified player',
    queryName: 'Party_RefreshCompetitiveTier',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/parties/{party id}/members/{puuid}/refreshCompetitiveTier',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    responses: {
        '200': partySchema
    }
} as const satisfies ValorantEndpoint

export type RefreshCompetitiveTierResponse = z.input<typeof refreshCompetitiveTierEndpoint.responses['200']>