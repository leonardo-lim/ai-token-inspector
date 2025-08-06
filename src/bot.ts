import { Bot } from 'grammy';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
import { getTokenInfo } from './utils/token-info';
import { getTokenPrice } from './utils/token-price';
import { getTokenResultByQuery, saveTokenInfoQuery, saveTokenPriceQuery } from './services/token-service';

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);

const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-2.5-flash'
});

bot.command('start', (ctx) => ctx.reply('Welcome to AI Token Inspector!'));

bot.on('message:text', async (ctx) => {
    const input = ctx.message.text;
    const args = input.split(' ');
    const command = args[0].toLowerCase();

    if (command === '/token') {
        ctx.reply('Getting token info...');

        const tokenResult = await getTokenResultByQuery(input);

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

            ctx.reply(tokenInfo + info.aiInsight, {
                parse_mode: 'Markdown'
            });
        } else {
            const address = args[1];

            try {
                const info = await getTokenInfo(address);

                const tokenInfo = (
                    `*${info.name}*\n` +
                    `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                    `💵 Price: $${info.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                    `📊 Market Cap: $${info.marketCap.toLocaleString('en-US')}\n` +
                    `📈 FDV: $${info.fdv.toLocaleString('en-US')}\n` +
                    `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                    `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}\n`
                );

                const response = await chatModel.invoke([
                    new HumanMessage(
                        'Analyze this token:\n' +
                        tokenInfo +
                        'Based on the data, provide a clear and solid one-sentence insight into the token\'s potential and risks. Also, estimate a safety score between 0 and 100% based on on-chain activity and liquidity metrics. Output only the percentage value (e.g., "42%") and a one-sentence explanation. Format the response exactly like this:' +
                        `🧠 AI Insight: {insight}\n` +
                        `🛡️ Safety Score: {percentage} ({reason})`,
                    )
                ]);

                await saveTokenInfoQuery(input, info, response.text);

                ctx.reply(tokenInfo + response.text, {
                    parse_mode: 'Markdown'
                });
            } catch (error: any) {
                if (error.message === 'NO_TOKEN') {
                    ctx.reply('No token found');
                } else {
                    console.log(error);
                    ctx.reply('Failed to get token info');
                }
            }
        }
    } else if (command === '/price') {
        ctx.reply('Getting token price...');

        const tokenResult = await getTokenResultByQuery(input);

        if (tokenResult) {
            const info = tokenResult.result!;

            const tokenInfo = (
                `*${info.name}*\n` +
                `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                `💵 Price: $${info.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}\n`
            );

            ctx.reply(tokenInfo, {
                parse_mode: 'Markdown'
            });
        } else {
            const tokenName = args[1];
            const chainName = args[2] || null;

            try {
                const price = await getTokenPrice(tokenName, chainName);

                await saveTokenPriceQuery(input, price);

                ctx.reply(
                    `*${price.name}*\n` +
                    `🔗 Chain: ${price.chain.charAt(0).toUpperCase() + price.chain.slice(1)}\n` +
                    `💵 Price: $${price.price.toLocaleString('en-US', { maximumFractionDigits: 10 })}\n` +
                    `🔁 Volume 24h: $${price.volume24h.toLocaleString('en-US')}\n` +
                    `💧 Liquidity: $${price.liquidity.toLocaleString('en-US')}`,
                    {
                        parse_mode: 'Markdown'
                    }
                );
            } catch (error: any) {
                if (error.message === 'NO_RESULT') {
                    ctx.reply('No token found');
                } else {
                    ctx.reply('Failed to get token price');
                }
            }
        }
    }
});

export default bot;