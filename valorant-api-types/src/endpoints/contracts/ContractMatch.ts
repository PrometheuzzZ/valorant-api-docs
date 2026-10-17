import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {
    currencyIDSchema,
    dateSchema,
    itemIDSchema,
    itemTypeIDSchema,
    matchIDSchema,
    millisSchema,
    weakUUIDSchema
} from '../../commonTypes'

const contractIDSchema = weakUUIDSchema.describe('Contract ID')
const missionIDSchema = weakUUIDSchema.describe('Mission ID')
const objectiveIDSchema = weakUUIDSchema.describe('Objective ID')

export const contractMatchEndpoint = {
    name: 'Contract Match',
    description: 'Get the contract, mission, XP, Kingdom Credits and reward progress a player earned from a specific match',
    category: 'Contracts',
    type: 'pd',
    suffix: 'contracts/v1/players/{puuid}/matches/{match id}',
    variables: new Map([
        ['match id', matchIDSchema.describe('The ID of the match to get progress for')]
    ]),
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    responses: {
        '200': z.object({
            ID: matchIDSchema,
            CreatedAt: dateSchema.describe('Time the match was processed by the contracts service'),
            StartTime: millisSchema,
            XPGrants: z.object({
                GamePlayed: z.number(),
                GameWon: z.number(),
                RoundPlayed: z.number().describe('XP granted for rounds played'),
                RoundWon: z.number().describe('XP granted for rounds won'),
                Missions: z.record(missionIDSchema, z.number().describe('XP granted for completing the mission')).nullable(),
                Modifier: z.object({
                    Value: z.number(),
                    BaseMultiplierValue: z.number(),
                    Modifiers: z.array(z.object({
                        Value: z.number(),
                        Name: z.string().describe('Known values: RESTRICTIONS_XP, PREMIUM_CONTRACT_XP, SOCIAL_XP (bonus for playing with a premade party)'),
                        BaseOnly: z.boolean()
                    }))
                }),
                NumAFKRounds: z.number()
            }).nullable(),
            DoughGrants: z.object({
                GamePlayed: z.number(),
                RoundPlayed: z.number().describe('Kingdom Credits granted for rounds played'),
                RoundWon: z.number().describe('Kingdom Credits granted for rounds won')
            }).nullable().describe('Kingdom Credits ("Dough" internally) granted for the match'),
            RewardGrants: z.record(contractIDSchema, z.object({
                EntitlementRewards: z.array(z.object({
                    ItemTypeID: itemTypeIDSchema,
                    ItemID: itemIDSchema,
                    Amount: z.number()
                })).nullable(),
                ItemRewards: z.array(z.unknown()).nullable(),
                WalletRewards: z.array(z.object({
                    CurrencyID: currencyIDSchema,
                    Amount: z.number()
                })).nullable(),
                CounterRewards: z.array(z.unknown()).nullable(),
                ProgressionRewards: z.array(z.unknown()).nullable()
            })).nullable().describe('Rewards unlocked by contract level-ups from this match, keyed by contract ID'),
            MissionDeltas: z.record(missionIDSchema, z.object({
                ID: missionIDSchema,
                Objectives: z.record(objectiveIDSchema, z.number().describe('Progress gained in this match')),
                ObjectiveDeltas: z.record(objectiveIDSchema, z.object({
                    ID: objectiveIDSchema,
                    ProgressBefore: z.number(),
                    ProgressAfter: z.number()
                }))
            })).nullable(),
            ContractDeltas: z.record(contractIDSchema, z.object({
                ID: contractIDSchema,
                TotalXPBefore: z.number(),
                TotalXPAfter: z.number()
            })).nullable(),
            CouldProgressMissions: z.boolean(),
            MatchSummary: z.object({
                RoundsTotal: z.number(),
                RoundsWon: z.number()
            }),
            XID: weakUUIDSchema.describe('Unknown deterministic (UUIDv5) ID')
        })
    }
} as const satisfies ValorantEndpoint

export type ContractMatchResponse = z.input<typeof contractMatchEndpoint.responses['200']>
