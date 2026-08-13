/**
 * MongoDB-backed, non-destructive Telegram user repository.
 */
export class UserRepository {
  /** @param {import('mongodb').Collection} collection */
  constructor(collection) { this.collection = collection; }

  /** Save a user on first contact and update its latest profile fields later. @param {import('grammy').User} user @param {string} locale @returns {Promise<void>} */
  async upsert(user, locale) {
    const now = new Date();
    await this.collection.updateOne(
      { telegramId: user.id },
      { $set: { firstName: user.first_name, lastName: user.last_name, username: user.username, languageCode: user.language_code, updatedAt: now, ...(locale ? { locale } : {}) }, $setOnInsert: { telegramId: user.id, createdAt: now } },
      { upsert: true },
    );
  }

  /** @param {number} telegramId @returns {Promise<{locale?: string}|null>} */
  async findByTelegramId(telegramId) { return this.collection.findOne({ telegramId }); }
  /** @param {number} telegramId @param {string} locale @returns {Promise<void>} */
  async setLocale(telegramId, locale) { await this.collection.updateOne({ telegramId }, { $set: { locale, updatedAt: new Date() } }); }
}
