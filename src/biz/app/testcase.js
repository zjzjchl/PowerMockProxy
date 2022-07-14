const moment = require('moment');
const { TestCaseDao } = require('../../dao/index');


exports.addTestCase = async function (req, res) {
  req.body.timestamp = moment().valueOf();
  let dao = new TestCaseDao();
  await dao.add(req.body);
};


exports.updateTestCase = async function (req, res) {
  let dao = new TestCaseDao();
  await dao.update(req.body);
};

exports.deleteTestCase = async function (req, res) {
  let dao = new TestCaseDao();
  await dao.delete(req.query);
};

exports.allTestCaseByParams = async function (req, res) {
  let dao = new TestCaseDao();
  let result = await dao.allByParams(req.query);
  return result;
};

exports.getTestCase = async function (req, res) {
  let dao = new TestCaseDao();
  let result = await dao.get(req.query.id);
  return result;
};

exports.allTestCase = async function (req, res) {
  let dao = new TestCaseDao();
  let result = await dao.all(req.query);
  return result;
};