const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://dnvpravallika_db_user:cc0LUoDSOzndgGWU@cluster0.kkgeyji.mongodb.net/fundwave?appName=Cluster0';

(async () => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db('fundwave');
    const col = db.collection('users');
    const indexes = await col.indexes();
    console.log('Current indexes on users collection:');
    console.log(JSON.stringify(indexes, null, 2));
  } finally {
    await client.close();
  }
})();
