const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

const argv = process.argv[process.argv.length - 1];
const params = JSON.parse(argv);

console.log(params);

const API_DIR = '/root/example/apis/';

// 复制文件到apis目录
const log = execSync(`cp -rf ${params.source} ${API_DIR}${params.target}`);
console.log(log);
// 停止powermock服务

// 重启powermock服务


// 重新载入api接口


// const ls = spawn("powermock-v8-linux-amd64", ['serve', '--config.file', 'config.yaml', '&']);
// const ls = spawn("cp", ['-rf', params.source, params.target]);
// ls.stdout.on('data', data => {
//   console.log(`--stdout: ${data}`);
// });
// ls.stderr.on('data', data => {
//   console.log(`--stderr: ${data}`);
// });
// ls.on('close', code => {
//   console.log(`--child process exited with code ${code}`);
//   if (code === 0 || code === "0") {

//   }
// });