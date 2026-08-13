/** Install a centralized error handler. @param {import('grammy').Bot} bot @param {Console} [logger=console] */
export function installErrorHandler(bot, logger = console) {
  bot.catch((error) => logger.error('Telegram update failed', error.error));
}
