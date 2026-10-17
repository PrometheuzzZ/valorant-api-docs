import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

const premierEventSchema = z.object({
    ID: weakUUIDSchema,
    Type: z.enum(['LEAGUE', 'TOURNAMENT', 'SCRIM']),
    StartDateTime: z.string(),
    EndDateTime: z.string(),
    SchedulePerConference: z.unknown().nullable(),
    MapSelectionStrategy: z.enum(['RANDOM', 'PICKBAN']),
    MapPoolMapIDs: z.array(weakUUIDSchema),
    PointsRequiredToParticipate: z.number()
})

const premierConferenceSchema = z.object({
    id: weakUUIDSchema,
    key: z.string(),
    isSuper: z.boolean(),
    gamePods: z.array(z.string()),
    timezone: z.string(),
    superConference: z.string(),
    leaderboardPlayoffQualificationDateTime: z.string(),
    leaderboardPromotionFinalizationDateTime: z.string()
})

const premierDivisionSchema = z.object({
    Division: z.number(),
    DivisionName: z.string(),
    DivisionGroup: z.string(),
    EventPresetName: z.string()
})

export const premierSeasonActiveEndpoint = {
    name: 'Premier Season Active',
    description: 'Get the currently active Premier season for a given affinity/region.',
    queryName: 'Premier_GetActiveSeason',
    category: 'Premier',
    type: 'pd',
    suffix: 'premier/v1/affinities/{affinity}/premier-seasons/active',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            ID: weakUUIDSchema,
            Name: z.string(),
            CompetitiveSeasonID: z.string(),
            PreviousPremierSeasonID: z.string(),
            NextPremierSeasonID: z.string(),
            IsActive: z.boolean(),
            StartTime: z.string().describe('ISO 8601 datetime'),
            EndTime: z.string().describe('ISO 8601 datetime'),
            Events: z.array(premierEventSchema),
            ScheduledEvents: z.array(z.unknown()),
            Conferences: z.array(premierConferenceSchema),
            Divisions: z.array(premierDivisionSchema),
            DivisionThresholds: z.array(z.unknown()),
            EventPresets: z.record(z.unknown()),
            FlawlessPointRequirement: z.number(),
            ChampionshipPointRequirement: z.number(),
            ChampionshipEventID: weakUUIDSchema,
            EnrollmentPhaseStartDateTime: z.string(),
            EnrollmentPhaseEndDateTime: z.string(),
            LeaderboardPlayoffQualificationDateTime: z.string(),
            LeaderboardPromotionFinalizationDateTime: z.string(),
            LeaderboardFinalizationDateTime: z.string(),
            ContenderEligibilityExpiryDateTime: z.string(),
            StageLockTime: z.string(),
            ParticipationRewardsActIDs: z.array(weakUUIDSchema),
            ParticipationRewards: z.unknown(),
            TournamentWinnerRewards: z.unknown(),
            DivisionWinnerRewards: z.unknown()
        })
    }
} as const satisfies ValorantEndpoint
