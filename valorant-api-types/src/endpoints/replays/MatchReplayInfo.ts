import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {matchIDSchema, playerUUIDSchema} from '../../commonTypes'

export const matchReplayInfoEndpoint = {
    name: 'Match Replay Info',
    description: 'Get download URLs for match replay files. Supports fetching multiple matches at once by repeating the `id` query parameter.\n\n`{type}` can be:\n- `SUMMARY` — returns signed URLs to JSON files with match data\n- `REPLAY` — returns signed URLs to `.vrf` replay files playable in the Valorant client\n\nThe `{puuid}` must be your own or a friend\'s — otherwise access will be denied.',
    queryName: 'MatchHistoryQuery_GetMatchFileUrls',
    category: 'Replays',
    type: 'other',
    suffix: 'https://{cluster}.pp.sgp.pvp.net/match-history-query/v3/products/valorant/players/{puuid}/infoTypes/{type}?id={match id}&id={match id}',
    riotRequirements: {
        token: true
    },
    variables: new Map<string, z.ZodTypeAny>([
        ['cluster', z.enum(['euc1', 'usw2', 'apse1', 'apne1']).describe('SGP region cluster. `euc1` = EU, `usw2` = NA/BR/LATAM, `apse1` = SEA/OCE, `apne1` = JP/KR')],
        ['type', z.enum(['SUMMARY', 'REPLAY']).describe('`SUMMARY` returns match data JSON URLs, `REPLAY` returns `.vrf` replay file URLs')],
        ['match id', matchIDSchema.describe('A match ID. Can be repeated multiple times to fetch several matches in one request. Match IDs can be obtained from the [GET Match History] endpoint.')],
    ]),
    responses: {
        '200': z.object({
            total: z.number().describe('Number of matches returned'),
            matchFileUrlsMap: z.record(matchIDSchema, z.string().url().describe('Signed CloudFront URL, expires after a short time'))
        })
    }
} as const satisfies ValorantEndpoint
