const protoLoader = require('@grpc/proto-loader');



exports.makeGrpcRequest = async function(req, res) {
  console.log(req.body);
  let content = "read a book";
  return {aid: req.body.aid, gid: req.body.gid, path: req.body.path, content: content};
}

// exports.getTreeOfProtoFile({query: { data: '{"_id":"b12665d2b48e499580458861","aid":"62c42ef4281c4d161217bb15","name":"apis.proto","path":"./public/resources/62c42ef4281c4d161217bb15/apis.proto","size":3049,"timestamp":1657173777706,"type":"grpc"}'}}, null);

// const grpcLibrary = require('@grpc/grpc-js');
// const protobufjs = require('protobufjs');
// const fs = require("fs");
// let Root = protobufjs.loadSync('./public/resources/62c42ef4281c4d161217bb15/apis.proto');
// let Message = Root.lookupType("powermock.apis.v1alpha1.MockAPI");
// const types = Message.toJSON();

// console.log(types);


