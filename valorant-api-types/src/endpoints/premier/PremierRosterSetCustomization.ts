import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {weakUUIDSchema} from '../../commonTypes'

export const premierRosterSetCustomizationEndpoint = {
    name: 'Premier Roster Set Customization',
    description: 'Set the customization (icon and colors) for a Premier roster.',
    queryName: 'Premier_SetRosterCustomization',
    category: 'Premier',
    type: 'pd',
    method: 'PUT',
    suffix: 'premier/v1/rosters/{rosterid}/customization',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    body: z.object({
        icon: weakUUIDSchema,
        primaryColor: z.string().describe('Unreal Engine color string'),
        secondaryColor: z.string(),
        tertiaryColor: z.string()
    }),
    responses: {
        '200': z.unknown()
    }
} as const satisfies ValorantEndpoint
