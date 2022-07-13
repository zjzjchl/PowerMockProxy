const grpcLibrary = require('@grpc/grpc-js');
const { ApiGroup } = require('../../biz/app/index');


exports.makeGrpcRequest = async function(req, res) {
  console.log(req.body);
  let content = {code: 2, error: '对应的Api记录不存在!'};
  let group = await ApiGroup.getAPiGroup({query: {id: req.body.gid}}, {});
  if (group) {
    content = await new Promise((resolve, reject)=>{
      const client = new grpcLibrary.Client('192.168.192.81:30002', grpcLibrary.credentials.createInsecure());
      client.makeUnaryRequest(req.body.path, x=>x, x=>x, Buffer.from([]), (error, value)=>{
        // console.log(error, value);
        if (error) {
          reject({code: 1, error: 'powermock rpc调用失败', message: error});
        } else {
          resolve({code: 0, content: value});
        }
      });
    });
  }
  console.log(content);
  return {aid: req.body.aid, gid: req.body.gid, path: req.body.path, content: content};
}


