import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema, playerUUIDSchema} from '../../commonTypes'
import {z} from 'zod'

export const setPlayerModeratorStatusEndpoint = {
    name: 'Set Player Moderator Status',
    description: 'Grant or revoke moderator status for a player in the custom game lobby',
    queryName: 'Party_SetPlayerModeratorStatus',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/parties/{party id}/setplayermoderatorstatus',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    body: z.object({
        playerToSetModeratorStatus: playerUUIDSchema,
        moderatorStatus: z.boolean()
    }),
    responses: {
        '200': partySchema
    }
} as const satisfies ValorantEndpoint

export type SetPlayerModeratorStatusResponse = z.input<typeof setPlayerModeratorStatusEndpoint.responses['200']>
