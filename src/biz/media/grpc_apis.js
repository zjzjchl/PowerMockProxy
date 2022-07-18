const iconv = require('iconv-lite');
const moment = require('moment');
const grpcLibrary = require('@grpc/grpc-js');
const { ApiGroup } = require('../../biz/app/index');
const encoding = 'gbk';
const binaryEncoding = 'binary';

exports.makeGrpcRequest = async function(req, res) {
  console.log(req.body);
  let content = {code: 2, error: '对应的Api记录不存在!'};
  let group = await ApiGroup.getAPiGroup({query: {id: req.body.gid}}, {});
  if (group) {
    try {
      content = await new Promise((resolve, reject)=>{
        const client = new grpcLibrary.Client('192.168.192.81:30002', grpcLibrary.credentials.createInsecure());
        const metadata = new grpcLibrary.Metadata();
        metadata.set('uid', 2000);
        client.makeUnaryRequest(req.body.path, x=>x, x=>x, Buffer.from([]), metadata, (error, value)=>{
          console.log(Buffer.from(value, binaryEncoding).toString())
          const content = iconv.decode(Buffer.from(value, binaryEncoding), encoding);
          console.log(error, content);
          if (error) {
            reject({code: 1, error: 'powermock rpc调用失败', message: error});
          } else {
            resolve({code: 0, content: value});
          }
        });
      });
    } catch (error) {
      content = {...error};
    }
  }
  console.log(content);
  content.timestamp = moment().format('yyyy MM-DD HH:mm:ss');
  return {aid: req.body.aid, gid: req.body.gid, path: req.body.path, content: content};
}


