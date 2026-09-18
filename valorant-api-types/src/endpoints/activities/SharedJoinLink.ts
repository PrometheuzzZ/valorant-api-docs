import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'
import {activityIDSchema} from './ActivityLookup'

export const sharedJoinLinkEndpoint = {
    name: 'Shared Join Link',
    description: 'Create a shared join link for an activity. The request has an empty body.\n\n' +
        'The returned join code can be shared with other players, either directly or through the `smartUrl`, ' +
        'to let them join the party. The link can be revoked with the [DELETE Disable Join Link] endpoint.',
    category: 'Activities',
    type: 'other',
    method: 'POST',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/activities/v1/{activity id}/join-codes/shared',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, ZodType>([
        ['cluster', z.string().describe('SGP region cluster, e.g. `euc-prod` for EU')],
        ['activity id', activityIDSchema.describe('The ID of the activity, obtained from the [POST Activity Lookup] endpoint')]
    ]),
    responses: {
        '200': z.object({
            joinCode: z.string().describe('The join code, e.g. `0000-0000-0000`'),
            smartUrl: z.string().describe('Link containing the join code, e.g. `https://gg.riotgames.com/VAL?joinCode=0000-0000-0000`'),
            expiresAt: z.string().datetime().describe('Expiration date of the join code in ISO 8601 format'),
            isActive: z.boolean().describe('Whether the join code is currently active')
        })
    }
} as const satisfies ValorantEndpoint

export type SharedJoinLinkResponse = z.input<typeof sharedJoinLinkEndpoint.responses['200']>
