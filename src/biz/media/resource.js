const iconv = require('iconv-lite');
const fs = require('fs');
const multiparty = require('multiparty');
const ResourcesFolderBasePath = require('config').get('resources-folder-base-path');
const { ResourceDao } = require('../../dao/index.js');
const { ApiGroup } = require('../../biz/app/index');
const child_process = require('child_process');
const encoding = 'gbk';
const binaryEncoding = 'binary';

exports.getProto = async function (req, res) {
  const content = fs.readFileSync(req.query.path);
  return content;
}

exports.getGrpcMock = async function (req, res) {
  let path = req.query.path.replace('.proto', '.yaml');
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "");
  }
  const content = fs.readFileSync(path);
  return content;
}

exports.addGrpcMock = async function (req, res) {
  let path = req.body.path.replace('.proto', '.yaml');
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "");
  }
  const content = iconv.decode(Buffer.from(req.body.content, binaryEncoding), encoding);
  
  fs.writeFileSync(path, content);

  // 然后调用载入脚本
  let params = {path};
  child_process.spawn('node', [__dirname + '/load.js', JSON.stringify(params)]);
}

exports.addResource = async function (req, res) {
  // 生成multiparty对象，并配置上传目标路径
  let uploadDir = `${ResourcesFolderBasePath}`;
  let form = new multiparty.Form({ uploadDir: uploadDir, maxFilesSize: 2 * 1024 * 1024 });
  // 上传完成后处理
  form.parse(req, function (error, fields, files) {
    if (!error) {
      console.log(fields, files);
      for (let key in files) {
        files[key].forEach(element => {
          console.log(element);
          let aid = req.body.aid = "";
          if (fields["aid"] && fields["aid"][0]) {
            req.body.aid = fields["aid"][0];
            aid = `${fields["aid"][0]}/`;
          }
          let targetDir = uploadDir + "/" + aid;
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
          }
          let targetPath = targetDir + element.originalFilename;
          fs.renameSync(element.path, targetPath);
          
          // _id, aid, name, timestamp, type,  path, size, url
          req.body.type = "grpc";
          req.body.name = element.originalFilename;
          req.body.path = targetPath; 
          req.body.size = element.size;
          ApiGroup.addApiGroupWithId(req, res);

          // 然后调用文件复制脚本
          let params = {source: req.body.path, target: `${req.body.name}`};
          child_process.spawn('node', [__dirname + '/serve.js', JSON.stringify(params)]);

        });
      }
      res.json({
        "success": true,
        "message": "上传成功",
        "data": req.body
      });
    } else {
      res.json({
        "success": false,
        "message": error.message,
      });
    }
  }
  );
};

exports.deleteResource = async function (req, res) {
  fs.unlinkSync(req.body.path);
  let dao = new ResourceDao();
  await dao.delete(req.body);
};

exports.allResources = async function (req, res) {
  let dao = new ResourceDao();
  return await dao.all(req.body);
};