import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {platformSchema, queueIDSchema, stringBooleanSchema} from '../../commonTypes'

const queueSchema = z.object({
    QueueID: queueIDSchema,
    Enabled: z.boolean(),
    DebugOnDemandSweepEnabled: z.boolean(),
    TeamSize: z.number(),
    NumTeams: z.number(),
    MaxPartySize: z.number(),
    MinPartySize: z.number(),
    InvalidPartySizes: z.array(z.number()),
    MaxPartySizeHighSkill: z.number(),
    HighSkillTier: z.number(),
    MaxSkillTier: z.number(),
    AllowFullPartyBypassSkillRestrictions: z.boolean(),
    ApplyRRPenaltyToFullParty: z.boolean(),
    AllowFiveStackRestrictions: z.boolean(),
    Mode: z.string(),
    IsRanked: z.boolean(),
    IsTournament: z.boolean(),
    IsPatient: z.boolean(),
    RequireRoster: z.boolean(),
    Priority: z.number(),
    PartyMaxCompetitiveTierRange: z.number(),
    PartyMaxCompetitiveTierRangePlacementBuffer: z.number(),
    FullPartyMaxCompetitiveTierRange: z.number(),
    PartySkillDisparityCompetitiveTiersCeilings: z.union([
        z.array(z.unknown()),
        z.record(z.string(), z.number())
    ]),
    PartySkillDisparityPartySizeCompetitiveTiersCeilings: z.union([
        z.array(z.unknown()),
        z.record(z.string(), z.record(z.string(), z.number()))
    ]),
    NewMap: z.string(),
    NewMapEndTime: z.string(),
    NewMapLossReductionModifier: z.number(),
    SharedAccountsRequireVerificationEnabled: z.boolean(),
    HighRankRequireVerificationEnabled: z.boolean(),
    RequireVerificationEnabled: z.boolean(),
    UseAccountLevelRequirement: z.boolean(),
    MinimumAccountLevelRequired: z.number(),
    GameRules: z.record(z.string(), stringBooleanSchema),
    SupportedPlatformTypes: z.array(platformSchema.shape.platformType),
    DisabledContent: z.array(z.unknown()),
    DebugLoadoutAllowedContentWhenSkippingPregameEnabled: z.boolean(),
    DebugLoadoutAllowedContentWhenSkippingPregame: z.array(z.unknown()),
    queueFieldA: z.array(z.unknown()),
    NextScheduleChangeSeconds: z.number(),
    TimeUntilNextScheduleChangeSeconds: z.number(),
    MapWeights: z.array(z.string())
        .describe('Array of strings in the format of "map:weight"'),
    MapPool: z.array(z.string()),
    TeamSizeWithBots: z.number(),
    EnableMultiteamSupport: z.boolean(),
    MatchFillerMarsPartySizeBonus: z.number(),
    MatchFillerMarsAllowPartialTeams: z.boolean(),
    MatchFillerMarsMinTeams: z.number(),
    MatchFillerMarsMaxTeams: z.number(),
    MatchFillerMarsTeamAnchorStrategy: z.string(),
    MatchFillerMarsLowerTeamCount: z.number(),
    MatchFillerMarsLowerTeamCountMMR: z.number(),
    MatchFillerMarsUpperTeamCount: z.number(),
    MatchFillerMarsUpperTeamCountMMR: z.number(),
    queueFieldB: z.boolean()
})

export const customGameConfigsEndpoint = {
    name: 'Custom Game Configs',
    description: 'Get information about the available gamemodes, maps, queues, and gamepods',
    queryName: 'Party_FetchCustomGameConfigs',
    category: 'Party',
    type: 'glz',
    suffix: 'parties/v1/parties/customgameconfigs',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Enabled: z.boolean(),
            EnabledMaps: z.array(z.string()),
            EnabledModes: z.array(z.string()),
            Queues: z.array(queueSchema),
            GamePodPingServiceInfo: z.record(z.string().describe('Game pod ID'), z.object({
                SecurityHash: z.number(),
                ObfuscatedIP: z.number(),
                PingProxyAddress: z.string(),
                PingProxyAddresses: z.array(z.string())
            }))
        })
    }
} as const satisfies ValorantEndpoint

export type CustomGameConfigsResponse = z.input<typeof customGameConfigsEndpoint.responses['200']>
