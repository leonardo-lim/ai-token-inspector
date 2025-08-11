import type { DexPair } from '../types/dex-pair-type';
import axios from 'axios';

class TokenAPIService {
    getTokenInfo = async (address: string) => {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`);

        if (!response.data.pairs) {
            throw new Error('NO_TOKEN');
        }

        const data = response.data.pairs[0];

        return {
            name: data.baseToken.name,
            chain: data.chainId,
            price: data.priceUsd,
            marketCap: data.marketCap,
            fdv: data.fdv,
            volume24h: data.volume.h24,
            liquidity: data.liquidity.usd
        };
    };

    getSearchPairs = async (tokenName: string) => {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${tokenName}`);
        return response.data.pairs;
    };

    getTokenPrice = async (tokenName: string, chainName: string | null) => {
        const searchPairs: DexPair[] = await this.getSearchPairs(tokenName);

        if (searchPairs.length === 0) {
            throw new Error('NO_RESULT');
        }

        let pair: DexPair | undefined = undefined;

        if (chainName) {
            pair = searchPairs.find((pair) => (
                pair.baseToken.symbol.toLowerCase() === tokenName.toLowerCase() &&
                pair.chainId === chainName
            ));
        } else {
            pair = searchPairs.find((pair) => (
                pair.baseToken.symbol.toLowerCase() === tokenName.toLowerCase()
            ));
        }

        if (!pair) {
            throw new Error('NO_RESULT');
        }

        const { chainId, pairAddress } = pair;

        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`);
        const data = response.data.pairs[0];

        return {
            name: data.baseToken.name,
            chain: data.chainId,
            price: data.priceUsd,
            volume24h: data.volume.h24,
            liquidity: data.liquidity.usd
        };
    };
}

export { TokenAPIService };