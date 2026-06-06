import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {matchIDSchema, playerUUIDSchema} from '../../commonTypes'

export const matchReplayInfoEndpoint = {
    name: 'Match Replay Info',
    description: 'Get download URLs for match replay files. Supports fetching multiple matches at once by repeating the `id` query parameter.\n\n`{type}` can be:\n- `SUMMARY` — returns signed URLs to JSON files with match data\n- `REPLAY` — returns signed URLs to `.vrf` replay files playable in the Valorant client\n\nThe `{puuid}` must be your own or a friend\'s — otherwise access will be denied.',
    queryName: 'MatchHistoryQuery_GetMatchFileUrls',
    category: 'Replays',
    type: 'other',
    suffix: 'https://{region}c1.pp.sgp.pvp.net/match-history-query/v3/products/valorant/players/{puuid}/infoTypes/{type}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    variables: new Map([
        ['type', z.enum(['SUMMARY', 'REPLAY']).describe('`SUMMARY` returns match data JSON URLs, `REPLAY` returns `.vrf` replay file URLs')],
    ]),
    responses: {
        '200': z.object({
            total: z.number().describe('Number of matches returned'),
            matchFileUrlsMap: z.record(matchIDSchema, z.string().url().describe('Signed CloudFront URL, expires after a short time'))
        })
    }
} as const satisfies ValorantEndpoint
