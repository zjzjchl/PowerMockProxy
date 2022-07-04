const shortid = require('shortid');
const ObjectId = require('mongodb').ObjectId;
const { getDB } = require('../client');
const Dao = require('../dao.js');

function ResourceDao() {
  Dao.call(this);
}

ResourceDao.prototype = new Dao();

ResourceDao.prototype.add = async function (resource) {
  resource.id = `${resource.oId}:${resource.folder}:${shortid()}`;
  await this.update(resource);
};

ResourceDao.prototype.delete = async function (resource) {
  const db = await getDB();
  await db.collection('media_resource').deleteOne({ id: resource.id }); // 删除单个资源
};

ResourceDao.prototype.update = async function (resource) {
  let set = this.flattenData(resource, ['_id']);
  const db = await getDB();
  await db.collection('media_resource').updateOne({ id: resource.id }, { $set: set }, { upsert: true }); // 增加或者更新单个资源
};

ResourceDao.prototype.all = async function (params) {
  const db = await getDB();
  let query = { oId: params.oId };
  if (params.folder) {
    query.folder = params.folder;
  }
  return await db.collection('media_resource').find(query).toArray();
};

module.exports = ResourceDao;


