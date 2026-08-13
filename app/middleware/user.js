/** Persist the sender without ever deleting a user record. @param {import('../../models/users/repository.js').UserRepository} users */
export function userMiddleware(users) {
  return async (ctx, next) => {
    if (ctx.from) {
      const stored = await users.findByTelegramId(ctx.from.id);
      ctx.state.locale = stored?.locale;
      await users.upsert(ctx.from, ctx.state.locale);
    }
    await next();
  };
}
