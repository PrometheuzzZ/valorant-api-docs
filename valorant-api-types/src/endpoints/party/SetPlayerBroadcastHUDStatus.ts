import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema, playerUUIDSchema} from '../../commonTypes'
import {z} from 'zod'

export const setPlayerBroadcastHUDStatusEndpoint = {
    name: 'Set Player Broadcast HUD Status',
    description: 'Enable or disable the broadcast HUD for a player in the custom game lobby',
    queryName: 'Party_SetPlayerBroadcastHUDStatus',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/parties/{party id}/setplayerbroadcasthudstatus',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    body: z.object({
        playerToSetBroadcastHUDStatus: playerUUIDSchema,
        broadcastHUDStatus: z.boolean()
    }),
    responses: {
        '200': partySchema
    }
} as const satisfies ValorantEndpoint

export type SetPlayerBroadcastHUDStatusResponse = z.input<typeof setPlayerBroadcastHUDStatusEndpoint.responses['200']>
