const ObjectId = require('mongodb').ObjectId;
const { getDB } = require('../client');
const Dao = require('../dao.js');

function AppDao() {
  Dao.call(this);
}

AppDao.prototype = new Dao();

AppDao.prototype.add = async function (app) {
  app._id = new ObjectId();
  let set = this.flattenData(app, []);
  const db = await getDB();
  await db.collection('app').insertOne(set);
};

AppDao.prototype.delete = async function (app) {
  const db = await getDB();
  await db.collection('app').deleteOne({ _id: new ObjectId(app._id) });
};

AppDao.prototype.update = async function (app, createdIfNotExisted = true) {
  let set = this.flattenData(app, ['_id']);
  const db = await getDB();
  await db.collection('app').updateOne({ _id: new ObjectId(app._id) }, { $set: set }, { upsert: createdIfNotExisted });
};

AppDao.prototype.get = async function (id) {
  const db = await getDB();
  return await db.collection('app').findOne({ _id: new ObjectId(id) });
};

AppDao.prototype.allByParams = async function (params) {
  const db = await getDB();
  let records = await db.collection('app').find({ tid: params.tid }).toArray();
  return { totalCounts: records.length, records: records };
};

AppDao.prototype.all = async function () {
  const db = await getDB();
  return await db.collection('app').find().toArray();
};


module.exports = AppDao;