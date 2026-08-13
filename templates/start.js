/** @param {import('grammy').Context} ctx @returns {Promise<string>} */
export function startText(ctx) {
  return `${ctx.t('welcome', { name: ctx.from?.first_name ?? 'friend' })}\n${ctx.t('welcome-description')}`;
}
