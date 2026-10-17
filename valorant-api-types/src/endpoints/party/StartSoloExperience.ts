import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partyPlayerSchema} from '../../commonTypes'
import {z} from 'zod'

export const startSoloExperienceEndpoint = {
    name: 'Start Solo Experience',
    description: 'Start a solo experience, such as the shooting range or a replay, for the given player.\n\n' +
        'The `module` field is only used by some game types and is an empty string otherwise. ' +
        'For example, `Aimbots_spawn` can be used with the `ShootingRange` game type.',
    queryName: 'Party_StartSoloExperience',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/players/{puuid}/startsoloexperience',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    body: z.object({
        gameType: z.enum([
            'BotTrainingMatch',
            'ShootingRange',
            'NewPlayerExperience',
            'WatchReplay',
            'ReplayNewPlayerExperience'
        ]),
        module: z.string().describe('Empty string for most game types')
    }),
    responses: {
        '200': partyPlayerSchema
    }
} as const satisfies ValorantEndpoint

export type StartSoloExperienceResponse = z.input<typeof startSoloExperienceEndpoint.responses['200']>
