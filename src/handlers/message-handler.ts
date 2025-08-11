import type { Context } from 'grammy';
import { BotService } from '../services/bot-service';

const createMessageHandler = (botService: BotService) => {
    return async (ctx: Context) => {
        if (!ctx.message?.text) {
            return;
        }

        const input = ctx.message.text;
        const args = input.split(' ');
        const command = args[0].toLowerCase();

        try {
            if (command === '/token') {
                ctx.reply('Getting token info...');
                const response = await botService.handleTokenCommand(input);
                ctx.reply(response, { parse_mode: 'Markdown' });
            } else if (command === '/price') {
                ctx.reply('Getting token price...');
                const response = await botService.handlePriceCommand(input);
                ctx.reply(response, { parse_mode: 'Markdown' });
            } else if (command === '/help') {
                ctx.reply(
                    "🛠 *Commands*\n\n" +
                    "🔹 `/token <contract_address>`\n" +
                    "Get token info by providing the contract address.\n" +
                    "Example:\n" +
                    "`/token 0x1234567890abcdef...\n\n`" +
                    "🔹 `/price <token_name>`\n" +
                    "Get the price of a token across supported chains.\n" +
                    "Example:\n" +
                    "`/price PEPE\n\n`" +
                    "🔹 `/price <token_name> <chain_name>`\n" +
                    "Get the price of a token on a specific chain.\n" +
                    "Example:\n" +
                    "`/price PEPE ethereum`",
                    { parse_mode: 'Markdown' }
                );
            } else {
                ctx.reply('Unknown command');
            }
        } catch (error: any) {
            ctx.reply(error.message);
        }
    };
};

export { createMessageHandler };