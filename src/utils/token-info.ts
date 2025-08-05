import axios from 'axios';

const getTokenInfo = async (address: string) => {
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

export { getTokenInfo };