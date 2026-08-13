# libjs_tgbot

A layered grammY Telegram bot starter with MongoDB user persistence, Redis cache/temp storage, Fluent i18n, command autocomplete, and graceful shutdown.

## Usage

Install the declared dependencies, then configure:

Copy `.env.example` to `.env` and provide the values for your deployment. The application reads these variables directly from the process environment:

```sh
BOT_API=...
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=libjs_tgbot
DB_USER=libjs_tgbot
DB_PASS=libjs_tgbot
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SRV_MODE=polling
# Optional SOCKS proxy for Telegram API requests:
# TG_PROXY_URL=socks5://127.0.0.1:1080
npm start
```

`BOT_API` is the Telegram bot token. MongoDB uses `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASS`; Redis uses `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, and `REDIS_PASS`. `SRV_MODE` accepts `polling` or `webhook`; webhook mode also requires `SRV_HOOK_URL` and is exposed for embedding through `createBot()` and grammY's webhook callback. Optional localization variables are `BOT_LOCALES` (comma-separated, default `en,fa`) and `DEFAULT_LOCALE`. Set `TG_PROXY_URL` (or `TELEGRAM_PROXY_URL`) to a `socks4://`, `socks4a://`, `socks5://`, or `socks5h://` URL to route Telegram API requests through a SOCKS proxy.

## Use as a library

Build or install this package in another Node.js project, then create the bot from your application entrypoint:

```js
import { createBot } from 'libjs_tgbot';

const { bot, close } = await createBot({
  token: process.env.BOT_API,
  mongoUri: process.env.MONGO_URI,
  mongoDatabase: 'my_application',
  redisUrl: process.env.REDIS_URL,
  locales: ['en', 'fa'],
  defaultLocale: 'en',
});

process.once('SIGINT', () => void close());
process.once('SIGTERM', () => void close());
await bot.start();
```

`createBot()` returns `{ bot, close }`. The consuming application owns the process lifecycle and should always call `close()` during shutdown. Configuration overrides take precedence over environment variables, so separate projects can use different database names, locales, and proxy settings.

Translations live in `locales/<locale>/*.ftl`; complex tokenized messages belong in `templates/`. Each command is registered from its own module under `app/commands/`.
