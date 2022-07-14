const ObjectId = require('mongodb').ObjectId;
const { getDB } = require('../client');
const Dao = require('../dao.js');

function EnvDao() {
  Dao.call(this);
}

EnvDao.prototype = new Dao();

EnvDao.prototype.add = async function (env) {
  env._id = new ObjectId();
  let set = this.flattenData(env, []);
  const db = await getDB();
  await db.collection('env').insertOne(set);
};

EnvDao.prototype.delete = async function (env) {
  const db = await getDB();
  await db.collection('env').deleteOne({ _id: new ObjectId(env._id) });
};

EnvDao.prototype.update = async function (env, createdIfNotExisted = true) {
  let set = this.flattenData(env, ['_id']);
  const db = await getDB();
  await db.collection('env').updateOne({ _id: new ObjectId(env._id) }, { $set: set }, { upsert: createdIfNotExisted });
};

EnvDao.prototype.get = async function (id) {
  const db = await getDB();
  return await db.collection('env').findOne({ _id: new ObjectId(id) });
};

EnvDao.prototype.all = async function () {
  const db = await getDB();
  return await db.collection('env').find().toArray();
};


module.exports = EnvDao;