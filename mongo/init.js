 const assert = require('assert');
 const App = require('./app');
 const MongoClient = require("mongodb").MongoClient;
 const url = 'mongodb://localhost:27017';
 const dbName = 'powermock';
 MongoClient.connect(url, function (err, client) {
   assert.equal(null, err);
   console.log("Connected successfully to server");
   const db = client.db(dbName);
   
   App.init(db);
   client.close();
 });
 