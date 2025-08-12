import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { HumanMessage } from '@langchain/core/messages';
import { BotService } from './bot-service';
import { getTokenInfoSchema, getTokenPriceSchema } from '../schemas/token-schema';

class AIService {
    private chatModel;
    public agent: any;

    constructor() {
        this.chatModel = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-2.5-flash'
        });
    }

    createAIAgent = async (botService: BotService) => {
        this.agent = createReactAgent({
            llm: this.chatModel,
            tools: [
                tool(
                    async (input: unknown) => {
                        const { address } = getTokenInfoSchema.parse(input);
                        return botService.handleTokenCommand(`/token ${address}`);
                    },
                    {
                        name: 'get-token-info',
                        description: 'Get token info by providing the contract address.',
                        schema: getTokenInfoSchema,
                    }
                ),
                tool(
                    async (input: unknown) => {
                        const { tokenName, chainName } = getTokenPriceSchema.parse(input);

                        return botService.handlePriceCommand(
                            `/price ${tokenName.toLowerCase()}${chainName ? ' ' + chainName.toLowerCase() : ''}`
                        );
                    },
                    {
                        name: 'get-token-price',
                        description: 'Get token price by providing the token name and optional chain name.',
                        schema: getTokenPriceSchema,
                    }
                )
            ]
        });
    };

    generateInsight = async (tokenInfo: string) => {
        const response = await this.chatModel.invoke([
            new HumanMessage(
                'Analyze this token:\n' +
                tokenInfo +
                'Based on the data, provide a clear and solid one-sentence insight into the token\'s potential and risks. Also, estimate a safety score between 0 and 100% based on on-chain activity and liquidity metrics. Output only the percentage value (e.g., "42%") and a one-sentence explanation. Format the response exactly like this:' +
                `🧠 AI Insight: {insight}\n` +
                `🛡️ Safety Score: {percentage} ({reason})`,
            )
        ]);

        return response.text;
    };
}

export { AIService };