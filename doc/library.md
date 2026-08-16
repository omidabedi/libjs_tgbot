# Using libjs_tgbot as a library

Install the package in another project:

```sh
npm install libjs_tgbot
```

For local development:

```sh
npm install /var/www/libdev_js/libjs_tgbot
```

Create the bot from the consuming application's entrypoint:

```js
import { createBot } from 'libjs_tgbot';

const { bot, close } = await createBot({
  token: process.env.BOT_API,
  mongoDatabase: 'my_application',
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  telegramProxyUrl: process.env.TG_PROXY_URL,
});

const shutdown = async (signal) => {
  console.info(`Received ${signal}`);
  await close();
  process.exit(0);
};

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

await bot.start();
```

`createBot()` initializes Redis, MongoDB, middleware, i18n, commands, and Telegram command suggestions. It returns:

- `bot`: the configured grammY `Bot` instance
- `close()`: stops polling and closes Redis and MongoDB connections

Configuration overrides take precedence over environment variables. Undefined overrides are ignored.

## Subpath exports

```js
import { loadConfig } from 'libjs_tgbot/config';
import { createTelegramClientOptions } from 'libjs_tgbot/telegram';
```

The consuming application owns process signals and must call `close()` exactly once during shutdown.
