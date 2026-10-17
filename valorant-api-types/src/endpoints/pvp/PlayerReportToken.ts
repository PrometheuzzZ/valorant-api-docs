import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const playerReportTokenEndpoint = {
    name: 'Player Report Token',
    description: 'Get a signed JWT token used to report a player from a specific match.',
    queryName: 'Restrictions_PlayerReportToken',
    category: 'Restrictions',
    type: 'pd',
    suffix: 'restrictions/v1/playerReportToken/{matchid}/{offenderpuuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Token: z.string().describe('Signed JWT report token')
        })
    }
} as const satisfies ValorantEndpoint
