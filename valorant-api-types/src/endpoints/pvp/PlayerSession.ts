import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema, playerUUIDSchema} from '../../commonTypes'

export const playerSessionEndpoint = {
    name: 'Get Player Session',
    description: 'Get the current session state of a player. `loopState` indicates what the player is currently doing — `MENUS` means they are in the main menu, `PREGAME` means they are in agent select, `INGAME` means they are in a match. When `loopState` is `PREGAME` or `INGAME`, `loopStateMetadata` contains the match ID that can be used with the [GET Pre-Game Match](pre-game-match) or [GET Current Game Match](current-game-match) endpoints.',
    queryName: 'Session_GetPlayerSession',
    category: 'PVP Endpoints',
    type: 'glz',
    suffix: 'session/v1/sessions/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            subject: playerUUIDSchema,
            cxnState: z.string().describe('Connection state, e.g. "CONNECTED"'),
            cxnCloseReason: z.string(),
            clientID: weakUUIDSchema,
            clientVersion: z.string(),
            loopState: z.enum(['MENUS', 'PREGAME', 'INGAME']).describe('Current state of the player'),
            loopStateMetadata: z.string().describe('Match ID when loopState is PREGAME or INGAME, empty string otherwise'),
            version: z.number(),
            lastHeartbeatTime: z.string(),
            expiredTime: z.string(),
            heartbeatIntervalMillis: z.number(),
            playtimeNotification: z.string(),
            playtimeMinutes: z.number(),
            isRestricted: z.boolean(),
            userinfoValidTime: z.string(),
            restrictionType: z.string(),
            clientPlatformInfo: z.object({
                platformType: z.string(),
                platformOS: z.string(),
                platformOSVersion: z.string(),
                platformChipset: z.string(),
                platformDevice: z.string()
            }),
            connectionTime: z.string(),
            shouldForceInvalidate: z.boolean()
        })
    }
} as const satisfies ValorantEndpoint
