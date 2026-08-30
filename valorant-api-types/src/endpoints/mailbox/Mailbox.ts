import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {playerUUIDSchema, weakUUIDSchema} from '../../commonTypes'

export const mailIDSchema = weakUUIDSchema.describe('Mail ID')

export const mailSchema = z.object({
    mailId: mailIDSchema,
    puuid: playerUUIDSchema.describe('The player the mail was sent to'),
    message: z.string().describe('JSON-encoded string with the contents of the mail. The keys depend on the type of mail, for example `{"product":"valorant","category":"COMMS_ABUSE_TEXT","recipientType":"","offenderRiotId":"name#tag"}`'),
    product: z.string().describe('e.g. "valorant"'),
    region: z.string().nullable(),
    tags: z.array(z.string()).describe('e.g. `["ga-reporter-feedback-notification"]`'),
    mailType: z.string().describe('e.g. "ACK_REQUIRED"'),
    state: z.string().describe('e.g. "NEW", "READ", "ACKNOWLEDGED"'),
    createdAt: z.number().describe('Milliseconds since epoch')
})

export const mailboxEndpoint = {
    name: 'Mailbox',
    description: 'Get the in-game mail of a player, such as the notifications sent after a report is acted on.\n\nThe `{cluster}` is the SGP cluster of the player\'s region and the `{puuid}` must be your own.',
    category: 'Mailbox',
    type: 'other',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/mailbox/v1/{puuid}/product/valorant',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, ZodType>([
        ['cluster', z.string().describe('SGP region cluster, e.g. `euc-prod` for EU')],
        ['puuid', playerUUIDSchema]
    ]),
    query: new Map<string, ZodType>([
        ['count', z.number().optional().describe('Maximum number of mails to return, e.g. `100`')],
        ['startIndex', z.number().optional().describe('Index of the first mail to return, used together with `count` for pagination')],
        ['includedStates', z.string().optional().describe('Only return mails in this state. Can be repeated to include multiple states, e.g. `includedStates=NEW&includedStates=READ&includedStates=ACKNOWLEDGED`. Observed values: `NEW`, `READ`, `ACKNOWLEDGED`')]
    ]),
    responses: {
        '200': z.array(mailSchema)
    }
} as const satisfies ValorantEndpoint

export type MailboxResponse = z.input<typeof mailboxEndpoint.responses['200']>
