/**
 * Build validated runtime configuration from environment variables.
 * @param {NodeJS.ProcessEnv} [env=process.env]
 * @returns {Readonly<import('./types.js').BotConfig>}
 */
export function loadConfig(env = process.env) {
  const locales = (env.BOT_LOCALES ?? 'en,fa')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const token = env.BOT_API ?? env.BOT_TOKEN;
  if (!token) throw new Error('BOT_API is required');

  const dbUser = env.DB_USER ? `${encodeURIComponent(env.DB_USER)}:` : '';
  const dbPassword = env.DB_PASS ? encodeURIComponent(env.DB_PASS) : '';
  const dbAuth = dbUser || dbPassword ? `${dbUser}${dbPassword}@` : '';
  const mongoUri = env.MONGO_URI
    ?? `mongodb://${dbAuth}${env.DB_HOST ?? '127.0.0.1'}:${env.DB_PORT ?? '27017'}/${env.DB_NAME}`;
  const redisUser = env.REDIS_USER ? `${encodeURIComponent(env.REDIS_USER)}:` : '';
  const redisPassword = env.REDIS_PASS ? encodeURIComponent(env.REDIS_PASS) : '';
  const redisAuth = redisUser || redisPassword ? `${redisUser}${redisPassword}@` : '';
  const redisUrl = env.REDIS_URL
    ?? `redis://${redisAuth}${env.REDIS_HOST || '127.0.0.1'}:${env.REDIS_PORT || '6379'}`;
  const serviceMode = env.SRV_MODE ?? 'polling';
  if (!['polling', 'webhook'].includes(serviceMode)) {
    throw new Error(`SRV_MODE must be polling or webhook, got: ${serviceMode}`);
  }
  if (serviceMode === 'webhook' && !env.SRV_HOOK_URL) {
    throw new Error('SRV_HOOK_URL is required when SRV_MODE=webhook');
  }

  return Object.freeze({
    token,
    mongoUri,
    mongoDatabase: env.DB_NAME ?? env.MONGO_DATABASE ?? 'libjs_tgbot',
    redisUrl,
    telegramProxyUrl: env.TG_PROXY_URL ?? env.TELEGRAM_PROXY_URL,
    serviceMode,
    webhookUrl: env.SRV_HOOK_URL,
    locales,
    defaultLocale: env.DEFAULT_LOCALE ?? locales[0],
    redisKeyPrefix: env.REDIS_KEY_PREFIX ?? 'tgbot',
    redisTtlSeconds: Number(env.REDIS_TTL_SECONDS ?? 3600),
  });
}
