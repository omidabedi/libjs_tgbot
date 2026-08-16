import { Bot, InputFile } from 'grammy';
import { I18n } from '@grammyjs/i18n';
import { loadConfig } from '../libs/config/index.js';
import { createRedisClient } from '../libs/redis/client.js';
import { createMongoConnection } from '../libs/mongodb/client.js';
import { UserRepository } from '../models/users/repository.js';
import { userMiddleware } from './middleware/user.js';
import { installErrorHandler } from './middleware/error.js';
import { registerCommands } from './commands/index.js';
import { createTelegramClientOptions } from '../libs/telegram/client.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/** Create and configure a Telegram bot. Call `start()` on the returned object. @param {Partial<import('../libs/config/types.js').BotConfig>} [overrides] @returns {Promise<{bot: import('grammy').Bot, close: () => Promise<void>}>} */
export { InputFile };

export async function createBot(overrides = {}) {
  const config = { ...loadConfig({ ...process.env, ...overrides }), ...overrides };
  const redis = createRedisClient(config);
  let mongo;
  try {
    await redis.connect();
    await redis.ping();
  } catch (error) {
    redis.disconnect();
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Redis startup failed for ${config.redisUrl}: ${reason}`, { cause: error });
  }
  try {
    mongo = await createMongoConnection(config);
  } catch (error) {
    redis.disconnect();
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`MongoDB startup failed for ${config.mongoUri}: ${reason}`, { cause: error });
  }
  const users = new UserRepository(mongo.db.collection('users'));
  const bot = new Bot(config.token, { client: await createTelegramClientOptions(config.telegramProxyUrl) });
  bot.use((ctx, next) => { ctx.state = ctx.state ?? {}; return next(); });
  bot.use(userMiddleware(users));
  const localeDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'locales');
  bot.use(new I18n({ directory: localeDirectory, defaultLocale: config.defaultLocale, localeNegotiator: (ctx) => ctx.state.locale ?? ctx.from?.language_code ?? config.defaultLocale }));
  const languages = config.locales.map((code) => ({ code, flag: code === 'fa' ? '🇮🇷' : code === 'en' ? '🇬🇧' : '🌐' }));
  registerCommands(bot, { ...config, languages }, users);
  await Promise.all(config.locales.map((locale) => {
    try {
      bot.api.setMyCommands([
        { command: 'start', description: locale === 'fa' ? 'شروع ربات' : 'Start the bot' },
        { command: 'language', description: locale === 'fa' ? 'تغییر زبان' : 'Change language' },
      ], { language_code: locale })
    } catch (e) {

    }
  } ));
  installErrorHandler(bot);
  return { bot, close: async () => { await bot.stop(); await redis.quit(); await mongo.client.close(); } };
}

/** Start the bot as a standalone process and install signal-safe shutdown. */
export async function main() {
  const config = loadConfig();
  if (config.serviceMode === 'webhook') {
    throw new Error('Webhook mode requires an HTTP adapter; use createBot() and mount bot.webhooksCallback() in your server.');
  }
  const { bot, close } = await createBot();
  const shutdown = async (signal) => { console.info(`Received ${signal}; shutting down`); try { await close(); process.exit(0); } catch (error) { console.error('Shutdown failed', error); process.exit(1); } };
  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  await bot.start({ onStart: (info) => console.info(`Bot @${info.username} started`) });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) void main().catch((error) => { console.error('Bot startup failed', error); process.exitCode = 1; });
