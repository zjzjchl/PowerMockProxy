exports.init = function (db) {
  const app = db.collection('app');
  // app.dropIndex('mixedIndex');
  app.createIndex({ tid: 1 }, {
    background: false,
    unique: false,
    name: 'mixedIndex',
  });
}