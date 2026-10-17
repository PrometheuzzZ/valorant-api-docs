import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {partyIDSchema, weakUUIDSchema} from '../../commonTypes'

export const activityIDSchema = weakUUIDSchema.describe('Activity ID')

export const activityLookupEndpoint = {
    name: 'Activity Lookup',
    description: 'Look up the activity ID of a party. The activity ID is required for the join link endpoints, ' +
        'such as the [POST Shared Join Link] and [DELETE Disable Join Link] endpoints.',
    category: 'Activities',
    type: 'other',
    method: 'POST',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/activities/v1/lookup',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, ZodType>([
        ['cluster', z.string().describe('SGP region cluster, e.g. `euc-prod` for EU')]
    ]),
    body: z.object({
        product: z.literal('valorant'),
        party: partyIDSchema.describe('The ID of the party to look up the activity for')
    }),
    responses: {
        '200': z.object({
            activityId: activityIDSchema
        })
    }
} as const satisfies ValorantEndpoint

export type ActivityLookupResponse = z.input<typeof activityLookupEndpoint.responses['200']>
