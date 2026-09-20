import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {playerUUIDSchema, weakUUIDSchema} from '../../commonTypes'

const gunCommonSchema = z.object({
    SkinID: weakUUIDSchema,
    SkinLevelID: weakUUIDSchema,
    ChromaID: weakUUIDSchema,
    Attachments: z.array(z.unknown())
})

export const playerLoadoutSchema = z.object({
    Guns: z.array(z.object({
        ID: weakUUIDSchema,
        CharmInstanceID: weakUUIDSchema.optional(),
        CharmID: weakUUIDSchema.optional(),
        CharmLevelID: weakUUIDSchema.optional()
    }).merge(gunCommonSchema).describe("Guns and knife. Note that the knife (ID: 2f59173c-4bed-b6c3-2191-dea9b58be9c7) does not have charm data (buddies).")),
    ActiveExpressions: z.array(z.object({
        TypeID: weakUUIDSchema.describe('The type of the expression, for example `d5f120f8-ff8c-4aac-92ea-f2b5acbe9475` for sprays'),
        AssetID: weakUUIDSchema.describe('The ID of the equipped expression, for example a spray ID')
    })).describe('Equipped expressions such as sprays. Replaces the `Sprays` array of the v2 endpoint.'),
    DynamicOptions: z.record(z.string(), z.unknown()).describe('Usually an empty object'),
    Identity: z.object({
        PlayerCardID: weakUUIDSchema,
        PlayerTitleID: weakUUIDSchema,
        AccountLevel: z.number(),
        PreferredLevelBorderID: weakUUIDSchema,
        HideAccountLevel: z.boolean()
    }),
    Incognito: z.boolean()
})

export const playerLoadoutEndpoint = {
    name: 'Player Loadout',
    description: 'Get the player\'s current loadout. Only works for your own PUUID.',
    queryName: 'playerLoadoutUpdate',
    category: 'playerLoadout',
    type: 'pd',
    suffix: 'personalization/v3/players/{puuid}/playerloadout',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Subject: playerUUIDSchema,
            Version: z.number()
        }).merge(playerLoadoutSchema)
    }
} as const satisfies ValorantEndpoint

export type PlayerLoadoutResponse = z.input<typeof playerLoadoutEndpoint.responses['200']>