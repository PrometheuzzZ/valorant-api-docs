import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z, ZodType} from 'zod'

const destinationSchema = z.object({
    StructuralID: z.string(),
    Type: z.string().describe('e.g. "decisionPoint", "standing"'),
    Slot: z.number()
})

const matchTeamSchema = z.object({
    TeamID: z.string(),
    OriginStructuralID: z.string(),
    OriginType: z.string(),
    OriginSlot: z.number(),
    Result: z.string().describe('e.g. "win", "loss", or empty string if unstarted'),
    GameWins: z.number()
})

const matchSchema = z.object({
    ID: z.string(),
    LeagueID: z.string(),
    TournamentID: z.string(),
    StageID: z.string(),
    StageName: z.string(),
    StructuralID: z.string(),
    StartTime: z.string().describe('ISO 8601 date string'),
    State: z.string().describe('e.g. "unstarted", "inprogress", "completed"'),
    Destinations: z.record(z.string(), destinationSchema).describe('Map of outcome ("Win", "Loss") to destination'),
    MatchTeams: z.array(matchTeamSchema),
    Streams: z.array(z.unknown())
})

export const esportsMatchesEndpoint = {
    name: 'Matches',
    description: 'Get esports match details by match IDs.',
    queryName: 'Esports_GetMatches',
    category: 'Esports',
    type: 'pd',
    method: 'POST',
    suffix: 'esports-service/v2/matches',
    query: new Map([
        ['locale', z.string().optional().describe('Locale for localized names, e.g. "ru-RU", "en-US"') as ZodType],
        ['sport', z.string().optional().describe('Sport identifier, always "val" for Valorant') as ZodType],
    ]),
    riotRequirements: {
        token: true,
        entitlement: true
    },
    body: z.object({
        MATCHIDS: z.array(z.string()).describe('List of match IDs to fetch')
    }),
    responses: {
        '200': z.object({
            Matches: z.array(matchSchema)
        })
    }
} as const satisfies ValorantEndpoint
