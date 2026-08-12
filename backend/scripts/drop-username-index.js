/**
 * One-off script: drop the stale username_1 unique index from the users collection.
 * Run with: node scripts/drop-username-index.js
 */
const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://dnvpravallika_db_user:cc0LUoDSOzndgGWU@cluster0.kkgeyji.mongodb.net/fundwave?appName=Cluster0';

(async () => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('fundwave');
    const col = db.collection('users');

    const indexes = await col.indexes();
    const hasUsernameIdx = indexes.some(idx => idx.name === 'username_1');

    if (hasUsernameIdx) {
      await col.dropIndex('username_1');
      console.log('✅  Dropped stale index: username_1');
    } else {
      console.log('ℹ️   Index username_1 not found — nothing to drop.');
    }
  } finally {
    await client.close();
  }
})();
