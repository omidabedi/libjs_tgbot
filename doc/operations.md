# Operations and shutdown

## Polling

Polling is the default mode:

```env
SRV_MODE=polling
```

Start the standalone process with:

```sh
npm run start
```

## Webhook

Webhook mode validates `SRV_HOOK_URL` but is intended for embedding in an HTTP server. Create the bot with `createBot()` and mount grammY's webhook callback in the framework used by the consuming application.

```env
SRV_MODE=webhook
SRV_HOOK_URL=https://bot.example.com/telegram/webhook
```

The library does not create an HTTP server because the host application owns ports, TLS, routing, and health checks.

## Graceful shutdown

The standalone entrypoint handles `SIGINT` and `SIGTERM`, stops grammY polling, quits Redis, and closes MongoDB. Embedded applications must install their own signal handlers and call the returned `close()` method.

Do not terminate the process immediately before awaiting `close()`, otherwise in-flight updates and database connections may be interrupted.

## Startup failures

Startup checks Redis connectivity and MongoDB availability before polling begins. Typical actions:

- `Redis startup failed`: verify `REDIS_HOST`, `REDIS_PORT`, credentials, and service availability.
- `MongoDB startup failed`: verify `DB_HOST`, `DB_PORT`, credentials, and `DB_NAME`.
- Telegram API errors: verify `BOT_API` and optional `TG_PROXY_URL`.
