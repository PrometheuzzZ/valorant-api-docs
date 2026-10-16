import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {queueIDSchema} from '../../commonTypes'

export const bloomlineValidQueuesEndpoint = {
    name: 'Bloomline Valid Queues',
    description: 'Get the queues whose matches count towards Bloomline progression, and the queues that track a performance score.',
    queryName: 'Bloomline_FetchValidQueues',
    category: 'Bloomline',
    type: 'pd',
    suffix: 'bloomline/v0/config/valid-queues',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            ProcessedQueues: z.array(queueIDSchema).describe('Queues that progress Bloomline'),
            PerformanceScoreQueues: z.array(queueIDSchema).describe('Queues that track a performance score')
        })
    }
} as const satisfies ValorantEndpoint

export type BloomlineValidQueuesResponse = z.input<typeof bloomlineValidQueuesEndpoint.responses['200']>
