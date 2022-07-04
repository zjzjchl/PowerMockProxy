const fs = require('fs');
const moment = require('moment');
const multiparty = require('multiparty');
const ResourcesFolderBasePath = require('config').get('resources-folder-base-path');
const { ResourceDao } = require('../../dao/index.js');
const BaseAssetsUrl = require('config').get('base-assets-url');

exports.addResource = async function (req, res) {
  // 生成multiparty对象，并配置上传目标路径
  let uploadDir = `${ResourcesFolderBasePath}/${req.body.oId}`;
  let form = new multiparty.Form({ uploadDir: uploadDir, maxFilesSize: 2 * 1024 * 1024 });
  // 上传完成后处理
  form.parse(req, function (error, fields, files) {
    // var filesTmp = JSON.stringify(files, null, 2);
    if (!error) {
      // console.log(fields.folder);
      for (const k in files) {
        files[k].forEach(element => {
          // console.log(element);
          let folder = req.body.folder = "";
          if (fields["folder"] && fields["folder"][0]) {
            req.body.folder = fields["folder"][0];
            folder = `${fields["folder"][0]}/`;
          }
          let targetPath = uploadDir + "/" + folder + element.originalFilename;
          fs.renameSync(element.path, targetPath);
          let dao = new ResourceDao();
          req.body.timestamp = moment().valueOf();
          req.body.path = targetPath;
          req.body.size = element.size;
          req.body.url = `${BaseAssetsUrl}/${req.body.oId}/${folder}${element.originalFilename}`;
          dao.add(req.body);
        });
      }
      res.json({
        "success": true,
        "message": "上传成功",
        "id": req.body.id,
        "timestamp": req.body.timestamp,
        "folder": req.body.folder,
        "path": req.body.path,
        "size": req.body.size
        // "url": "https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg",             // 返回结果
        // "imgURL": "",         // 图片预览地址 (非必须)
        // "downloadURL": ""    // 图片下载地址 (非必须)
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