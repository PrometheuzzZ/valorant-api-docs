import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const goldstarIDSchema = weakUUIDSchema.describe('Goldstar ID')

export const goldstarsEndpoint = {
    name: 'Goldstars',
    description: 'Get the list of all existing goldstars ("medals"), the awards shown after a match for stats such as kills, assists or headshot percentage.\n\n' +
        'The list does not depend on the player and rarely changes, so it can be cached for a long time. ' +
        'Riot does not return localized names or descriptions - the only name is the internal one in the obfuscated `tempT` field, ' +
        'which has also been observed under the keys `displayName`, `name`, `title` and `devName` in different client builds.\n\n' +
        'The meaning of a goldstar is not returned either. The IDs below were identified by comparing the values of the ' +
        '[GET Player Goldstars] endpoint with the stats of the same matches from the [GET Match Details] endpoint:\n\n' +
        '| Goldstar ID | Meaning |\n' +
        '| --- | --- |\n' +
        '| `6dc31cfd-41da-895f-9246-a8b63558cdb8` | Damage per round (ADR) |\n' +
        '| `2c8b6129-4384-230d-c7e5-cda12019533c` | Headshot percentage of the match |\n' +
        '| `1b13755f-4d5a-2c9e-6a39-bea7e6c53e7f` | Kills |\n' +
        '| `1c926cba-48cb-8aeb-c68d-a1ba2d012784` | Kills (second ID with the same meaning) |\n' +
        '| `e43f9acb-448c-4aa1-1591-6db72c0b8dae` | Assists |\n' +
        '| `352a3ac8-4b2c-db6a-1f36-c0a67b428e65` | Spike plants |\n' +
        '| `bfe96c47-44d0-e473-585d-749146d2d05e` | First kills |\n' +
        '| `244cf4ab-4c27-cc59-3323-c985858d6ddb` | Aces |\n' +
        '| `0497d585-42ad-61a7-42bc-189571f40e2c` | Clutches of 1v2 and higher |\n' +
        '| `745b27f0-4bc2-13a4-4ee7-77be323155c2` | Unknown - a combined match rating capped at 500, awarded to exactly one player of the match |\n' +
        '| `4815a8a2-4649-9bfe-afd2-38ae9cc22898` | Unknown - the same value as `745b27f0-4bc2-13a4-4ee7-77be323155c2`, but awarded to everyone above roughly 420 |\n' +
        '| `3bc0563a-4fe9-a15c-0078-23a3408d64b5` | Unknown - an integer between 6 and 11 per match, awarded to several players at once |\n\n' +
        'The three unknown values could not be reproduced from the data of the [GET Match Details] endpoint and are likely server-side stats that are not part of the match details. ' +
        'Any other ID returned by this endpoint is unknown as well - note that the units of the identified goldstars are not fixed either, ' +
        'see the [GET Player Goldstars] endpoint for how to determine them.',
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
            id: goldstarIDSchema.describe(
                'Goldstar ID. Known IDs:\n' +
                '- `6dc31cfd-41da-895f-9246-a8b63558cdb8` - damage per round (ADR)\n' +
                '- `2c8b6129-4384-230d-c7e5-cda12019533c` - headshot percentage of the match\n' +
                '- `1b13755f-4d5a-2c9e-6a39-bea7e6c53e7f` - kills\n' +
                '- `1c926cba-48cb-8aeb-c68d-a1ba2d012784` - kills (second ID with the same meaning)\n' +
                '- `e43f9acb-448c-4aa1-1591-6db72c0b8dae` - assists\n' +
                '- `352a3ac8-4b2c-db6a-1f36-c0a67b428e65` - spike plants\n' +
                '- `bfe96c47-44d0-e473-585d-749146d2d05e` - first kills\n' +
                '- `244cf4ab-4c27-cc59-3323-c985858d6ddb` - aces\n' +
                '- `0497d585-42ad-61a7-42bc-189571f40e2c` - clutches of 1v2 and higher\n' +
                '- `745b27f0-4bc2-13a4-4ee7-77be323155c2` - unknown, a combined match rating capped at 500, awarded to exactly one player of the match\n' +
                '- `4815a8a2-4649-9bfe-afd2-38ae9cc22898` - unknown, the same value as `745b27f0-4bc2-13a4-4ee7-77be323155c2` but awarded to everyone above roughly 420\n' +
                '- `3bc0563a-4fe9-a15c-0078-23a3408d64b5` - unknown, an integer between 6 and 11 per match, awarded to several players at once\n' +
                '- any other ID - unknown'
            ),
            tempT: z.string().describe('Internal (dev) name of the goldstar, e.g. `GoldStar_MostKills`')
        }))
    }
} as const satisfies ValorantEndpoint

export type GoldstarsResponse = z.input<typeof goldstarsEndpoint.responses['200']>
