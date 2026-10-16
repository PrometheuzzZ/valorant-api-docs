import {z} from 'zod'
import {characterIDSchema, playerUUIDSchema, weakUUIDSchema} from '../../commonTypes'

// Bloomline is the per-agent progression system. Each agent is a "bonsai" and the bonsai ID is the agent's UUID.
// Fields with a zero value are left out of the responses, so almost everything is optional.

export const bonsaiIDSchema = characterIDSchema.describe('Bonsai ID, the same as the agent UUID')

export const flourishSchema = z.object({
    FlourishID: weakUUIDSchema.optional(),
    ShortLevel: z.number().optional(),
    PreviousShortLevel: z.number().optional(),
    LongLevel: z.number().optional(),
    Points: z.number().optional(),
    PointsVersion: z.number().optional()
}).describe('Progress of the agent\'s Bloomline. Empty for agents without progress')

export const trackProgressSchema = z.object({
    TrackID: weakUUIDSchema,
    TrackLevel: z.number().optional()
})

export const numberModuleSchema = z.object({
    ModuleID: weakUUIDSchema.optional().describe('Module slot the number is shown in'),
    NumberID: weakUUIDSchema.describe('Stat ID, all zeros for an empty slot'),
    Value: z.number()
})

export const bonsaiSchema = z.object({
    BonsaiID: bonsaiIDSchema,
    HypeID: weakUUIDSchema.optional(),
    BackgroundID: weakUUIDSchema.optional(),
    ClipID: weakUUIDSchema.optional(),
    BorderID: weakUUIDSchema.optional(),
    Flourish: flourishSchema,
    NumberModules: z.array(numberModuleSchema).optional().describe('Stats of the agent; only returned for a single bonsai'),
    TrackProgressList: z.array(trackProgressSchema).optional()
})

export const bloomlinePlayerSchema = z.object({
    Subject: playerUUIDSchema,
    Bonsais: z.array(bonsaiSchema),
    LongGroupVersion: z.number().optional()
})
