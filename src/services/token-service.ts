import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const getTokenResultByQuery = async (query: string) => {
    const tokenQuery = await prisma.tokenQuery.findFirst({
        where: { query },
        include: { result: true }
    });

    if (!tokenQuery) {
        return null;
    }

    return tokenQuery;
};

const saveTokenInfoQuery = async (query: string, info: any, insight: string) => {
    await prisma.tokenQuery.create({
        data: {
            query: query,
            result: {
                create: {
                    name: info.name,
                    chain: info.chain,
                    price: parseFloat(info.price),
                    marketCap: info.marketCap,
                    fdv: info.fdv,
                    volume24h: info.volume24h,
                    liquidity: info.liquidity,
                    aiInsight: insight
                }
            }
        },
        include: {
            result: true
        }
    });
};

const saveTokenPriceQuery = async (query: string, price: any) => {
    await prisma.tokenQuery.create({
        data: {
            query: query,
            result: {
                create: {
                    name: price.name,
                    chain: price.chain,
                    price: parseFloat(price.price),
                    volume24h: price.volume24h,
                    liquidity: price.liquidity
                }
            }
        },
        include: {
            result: true
        }
    });
};

export { getTokenResultByQuery, saveTokenInfoQuery, saveTokenPriceQuery };