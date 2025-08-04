import { Bot } from 'grammy';
import dotenv from 'dotenv';
import { getTokenInfo } from './utils/token-info';

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command('start', (ctx) => ctx.reply('Welcome to AI Token Inspector!'));

bot.on('message:text', async (ctx) => {
    const input = ctx.message.text;
    const args = input.split(' ');
    const command = args[0].toLowerCase();

    if (command === '/token') {
        const address = args[1];

        ctx.reply('Getting token info...');

        try {
            const info = await getTokenInfo(address);

            ctx.reply(
                `*${info.name}*\n` +
                `🔗 Chain: ${info.chain.charAt(0).toUpperCase() + info.chain.slice(1)}\n` +
                `💵 Price: $${info.price.toLocaleString('en-US')}\n` +
                `📊 Market Cap: $${info.marketCap.toLocaleString('en-US')}\n` +
                `📈 FDV: $${info.fdv.toLocaleString('en-US')}\n` +
                `🔁 Volume 24h: $${info.volume24h.toLocaleString('en-US')}\n` +
                `💧 Liquidity: $${info.liquidity.toLocaleString('en-US')}`,
                {
                    parse_mode: 'Markdown'
                }
            );
        } catch (error) {
            ctx.reply('Failed to get token info');
        }
    }
});

export default bot;