const protoLoader = require('@grpc/proto-loader');


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

function loopElement(type, messages) {
  let message = messages[type.name] = messages[type.name] ? messages[type.name] : {};
  type.field.forEach(element=>{
    message[element.name] =  {type: element.type, repeated: element.label === 'LABEL_REPEATED', typeName: element.typeName};
    type.nestedType.forEach(nType=>{
      loopElement(nType, messages);
    });
  });
}

exports.getMessagesOfPackageDefinition = function(packageDefinition) {
  let messages = {};
  for (const key in packageDefinition) {
    if (Object.hasOwnProperty.call(packageDefinition, key)) {
      const element = packageDefinition[key];
      // 协议描述
      if (!element.type){
        continue;
      }
      loopElement(element.type, messages);
    }
  }
  return messages;
}

exports.getTreeOfProtoFile = async function(req, res) {
  console.log(req.query);
  if (!req.query) {
    return {};
  }
  if (!req.query.data) {
    return {};
  }
  let params = JSON.parse(req.query.data);
  let protoFileName = `${params.path}`;
  let options = {json: true};
  let tree = [];
  const packageDefinition = protoLoader.loadSync(protoFileName, options);

  const messages = exports.getMessagesOfPackageDefinition(packageDefinition);
  console.log(messages);

  // const grpcObject = grpcLibrary.loadPackageDefinition(packageDefinition);
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
  return {tree, aid: params.aid, gid: params._id};
}

// exports.getTreeOfProtoFile({query: { data: '{"_id":"b12665d2b48e499580458861","aid":"62c42ef4281c4d161217bb15","name":"apis.proto","path":"./public/resources/62c42ef4281c4d161217bb15/apis.proto","size":3049,"timestamp":1657173777706,"type":"grpc"}'}}, null);

// const grpcLibrary = require('@grpc/grpc-js');
// const protobufjs = require('protobufjs');
// const fs = require("fs");
// let Root = protobufjs.loadSync('./public/resources/62c42ef4281c4d161217bb15/apis.proto');
// let Message = Root.lookupType("powermock.apis.v1alpha1.MockAPI");
// const types = Message.toJSON();

// console.log(types);


