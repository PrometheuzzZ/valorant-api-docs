import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'

export const playerAvoidListEndpoint = {
    name: 'Player Avoid List',
    description: 'Get the list of players the current player has chosen to avoid in matchmaking.',
    queryName: 'Restrictions_GetPlayerAvoidList',
    category: 'Restrictions',
    type: 'pd',
    suffix: 'restrictions/v1/avoidList',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Subject: playerUUIDSchema,
            AvoidList: z.array(z.unknown())
        })
    }
} as const satisfies ValorantEndpoint
