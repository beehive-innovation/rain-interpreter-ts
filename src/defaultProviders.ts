import { isBigNumberish } from './utils';
import { BigNumber, BigNumberish, ethers } from "ethers";
import { Provider } from '@ethersproject/abstract-provider'

/**
 * @public
 * Type needed to construct a provider, which is either:
 * - chain id of the network to construct the Provider from default or .evn URLs
 * - https(s) or websocket (ws, wss) URL of the RPC to construct the Provider from
 * - any valid ethersjs Provider
 */
export type Providerish = BigNumberish | string | Provider

/**
 * @public
 * Default RPC URLs for networks, in order to use personal RPC, set its URL in a .env
 * file with defined keys below
 * This object can be expanded by user as desired to include more networks, just add the
 * desired key/value (number -\> string) to this object as you do normally with any js object
 */
export const defaultProvidersUrls: Record<number, string> = {
    1      :  'https://rpc.ankr.com/eth',
    5      :  'https://goerli.infura.io/v3/',
    137    :  'https://polygon-rpc.com/',
    80001  :  'https://rpc-mumbai.maticvigil.com',
    42161  :  'https://arb1.arbitrum.io/rpc',
    42220  :  'https://forno.celo.org',
    56     :  'https://bsc-dataseed.binance.org/',
    97     :  'https://data-seed-prebsc-1-s1.binance.org:8545',
    43114  :  'https://api.avax.network/ext/bc/C/rpc',
    43113  :  'https://api.avax-test.network/ext/bc/C/rpc',
    100    :  'https://rpc.ankr.com/gnosis',
    250    :  'https://rpc.ftm.tools',
}

/**
 * @public
 * Function to get an ethers Provider
 * 
 * @param providerish - The argument needed to construct a Provider
 * @returns An ethersjs provider
 */
export const getProvider = (providerish: Providerish): Provider => {

    // if a provider was passed
    if (providerish instanceof Provider) return providerish

    // if providerish is number or string number as chain id, construct provider from default urls
    if (isBigNumberish(providerish)) {
        const chainId = BigNumber.from(providerish).toNumber()
        if (defaultProvidersUrls[chainId]) {
            return new ethers.providers.JsonRpcProvider(
                defaultProvidersUrls[chainId]
            )
        }
    }

    // If passed a URL, figure out the right type of provider based on the scheme
    if (typeof providerish === "string") {
        // Handle http and ws (and their secure variants)
        if (providerish.startsWith('http')) 
            return new ethers.providers.JsonRpcProvider(providerish);
        if (providerish.startsWith('ws')) 
            return new ethers.providers.WebSocketProvider(providerish);
    }
    
    throw new Error('cannot construct a provider from passed argument')
}
