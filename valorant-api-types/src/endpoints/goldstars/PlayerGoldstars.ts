import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema, seasonIDSchema} from '../../commonTypes'
import {goldstarIDSchema} from './Goldstars'

export const playerGoldstarsEndpoint = {
    name: 'Player Goldstars',
    description: 'Get the goldstars ("medals") of a player: how often each goldstar was earned per act, the best value per act, and a breakdown of recent matches.\n\n' +
        'Works for other players\' PUUIDs as well. The values change after every match, so only cache them briefly.\n\n' +
        'The response keys are obfuscated and have changed between response versions (31 and 32 have been observed): in version 31 kills, assists and plants were sent per round, ' +
        'in version 32 as the match total. To determine the unit of a goldstar, divide the real match total by the goldstar value - a result of about 1 means the goldstar is the match total, ' +
        'a result close to the number of rounds means it is a per-round value. Values are float32, so numbers like `24.000001` are normal and should be rounded for display.\n\n' +
        'The season ID `00000000-0000-0000-0000-000000000000` in `tempS` is not a real act but the all-time summary. ' +
        'The `id` of a match is always an empty string, so the only link to the match history is the start time in `tempG` - ' +
        'matching a match from the history with the closest entry in `tempM` within about ten minutes works in practice.\n\n' +
        'The meaning of the goldstar IDs is listed in the [GET Goldstars] endpoint.\n\n' +
        'For a player without any goldstars, `tempS` and `tempM` are empty. Matches in which no player earned a goldstar exist as well, in which case `tempP` is an empty object.',
    category: 'Goldstars',
    type: 'pd',
    suffix: 'goldstars/v1/players/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            puuid: playerUUIDSchema,
            version: z.number().describe('Version of the response format, 31 and 32 have been observed'),
            tempS: z.record(seasonIDSchema, z.object({
                tempS: seasonIDSchema.describe('Duplicate of the act ID'),
                tempA: z.record(goldstarIDSchema, z.object({
                    id: goldstarIDSchema,
                    tempC: z.number().describe('How often the goldstar was earned during the act'),
                    tempB: z.number().describe('Best value of the goldstar during the act')
                })).describe('Goldstar ID to the summary of that goldstar for the act')
            })).describe('Act ID to the summary of that act. The all-zero ID is the all-time summary instead of a real act'),
            tempM: z.array(z.object({
                id: z.string().describe('Always an empty string - the match ID is not returned'),
                tempG: z.number().describe('Start time of the match in milliseconds since epoch'),
                tempP: z.record(playerUUIDSchema, z.object({
                    tempA: z.record(goldstarIDSchema, z.object({
                        id: goldstarIDSchema,
                        tempV: z.number().describe('Value of the goldstar in this match'),
                        tempB: z.boolean().describe('Whether the value is a record for the act')
                    })).describe('Goldstar ID to the value of that goldstar in this match')
                })).describe('Player UUID to the goldstars of that player in this match. Contains all participants, not just the requested player')
            })).describe('Recent matches with goldstars')
        })
    }
} as const satisfies ValorantEndpoint

export type PlayerGoldstarsResponse = z.input<typeof playerGoldstarsEndpoint.responses['200']>
