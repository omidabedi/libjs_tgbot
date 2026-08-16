# Installation and configuration

## Installation

The package is an ES module and requires a supported modern Node.js version.

```sh
npm install
```

Copy `.env.example` to `.env` and fill in the deployment values:

```sh
cp .env.example .env
npm run start
```

`npm run start` uses Node's native `--env-file=.env` option.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_API` | yes | Telegram bot token from BotFather |
| `DB_HOST` | no | MongoDB host, default `127.0.0.1` |
| `DB_PORT` | no | MongoDB port, default `27017` |
| `DB_NAME` | no | Database name, default `libjs_tgbot` |
| `DB_USER` | no | MongoDB username |
| `DB_PASS` | no | MongoDB password |
| `REDIS_HOST` | no | Redis host, default `127.0.0.1` |
| `REDIS_PORT` | no | Redis port, default `6379` |
| `REDIS_USER` | no | Redis username |
| `REDIS_PASS` | no | Redis password |
| `SRV_MODE` | no | `polling` or `webhook`, default `polling` |
| `SRV_HOOK_URL` | webhook | Public webhook URL |
| `TG_PROXY_URL` | no | SOCKS proxy URL for Telegram requests |
| `BOT_LOCALES` | no | Comma-separated locale codes, default `en,fa` |
| `DEFAULT_LOCALE` | no | Default locale |
| `REDIS_KEY_PREFIX` | no | Application cache key prefix |
| `REDIS_TTL_SECONDS` | no | Default cache TTL |

`MONGO_URI`, `MONGO_DATABASE`, and `REDIS_URL` are also supported as direct connection-string overrides.

## Security

Never commit `.env`, bot tokens, database passwords, or proxy credentials. Use a secret manager in production. Database and Redis credentials are URL-encoded by the configuration layer.
