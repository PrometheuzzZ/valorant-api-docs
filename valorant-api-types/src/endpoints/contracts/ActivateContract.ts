import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {contractsResponse, weakUUIDSchema} from '../../commonTypes'

export const activateContractEndpoint = {
    name: 'Activate Contract',
    description: 'Activate a specific contract by ID',
    queryName: 'Contracts_Activate',
    category: 'Contracts',
    type: 'pd',
    suffix: 'contracts/v1/contracts/{puuid}/special/{contract id}',
    method: 'POST',
    variables: new Map([
        ['contract id', weakUUIDSchema.describe('The contract ID to activate')]
    ]),
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    responses: {
        '200': contractsResponse
    }
} as const satisfies ValorantEndpoint

export type ActivateContractResponse = z.input<typeof activateContractEndpoint.responses['200']>