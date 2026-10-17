import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {activityIDSchema} from './ActivityLookup'

export const disableJoinLinkEndpoint = {
    name: 'Disable Join Link',
    description: 'Disable the shared join link of an activity that was created with the [POST Shared Join Link] endpoint. ' +
        'The join code no longer works afterwards.',
    category: 'Activities',
    type: 'other',
    method: 'DELETE',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/activities/v1/{activity id}/join-codes/shared',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, ZodType>([
        ['cluster', z.string().describe('SGP region cluster, e.g. `euc-prod` for EU')],
        ['activity id', activityIDSchema.describe('The ID of the activity, obtained from the [POST Activity Lookup] endpoint')]
    ]),
    responses: {
        '204': z.undefined()
    }
} as const satisfies ValorantEndpoint

export type DisableJoinLinkResponse = z.input<typeof disableJoinLinkEndpoint.responses['204']>
