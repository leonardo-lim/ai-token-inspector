interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
}

interface TxnsPeriod {
    buys: number;
    sells: number;
}

interface Txns {
    m5?: TxnsPeriod;
    h1: TxnsPeriod;
    h6: TxnsPeriod;
    h24: TxnsPeriod;
}

interface Volume {
    m5?: number;
    h1: number;
    h6: number;
    h24: number;
}

interface PriceChange {
    m5?: number;
    h1: number;
    h6: number;
    h24: number;
}

interface Liquidity {
    usd: number;
    base: number;
    quote: number;
}

interface Website {
    label: string;
    url: string;
}

interface SocialLink {
    type: string;
    url: string;
}

interface Info {
    imageUrl: string;
    header: string;
    openGraph: string;
    websites: Website[];
    socials: SocialLink[];
}

interface DexPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    labels?: string[];
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    priceNative: string;
    priceUsd: string;
    txns: Txns;
    volume: Volume;
    priceChange: PriceChange;
    liquidity: Liquidity;
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info: Info;
}

export type { DexPair };