const md5 = require('md5-node');
const ObjectId = require('mongodb').ObjectId;
const { getDB } = require('../client');
const Dao = require('../dao.js');

function ApiGroupDao() {
  Dao.call(this);
}

ApiGroupDao.prototype = new Dao();

ApiGroupDao.prototype.add = async function (apigroup) {
  apigroup._id = new ObjectId();
  let set = this.flattenData(apigroup, []);
  const db = await getDB();
  await db.collection('apigroup').insertOne(set);
};

ApiGroupDao.prototype.addWithId = async function (apigroup) {
  let id = md5(apigroup.name);
  apigroup._id = new ObjectId(id.substring(0, 24));
  // let set = this.flattenData(apigroup, []);
  // const db = await getDB();
  // await db.collection('apigroup').insertOne(set);
  await this.update(apigroup);
};

ApiGroupDao.prototype.delete = async function (apigroup) {
  const db = await getDB();
  await db.collection('apigroup').deleteOne({ _id: new ObjectId(apigroup._id) });
};

ApiGroupDao.prototype.update = async function (apigroup, createdIfNotExisted = true) {
  let set = this.flattenData(apigroup, ['_id']);
  const db = await getDB();
  await db.collection('apigroup').updateOne({ _id: new ObjectId(apigroup._id) }, { $set: set }, { upsert: createdIfNotExisted });
};

ApiGroupDao.prototype.get = async function (id) {
  const db = await getDB();
  return await db.collection('apigroup').findOne({ _id: new ObjectId(id) });
};

ApiGroupDao.prototype.allByParams = async function (params) {
  const db = await getDB();
  let records = await db.collection('apigroup').find({ aid: params.aid }).toArray();
  return { totalCounts: records.length, records: records };
};

ApiGroupDao.prototype.all = async function (params) {
  const db = await getDB();
  return await db.collection('apigroup').find({ aid: params.aid }).toArray();
};


module.exports = ApiGroupDao;