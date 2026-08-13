/** @param {import('grammy').Context} ctx @param {Array<{code:string,flag:string}>} languages */
export function languageKeyboard(ctx, languages) {
  return languages.map(({ code, flag }) => [{ text: `${flag} ${ctx.t(`language-${code}`)}`, callback_data: `locale:${code}` }]);
}
