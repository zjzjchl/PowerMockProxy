const MongoClient = require("mongodb").MongoClient;
const Config = require('config').get('mongodb');

exports.getDB = async function(){
  if (exports.db) {
    return exports.db;
  }
  return new Promise((resolve, reject) => {
    MongoClient.connect(Config.url, { useUnifiedTopology: true }, function (err, client) {
      if (err) {
        reject(err);
      } else {
        const db = client.db(Config.dbName);
        exports.db = db;
        resolve(db);
      }
    });
  });
};