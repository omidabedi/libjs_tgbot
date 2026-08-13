import { InlineKeyboard } from 'grammy';
import { languageKeyboard } from '../../templates/languages.js';

/** @typedef {{code:string, flag:string}} SupportedLanguage */
/** Register /language and its callback actions. @param {import('grammy').Bot} bot @param {SupportedLanguage[]} languages @param {import('../../models/users/repository.js').UserRepository} users */
export function registerLanguageCommand(bot, languages, users) {
  bot.command('language', (ctx) => ctx.reply(ctx.t('language-title'), { reply_markup: new InlineKeyboard(languageKeyboard(ctx, languages)) }));
  bot.callbackQuery('show-languages', async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply(ctx.t('language-title'), { reply_markup: new InlineKeyboard(languageKeyboard(ctx, languages)) }); });
  bot.callbackQuery(/^locale:(.+)$/, async (ctx) => {
    const locale = ctx.match[1];
    if (!languages.some((language) => language.code === locale)) return ctx.answerCallbackQuery({ text: 'Unsupported language' });
    await users.setLocale(ctx.from.id, locale);
    ctx.state.locale = locale;
    await ctx.answerCallbackQuery({ text: ctx.t('language-updated') });
    await ctx.editMessageText(ctx.t('language-updated'));
  });
}
