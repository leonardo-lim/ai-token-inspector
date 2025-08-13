# AI Token Inspector

An AI-powered Telegram bot that provides real-time crypto token insights, price updates, and safety analysis using Langchain, Gemini, and Dexscreener APIs.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/leonardo-lim/ai-token-inspector.git
cd ai-token-inspector
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database?schema=public
BOT_TOKEN=your_bot_token
GOOGLE_API_KEY=your_google_api_key
```

### 4. Initialize Prisma

```bash
yarn prisma generate
yarn prisma migrate dev
```

### 5. Run the Bot

```bash
yarn dev
```

## Technologies
* Node.js
* Fastify
* TypeScript
* PostgreSQL
* Prisma

## APIs
* GrammY
* Langchain
* Google Generative AI
* Dexscreener

## Bot Commands

### 1. Get Token Info
* `/token <contract_address>`

Get token info by providing the contract address.

Example:
`/token 0x1234567890abcdef...`

### 2. Get Token Price
* `/price <token_name>`

Get the price of a token across supported chains.

Example:
`/price PEPE`

* `/price <token_name> <chain_name>`

Get the price of a token on a specific chain.

Example:
`/price PEPE ethereum`

### 3. Help
* `/help`
Get a list of available commands.

### 4. Direct Message Query
Send a plain message without a slash command and get the same results as above commands.

Examples:
```
• Can you provide the token info for this contract address: 0x1234567890abcdef...
• What's the current price of PEPE?
• What's the current price of PEPE on Ethereum?
```

## Prompt Structure
```
Analyze this token:
{info.name}
🔗 Chain: {info.chain}
💵 Price: ${info.price}
📊 Market Cap: ${info.marketCap}
📈 FDV: ${info.fdv}
🔁 Volume 24h: ${info.volume24h}
💧 Liquidity: ${info.liquidity}
Based on the data, provide a clear and solid one-sentence insight into the token's potential and risks. Also, estimate a safety score between 0 and 100% based on on-chain activity and liquidity metrics. Output only the percentage value (e.g., "42%") and a one-sentence explanation. Format the response exactly like this:
🧠 AI Insight: {insight}
🛡️ Safety Score: {percentage} ({reason})
```

## Get Started
* Telegram Bot Link: https://t.me/AITokenInspectorBot