const protoLoader = require('@grpc/proto-loader');
const grpcLibrary = require('@grpc/grpc-js');

exports.isService= function(object) {
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      if (!element.path) {
        return false;
      }
    }
  }
  return true;
}

exports.getApisOfService = function(object) {
  let apis = [];
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      // 根据需要可以扩充字段
      const element = object[key];
      apis.push({name: key, type: 'grpc_api', path: element.path});
    }
  }
  return apis;
}

exports.getTreeOfProtoFile = async function(req, res) {
  console.log(req.query);
  if (!req.query) {
    return [];
  }
  if (!req.query.data) {
    return [];
  }
  let params = JSON.parse(req.query.data);
  let protoFileName = `${params.path}`;
  let options = {};
  let tree = [];
  const packageDefinition = protoLoader.loadSync(protoFileName, options);
  for (const key in packageDefinition) {
    if (Object.hasOwnProperty.call(packageDefinition, key)) {
      const element = packageDefinition[key];
      // 协议描述
      if (element.format || element.type){
        continue;
      }
      // 是否是一个服务
      if (exports.isService(element)) {
        // _id, aid, type
        let node = {name: key, children: [], type: 'grpc_service', gid: params._id, aid: params.aid};
        let apis = exports.getApisOfService(element);
        node.children = apis;
        tree.push(node);
      }
    }
  }
  // console.log(JSON.stringify(tree));
  return tree;
}

// exports.getTreeOfProtoFile("/root/PowerMockProxy/public/resources/62c42ef4281c4d161217bb15/greeter.proto");