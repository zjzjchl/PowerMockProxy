const Config = require('config');
const { expressjwt } = require('express-jwt');
const express = require('express');
const app = express();

const port = 3000;

const JwtSecret = Config.get('jwt-secret');
const FilterUrls = ['/account/login', '/helloworld'];

app.use(expressjwt({ secret: JwtSecret, algorithms: ['HS256'] }).unless({
    path: FilterUrls,
    custom: function (req) {
        if (FilterUrls.includes(req.url)) {
            return true;
        }
        if (req.url.startsWith('/assets')) {
            return true;
        }
        return false;
    }
}));


function Authentication(url) {
    return function (req, res, next) {
        console.log(req.method + '  ' + req.path);
        next();
    };
}


app.all('*', Authentication(), function (req, res, next) {
    // res.set("Access-Control-Allow-Origin", "http://www.xxx.net:3000");
    res.set("Access-Control-Allow-Origin", "*");
  
    res.set("Access-Control-Allow-Methods", "POST,OPTIONS,DELETE");
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Expose-Headers", "Authorization");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

app.get('/helloworld', (req, res) => {
    res.send('Hello World');
});


app.use(function (err, req, res, next) {
    console.log(err);
    console.log(process.pid);
    if (err.name === 'UnauthorizedError') {
      res.set("Access-Control-Allow-Origin", "http://www.baidu.com");
      res.set("Access-Control-Allow-Credentials", "true");
      res.set("Access-Control-Expose-Headers", "Redirect-Url");
      res.set("Redirect-Url", "/login/index");
      res.status(401).send(err.message);
    } else if (err.name === 'NotImplementedError') {
      res.set("Access-Control-Allow-Origin", "http://www.baidu.com"); // 跨域这个设置很重要的
      res.set("Access-Control-Allow-Credentials", "true");
      console.error(err.message);
      res.status(501).send(err.message);
    }
  });


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
