function Dao() {

}

const PseudoAttributePattern = /P_/;
Dao.prototype.flattenData = function (data = {}, exclude = []) {
  exclude.push('number');
  let set = {};
  let keys = Object.keys(data);
  keys.forEach(key => {
    let value = data[key];
    !exclude.includes(key) && !PseudoAttributePattern.test(key) && (set[key] = value);
  });;
  return set;
};

module.exports = Dao;