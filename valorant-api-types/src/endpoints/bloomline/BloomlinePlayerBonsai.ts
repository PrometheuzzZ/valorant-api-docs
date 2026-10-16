import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {bloomlinePlayerSchema} from './BloomlineTypes'

export const bloomlinePlayerBonsaiEndpoint = {
    name: 'Bloomline Player Bonsai',
    description: 'Get the player\'s Bloomline for a single agent. Unlike [GET Bloomline Player], the bonsai includes its `NumberModules` (the agent stats).',
    queryName: 'Bloomline_FetchPlayerForBonsai',
    category: 'Bloomline',
    type: 'pd',
    suffix: 'bloomline/v0/players/{puuid}/bonsai/{agent id}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': bloomlinePlayerSchema
    }
} as const satisfies ValorantEndpoint

export type BloomlinePlayerBonsaiResponse = z.input<typeof bloomlinePlayerBonsaiEndpoint.responses['200']>
