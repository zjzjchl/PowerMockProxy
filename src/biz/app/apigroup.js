const moment = require('moment');
const { ApiGroupDao } = require('../../dao/index');


exports.addApiGroup = async function (req, res) {
  req.body.timestamp = moment().valueOf();
  let dao = new ApiGroupDao();
  await dao.add(req.body);
};

exports.addApiGroupWithId = async function (req, res) {
  req.body.timestamp = moment().valueOf();
  let dao = new ApiGroupDao();
  await dao.addWithId(req.body);
};


exports.updateApiGroup = async function (req, res) {
  let dao = new ApiGroupDao();
  await dao.update(req.body);
};

exports.deleteApiGroup = async function (req, res) {
  let dao = new ApiGroupDao();
  await dao.delete(req.body);
};

exports.allApiGroupByParams = async function (req, res) {
  let dao = new ApiGroupDao();
  let result = await dao.allByParams(req.query);
  return result;
};

exports.getAPiGroup = async function (req, res) {
  let dao = new ApiGroupDao();
  let result = await dao.get(req.query.id);
  return result;
};

exports.allApiGroup = async function (req, res) {
  let dao = new ApiGroupDao();
  let result = await dao.all(req.query);
  return result;
};