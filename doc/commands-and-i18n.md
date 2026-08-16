# Commands and internationalization

## Adding a command

Each command has its own file under `app/commands/`. A command module should export a registration function:

```js
/** @param {import('grammy').Bot} bot */
export function registerHelpCommand(bot) {
  bot.command('help', (ctx) => ctx.reply(ctx.t('help-text')));
}
```

Register it from `app/commands/index.js`. Keep Telegram interaction in command modules and keep reusable complex messages in `templates/`.

## Translation files

Translations use Fluent (`.ftl`) and are grouped by locale:

```text
locales/
  en/main.ftl
  fa/main.ftl
```

Use tokenized messages in templates:

```js
export function greeting(ctx) {
  return ctx.t('welcome', { name: ctx.from?.first_name ?? 'friend' });
}
```

Add the matching message to every supported locale:

```ftl
welcome = Welcome, { $name }!
```

The locale is selected from the saved user preference, then Telegram's language code, then `DEFAULT_LOCALE`.

## Language selection

Supported languages come from `BOT_LOCALES`. The language command renders an inline keyboard and persists the selected locale in MongoDB. Add a flag mapping in `app/index.js` when introducing a locale with a custom country flag.

## Telegram command autocomplete

On startup, the bot calls `setMyCommands` for every configured locale. Update the command descriptions in `app/index.js` when adding commands so Telegram's slash-command suggestions remain complete.
