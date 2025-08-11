import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

class AIService {
    private chatModel;

    constructor() {
        this.chatModel = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-2.5-flash'
        });
    }

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