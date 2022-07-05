exports.init = async function (db) {
  const app = db.collection('app');
  // app.dropIndex('mixedIndex');
  await app.createIndex({ tid: 1 }, {
    background: false,
    unique: false,
    name: 'mixedIndex',
  });
}