import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const goldstarIDSchema = weakUUIDSchema.describe('Goldstar ID')

export const goldstarsEndpoint = {
    name: 'Goldstars',
    description: 'Get the list of all existing goldstars ("medals"), the awards shown after a match for stats such as kills, assists or headshot percentage.\n\n' +
        'The list does not depend on the player and rarely changes, so it can be cached for a long time. ' +
        'Riot does not return localized names or descriptions - the only name is the internal one in the obfuscated `tempT` field, ' +
        'which has also been observed under the keys `displayName`, `name`, `title` and `devName` in different client builds.',
    category: 'Goldstars',
    type: 'pd',
    suffix: 'goldstars/v1/goldstars',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.array(z.object({
            id: goldstarIDSchema,
            tempT: z.string().describe('Internal (dev) name of the goldstar, e.g. `GoldStar_MostKills`')
        }))
    }
} as const satisfies ValorantEndpoint

export type GoldstarsResponse = z.input<typeof goldstarsEndpoint.responses['200']>
