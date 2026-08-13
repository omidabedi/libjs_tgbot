import { InlineKeyboard } from 'grammy';
import { startText } from '../../templates/start.js';

/** Register the localized /start command. @param {import('grammy').Bot} bot @param {{locales:string[]}} config @returns {void} */
export function registerStartCommand(bot, config) {
  bot.command('start', async (ctx) => {
    const keyboard = new InlineKeyboard().text(ctx.t('change-language'), 'show-languages');
    const commands = `\n\n${ctx.t('commands-title')}\n/start — ${ctx.t('commands-start')}\n/language — ${ctx.t('commands-language')}`;
    await ctx.reply(`${startText(ctx)}${commands}`, { reply_markup: keyboard });
  });
}
