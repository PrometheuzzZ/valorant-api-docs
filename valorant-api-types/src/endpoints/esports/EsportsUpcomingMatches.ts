import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'

const teamSchema = z.object({
    ID: z.string(),
    Name: z.string(),
    Code: z.string(),
    BaseImageURL: z.string(),
    HighResImageURL: z.string(),
    LowResImageURL: z.string(),
    HomeLeagueID: z.string(),
    TeamMemberIDs: z.array(z.string()).nullable(),
    BundleID: z.string(),
    BundleDataAssetID: z.string(),
    DataAssetID: z.string()
})

const leagueSchema = z.object({
    ID: z.string(),
    Name: z.string(),
    ImageURL: z.string(),
    TournamentIDs: z.array(z.string()),
    TeamIDs: z.array(z.string()).nullable()
})

const tournamentSchema = z.object({
    ID: z.string(),
    Name: z.string(),
    LeagueID: z.string(),
    LeagueName: z.string(),
    StartTime: z.string().describe('ISO 8601 date string'),
    EndTime: z.string().describe('ISO 8601 date string'),
    StageIDs: z.array(z.string()),
    TeamIDs: z.array(z.string())
})

export const esportsUpcomingMatchesEndpoint = {
    name: 'Upcoming Matches',
    description: 'Get upcoming esports matches for VCT leagues. Returns leagues, tournaments, and teams data.',
    queryName: 'Esports_GetUpcomingMatches',
    category: 'Esports',
    type: 'pd',
    suffix: 'esports-service/v2/upcomingMatches',
    riotRequirements: {
        token: true,
        entitlement: true
    },
    responses: {
        '200': z.object({
            Leagues: z.array(leagueSchema),
            Tournaments: z.array(tournamentSchema),
            Teams: z.array(teamSchema),
            Seasons: z.null(),
            Splits: z.null()
        })
    }
} as const satisfies ValorantEndpoint
