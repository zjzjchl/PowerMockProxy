const Config = require('config');
const bodyParser = require('body-parser');
const { expressjwt } = require('express-jwt');
const express = require('express');


const { App, ApiGroup, Resource } = require('./biz/index');

const app = express();

app.use(bodyParser.json());

const port = 3000;

const JwtSecret = Config.get('jwt-secret');
const FilterUrls = ['/account/login', '/helloworld'];

// app.use(expressjwt({ secret: JwtSecret, algorithms: ['HS256'] }).unless({
//     path: FilterUrls,
//     custom: function (req) {
//         if (FilterUrls.includes(req.url)) {
//             return true;
//         }
//         if (req.url.startsWith('/assets')) {
//             return true;
//         }
//         return false;
//     }
// }));


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


app.post('/app', async (req, res)=>{
    await App.addApp(req, res);
    res.json(req.body);
});

app.get('/app', async (req, res)=>{
    if (req.params.id) {
        let records = await App.allAppByParams(req, res);
        res.json(records);
    } else {
        let records = await App.allApp(req, res);
        res.json(records);
    }
});

app.put('/app', async (req, res)=>{
    
});

app.delete('/app', async (req, res)=>{
    
});

app.post('/apigroup', async (req, res)=>{
    await ApiGroup.addApiGroup(req, res);
    res.json(req.body);
});

app.get('/apigroup', async (req, res)=>{
    if (req.params.id) {
        let records = await ApiGroup.getAPiGroup(req, res);
        res.json(records);
    } else {
        let records = await ApiGroup.allApiGroup(req, res);
        res.json(records);
    }
});

app.put('/apigroup', async (req, res)=>{
    
});

app.delete('/apigroup', async (req, res)=>{
    
});


app.post('/upload', async (req, res)=>{
    await Resource.addResource(req, res);
    res.json({});
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
