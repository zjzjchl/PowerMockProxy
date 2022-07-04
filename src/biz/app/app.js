const moment = require('moment');
const { AppDao } = require('../../dao/index');


exports.addApp = async function (req, res) {
  req.body.timestamp = moment().valueOf();
  let dao = new AppDao();
  await dao.add(req.body);
};

exports.updateApp = async function (req, res) {
  let dao = new AppDao();
  await dao.update(req.body);
};

exports.deleteApp = async function (req, res) {
  let dao = new AppDao();
  await dao.delete(req.body);
};

exports.allAppByParams = async function (req, res) {
  let dao = new AppDao();
  let result = await dao.allByParams(req.body);
  return result;
};

exports.allApp = async function (req, res) {
  let dao = new AppDao();
  let result = await dao.all();
  return result;
};