import {ValorantEndpoint} from '../../ValorantEndpoint'
import {z} from 'zod'
import {currencyIDSchema} from '../../commonTypes'
export const walletEndpoint = {
    name: 'Wallet',
    description: 'Get the current wallet balance for the user',
    queryName: 'Store_GetWallet',
    category: 'Store',
    type: 'pd',
    suffix: 'store/v1/wallet/{puuid}',
    riotRequirements: {
        token: true,
        entitlement: true,
        clientPlatform: true,
        clientVersion: true
    },
    responses: {
        '200': z.object({
            Balances: z.record(currencyIDSchema, z.number())
        })
    }
} as const satisfies ValorantEndpoint

export type WalletResponse = z.input<typeof walletEndpoint.responses['200']>