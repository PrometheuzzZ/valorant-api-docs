import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema} from '../../commonTypes'
import {z} from 'zod'

export const partyGenerateCodeEndpoint = {
    name: 'Party Generate Code',
    description: 'Generate a party invite code',
    queryName: 'Party_CreateInviteCode',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/parties/{party id}/invitecode',
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

export type PartyGenerateCodeResponse = z.input<typeof partyGenerateCodeEndpoint.responses['200']>