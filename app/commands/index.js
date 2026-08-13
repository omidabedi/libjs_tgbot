import { registerStartCommand } from './start.js';
import { registerLanguageCommand } from './language.js';

/** @param {import('grammy').Bot} bot @param {{locales:string[], languages:Array<{code:string,flag:string}>} } config @param {import('../../models/users/repository.js').UserRepository} users */
export function registerCommands(bot, config, users) {
  registerStartCommand(bot, config);
  registerLanguageCommand(bot, config.languages, users);
}
