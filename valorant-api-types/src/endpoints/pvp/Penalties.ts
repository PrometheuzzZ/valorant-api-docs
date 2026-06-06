import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema, weakUUIDSchema, matchIDSchema} from '../../commonTypes'

const penaltyEffectSchema = z.object({
    WarningType: z.string(),
    WarningTier: z.number(),
    ParentCentralRecordID: z.string()
}).nullable()

const penaltySchema = z.object({
    ID: weakUUIDSchema,
    IssuingGameStartUnixMillis: z.number(),
    IssuingMatchID: matchIDSchema,
    Expiry: z.string(),
    GamesRemaining: z.number(),
    ApplyToAllPlatforms: z.boolean(),
    ApplyToPlatforms: z.array(z.string()),
    ApplyToPlatformGroups: z.array(z.string()),
    InfractionID: weakUUIDSchema,
    Origin: z.string(),
    ForgivenessIneligible: z.boolean(),
    IsAutomatedDetection: z.boolean(),
    PenaltyInfo: z.unknown().nullable(),
    DelayedPenaltyEffect: z.unknown().nullable(),
    GameBanEffect: z.unknown().nullable(),
    QueueDelayEffect: z.unknown().nullable(),
    QueueRestrictionEffect: z.unknown().nullable(),
    RankedRatingPenaltyEffect: z.unknown().nullable(),
    RiotRestrictionEffect: z.unknown().nullable(),
    RMSNotifyEffect: z.unknown().nullable(),
    WarningEffect: penaltyEffectSchema,
    XPMultiplierEffect: z.unknown().nullable(),
    PremierRestrictionEffect: z.unknown().nullable()
})

export const penaltiesEndpoint = {
    name: 'Penalties',
    description: 'Get the matchmaking penalties for the given player',
    queryName: 'Restrictions_FetchPlayerRestrictionsV3',
    category: 'PVP Endpoints',
    type: 'pd',
    suffix: 'restrictions/v3/penalties',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Subject: playerUUIDSchema,
            Penalties: z.array(penaltySchema),
            Infractions: z.array(z.object({
                ID: weakUUIDSchema,
                Name: z.string(),
                RatingName: z.string()
            })),
            Version: z.number()
        })
    }
} as const satisfies ValorantEndpoint

export type PenaltiesResponse = z.input<typeof penaltiesEndpoint.responses['200']>
