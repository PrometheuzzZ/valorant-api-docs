import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {bloomlinePlayerSchema} from './BloomlineTypes'

export const bloomlinePlayerEndpoint = {
    name: 'Bloomline Player',
    description: 'Get the player\'s Bloomline (agent progression) for every agent. Each entry of `Bonsais` is one agent, the `BonsaiID` being the agent UUID.',
    queryName: 'Bloomline_FetchPlayer',
    category: 'Bloomline',
    type: 'pd',
    suffix: 'bloomline/v0/players/{puuid}',
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

export type BloomlinePlayerResponse = z.input<typeof bloomlinePlayerEndpoint.responses['200']>
