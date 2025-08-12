import { z } from 'zod';

const getTokenInfoSchema = z.object({
    address: z.string().describe('The contract address of the token')
});

const getTokenPriceSchema = z.object({
    tokenName: z.string().describe('The name of the token'),
    chainName: z.string().optional().describe('The name of the chain')
});

export { getTokenInfoSchema, getTokenPriceSchema };