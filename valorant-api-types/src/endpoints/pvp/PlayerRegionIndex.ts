import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {characterIDSchema, mapIDSchema, matchIDSchema, playerUUIDSchema, seasonIDSchema} from '../../commonTypes'

const regionIndexValuesSchema = z.object({
    winRate: z.number().describe('Weighted win rate from 0 to 1'),
    attackWinRate: z.number().describe('Weighted attack round win rate from 0 to 1'),
    defenseWinRate: z.number().describe('Weighted defense round win rate from 0 to 1'),
    tempValueF: z.number().describe('Weighted performance score'),
    regionIndex: z.number().describe('The map rating, observed values range from 0 to 500'),
    totalGames: z.number(),
    computedFromValidSeasons: z.boolean()
})

const regionIndexMatchSchema = z.object({
    matchId: matchIDSchema,
    agentId: characterIDSchema,
    actIndexBefore: z.number().describe('The map rating before the match, 0 for the first match of the act'),
    actIndexAfter: z.number().describe('The map rating after the match'),
    tempValueF: z.number().describe('Performance score of the match'),
    attackWinRate: z.number().describe('Share of attack rounds won in the match from 0 to 1'),
    defenseWinRate: z.number().describe('Share of defense rounds won in the match from 0 to 1'),
    outcome: z.enum(['Win', 'Lose', 'Draw'])
})

export const playerRegionIndexEndpoint = {
    name: 'Player Region Index',
    description: 'Get a player\'s per-map rating ("Region Index") for a season. Each key of `regionData` is the map UUID (the `uuid` field on valorant-api.com, not the map path) ' +
        'and only maps the player has played in the season are included.\n\n' +
        '`matchHistory` is sorted from newest to oldest, the rating of the map after the newest match equals `values.regionIndex`. ' +
        '`bestMatch` is the entry of `matchHistory` with the highest `tempValueF`, and `topAgents` lists the agents played on the map.',
    category: 'MMR',
    type: 'pd',
    suffix: 'region-index/v1/players/{puuid}',
    query: new Map([
        ['seasonID', seasonIDSchema.describe('The season (act) to get the map ratings for')]
    ]),
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            subject: playerUUIDSchema,
            platformGroup: z.string().describe('Platform group, `pc` on PC'),
            seasonId: seasonIDSchema,
            regionData: z.record(mapIDSchema, z.object({
                regionId: mapIDSchema,
                values: regionIndexValuesSchema,
                deltaValues: regionIndexValuesSchema.describe('Change of the values, observed to be all zeros'),
                bestMatch: regionIndexMatchSchema,
                matchHistory: z.array(regionIndexMatchSchema),
                topAgents: z.array(z.object({
                    agentId: characterIDSchema
                })),
                version: z.number()
            }))
        })
    }
} as const satisfies ValorantEndpoint

export type PlayerRegionIndexResponse = z.input<typeof playerRegionIndexEndpoint.responses['200']>
