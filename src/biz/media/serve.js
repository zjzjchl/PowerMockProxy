const spawn = require('child_process').spawn;

const argv = process.argv[process.argv.length - 1];
const params = JSON.parse(argv);

console.log(params);

// const params = {source: '/root/PowerMockProxy/public/resources/62c42ef4281c4d161217bb15/play.proto', target: 'play.proto'};

const API_DIR = '/root/example/apis/';

// 重新载入api接口
const ls = spawn("sh", ['/root/PowerMockProxy/powermock.sh', `${params.source}`, `${API_DIR}${params.target}`]);
ls.stdout.on('data', data => {
  console.log(`--stdout: ${data}`);
});
ls.stderr.on('data', data => {
  console.log(`--stderr: ${data}`);
});
ls.on('close', code => {
  console.log(`--child process exited with code ${code}`);
  if (code === 0 || code === "0") {

  }
});