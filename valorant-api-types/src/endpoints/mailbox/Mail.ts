import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'
import {mailIDSchema, mailSchema} from './Mailbox'

export const mailEndpoint = {
    name: 'Mail',
    description: 'Get a single mail by its ID. The response is the same object as the entries of the [GET Mailbox] endpoint, just not wrapped in an array.',
    category: 'Mailbox',
    type: 'other',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/mailbox/v1/{puuid}/mail/{mail id}',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, ZodType>([
        ['cluster', z.string().describe('SGP region cluster, e.g. `euc-prod` for EU')],
        ['puuid', playerUUIDSchema],
        ['mail id', mailIDSchema.describe('The ID of the mail, obtained from the [GET Mailbox] endpoint')]
    ]),
    responses: {
        '200': mailSchema
    }
} as const satisfies ValorantEndpoint

export type MailResponse = z.input<typeof mailEndpoint.responses['200']>
