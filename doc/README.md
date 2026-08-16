# libjs_tgbot documentation

`libjs_tgbot` is a reusable Node.js Telegram bot foundation built on [grammY](https://grammy.dev/). It provides:

- localized commands with Fluent files
- MongoDB user persistence
- Redis cache and temporary storage primitives
- optional SOCKS proxy support for Telegram API requests
- command autocomplete in Telegram
- graceful shutdown support
- a library API for embedding the bot in another application

## Guides

- [Installation and configuration](./configuration.md)
- [Using the library](./library.md)
- [Commands and i18n](./commands-and-i18n.md)
- [Persistence and Redis](./storage.md)
- [Proxy and networking](./proxy.md)
- [Operations and shutdown](./operations.md)

## Architecture

```text
app/index.js
  ├── app/commands/       Telegram command modules
  ├── app/middleware/     request middleware and error handling
  ├── templates/          tokenized message builders
  ├── locales/            Fluent translations
  ├── models/users/       MongoDB user repository
  └── libs/               configuration and infrastructure adapters
```

The application layer wires dependencies together. Commands and templates do not create database or Redis connections directly.
