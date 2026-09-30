import {ValorantEndpoint} from '../../ValorantEndpoint'
import {partySchema, playerUUIDSchema} from '../../commonTypes'
import {z} from 'zod'

export const customGameMembershipEndpoint = {
    name: 'Custom Game Membership',
    description: 'Move a player in the custom game lobby to a team, the spectators, or a coach slot',
    queryName: 'Party_CustomGameMembership',
    category: 'Party',
    type: 'glz',
    method: 'POST',
    suffix: 'parties/v1/parties/{party id}/customgamemembership/{team}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientVersion: true,
        clientPlatform: true
    },
    variables: new Map([
        ['team', z.enum(['TeamOne', 'TeamTwo', 'TeamSpectate', 'TeamOneCoaches', 'TeamTwoCoaches']).describe('The team to put the player on')]
    ]),
    body: z.object({
        playerToPutOnTeam: playerUUIDSchema
    }),
    responses: {
        '200': partySchema
    }
} as const satisfies ValorantEndpoint

export type CustomGameMembershipResponse = z.input<typeof customGameMembershipEndpoint.responses['200']>
