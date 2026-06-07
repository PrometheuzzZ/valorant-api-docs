import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'

export const partyRemovePlayerEndpoint = {
    name: 'Party Remove Player',
    description: 'Remove a player from the current party',
    queryName: 'Party_RemovePlayer',
    category: 'Party',
    type: 'glz',
    suffix: 'parties/v1/players/{puuid}',
    method: 'DELETE',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    responses: {
        '204': z.undefined()
    }
} as const satisfies ValorantEndpoint