import { TokenQueryService } from './token-query-service';
import { TokenAPIService } from './token-api-service';
import { AIService } from './ai-service';

class BotService {
    private tokenQueryService;
    private tokenAPIService;
    private aiService;

    constructor(tokenQueryService: TokenQueryService, tokenAPIService: TokenAPIService, aiService: AIService) {
        this.tokenQueryService = tokenQueryService;
        this.tokenAPIService = tokenAPIService;
        this.aiService = aiService;
    }

    handleTokenCommand = async (input: string) => {
        const tokenResult = await this.tokenQueryService.getTokenResultByQuery(input);

        if (tokenResult) {
            const info = tokenResult.result!;

            const tokenInfo = (
                `*${info.name}*\n` +
                `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                `💵 Price: $${info.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                `📊 Market Cap: $${info.marketCap?.toLocaleString('en-US')}\n` +
                `📈 FDV: $${info.fdv?.toLocaleString('en-US')}\n` +
                `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}\n`
            );

            return tokenInfo + info.aiInsight;
        } else {
            const args = input.split(' ');
            const address = args[1];

            try {
                const info = await this.tokenAPIService.getTokenInfo(address);

                const tokenInfo = (
                    `*${info.name}*\n` +
                    `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                    `💵 Price: $${info.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                    `📊 Market Cap: $${info.marketCap.toLocaleString('en-US')}\n` +
                    `📈 FDV: $${info.fdv.toLocaleString('en-US')}\n` +
                    `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                    `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}\n`
                );

                const insight = await this.aiService.generateInsight(tokenInfo);
                await this.tokenQueryService.saveTokenInfoQuery(input, info, insight);

                return tokenInfo + insight;
            } catch (error: any) {
                if (error.message === 'NO_TOKEN') {
                    throw new Error('No token found');
                } else {
                    console.log(error);
                    throw new Error('Failed to get token info');
                }
            }
        }
    };

    handlePriceCommand = async (input: string) => {
        const tokenResult = await this.tokenQueryService.getTokenResultByQuery(input);

        if (tokenResult) {
            const info = tokenResult.result!;

            const tokenInfo = (
                `*${info.name}*\n` +
                `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                `💵 Price: $${info.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}\n`
            );

            return tokenInfo;
        } else {
            const args = input.split(' ');
            const tokenName = args[1];
            const chainName = args[2] || null;

            try {
                const price = await this.tokenAPIService.getTokenPrice(tokenName, chainName);

                await this.tokenQueryService.saveTokenPriceQuery(input, price);

                return (
                    `*${price.name}*\n` +
                    `🔗 Chain: ${price.chain.charAt(0).toUpperCase() + price.chain.slice(1)}\n` +
                    `💵 Price: $${price.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                    `🔁 Volume 24h: $${price.volume24h.toLocaleString('en-US')}\n` +
                    `💧 Liquidity: $${price.liquidity.toLocaleString('en-US')}`
                );
            } catch (error: any) {
                if (error.message === 'NO_RESULT') {
                    throw new Error('No token found');
                } else {
                    throw new Error('Failed to get token price');
                }
            }
        }
    };
}

export { BotService };