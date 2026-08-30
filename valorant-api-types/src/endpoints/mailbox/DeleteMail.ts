import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {playerUUIDSchema} from '../../commonTypes'
import {mailIDSchema} from './Mailbox'

export const deleteMailEndpoint = {
    name: 'Delete Mail',
    description: 'Delete a single mail by its ID. The mail no longer shows up in the [GET Mailbox] endpoint afterwards.',
    category: 'Mailbox',
    type: 'other',
    method: 'DELETE',
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
        '204': z.undefined()
    }
} as const satisfies ValorantEndpoint

export type DeleteMailResponse = z.input<typeof deleteMailEndpoint.responses['204']>
