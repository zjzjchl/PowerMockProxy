const ObjectId = require('mongodb').ObjectId;
const { getDB } = require('../client');
const Dao = require('../dao.js');

function TestCaseDao() {
  Dao.call(this);
}

TestCaseDao.prototype = new Dao();

TestCaseDao.prototype.add = async function (testcase) {
  testcase._id = new ObjectId();
  let set = this.flattenData(testcase, []);
  const db = await getDB();
  await db.collection('testcase').insertOne(set);
};

TestCaseDao.prototype.delete = async function (testcase) {
  const db = await getDB();
  await db.collection('testcase').deleteOne({ _id: new ObjectId(testcase._id) });
};

TestCaseDao.prototype.update = async function (testcase, createdIfNotExisted = true) {
  let set = this.flattenData(testcase, ['_id']);
  const db = await getDB();
  await db.collection('testcase').updateOne({ _id: new ObjectId(testcase._id) }, { $set: set }, { upsert: createdIfNotExisted });
};

TestCaseDao.prototype.get = async function (id) {
  const db = await getDB();
  return await db.collection('testcase').findOne({ _id: new ObjectId(id) });
};

TestCaseDao.prototype.allByParams = async function (params) {
  const db = await getDB();
  let records = await db.collection('testcase').find({ aid: params.aid, gid: params.gid }).toArray();
  return { totalCounts: records.length, records: records };
};

TestCaseDao.prototype.all = async function (params) {
  const db = await getDB();
  return await db.collection('testcase').find({ aid: params.aid }).toArray();
};


module.exports = TestCaseDao;