const moment = require('moment');
const { EnvDao } = require('../../dao/index');


exports.addEnv = async function (req, res) {
  req.body.timestamp = moment().valueOf();
  let dao = new EnvDao();
  await dao.add(req.body);
};


exports.updateEnv = async function (req, res) {
  let dao = new EnvDao();
  await dao.update(req.body);
};

exports.deleteEnv = async function (req, res) {
  let dao = new EnvDao();
  await dao.delete(req.query);
};

exports.getEnv = async function (req, res) {
  let dao = new EnvDao();
  let result = await dao.get(req.query.id);
  return result;
};

exports.allEnv = async function (req, res) {
  let dao = new EnvDao();
  let result = await dao.all();
  return result;
};