/**
 * Lazily connect to MongoDB. The driver is a peer-style runtime dependency so
 * consumers can choose its version and deployment strategy.
 * @param {import('../config/types.js').BotConfig} config
 * @returns {Promise<{client: import('mongodb').MongoClient, db: import('mongodb').Db}>}
 */
export async function createMongoConnection(config) {
  let MongoClient;
  console.log(config)
  try { ({ MongoClient } = await import('mongodb')); }
  catch (error) { throw new Error('MongoDB support requires the "mongodb" package', { cause: error }); }
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  const db = client.db(config.mongoDatabase);
  await db.collection('users').createIndex({ telegramId: 1 }, { unique: true });
  return { client, db };
}
