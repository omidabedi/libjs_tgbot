# Persistence and storage

## MongoDB user persistence

`UserRepository` stores users in the `users` collection. Every update from a Telegram user performs an upsert:

- first contact creates `telegramId` and `createdAt`
- later contacts update profile fields, locale, and `updatedAt`
- records are never deleted by the library

A unique index is created on `telegramId` during startup.

Use the repository for user-specific durable data. Keep query and update logic in `models/`, not in command handlers.

## Redis cache and temporary values

The shared Redis client is available through `libs/redis/client.js`:

```js
import { cacheGet, cacheSet } from 'libjs_tgbot/redis';

await cacheSet(redis, 'weather:tehran', { temperature: 21 }, 300);
const weather = await cacheGet(redis, 'weather:tehran');
```

Use Redis for cache, rate limits, locks, and short-lived workflow state. Do not treat cache entries as the source of truth. Set an explicit TTL for temporary values.

The Redis client fails fast during startup and validates connectivity with `PING`.
