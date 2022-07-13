// const protoLoader = require('@grpc/proto-loader');
const grpcLibrary = require('@grpc/grpc-js');
const { ApiGroup } = require('../../biz/app/index');
const iconv = require('iconv-lite');
const encoding = 'gbk';
const binaryEncoding = 'binary';

// const options = {};

exports.makeGrpcRequest = async function(req, res) {
  console.log(req.body);
  let content = {code: 2, error: '对应的记录不存在'};
  let group = await ApiGroup.getAPiGroup({query: {id: req.body.gid}}, {});
  if (group) {
    // const packageDefinition = protoLoader.loadSync(group.path, options);
    // const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition); 
    content = await new Promise((resolve, reject)=>{
      const client = new grpcLibrary.Client('192.168.192.81:30002', grpcLibrary.credentials.createInsecure());
      client.makeUnaryRequest(req.body.path, x=>x, x=>x, Buffer.from([]), (error, value)=>{
        // console.log(error, value);
        if (error) {
          reject({code: 1});
        } else {
          const content = iconv.decode(Buffer.from(value, binaryEncoding), encoding);
          resolve({code: 0, content: content});
        }
      });
    });
  //  console.log(content);
  }

  return {aid: req.body.aid, gid: req.body.gid, path: req.body.path, content: content};
}


