const spawn = require('child_process').spawn;
const argv = process.argv[process.argv.length - 1];
const params = JSON.parse(argv);

console.log(params);


const ls = spawn("powermock-v8-linux-amd64", ['load', '--address=127.0.0.1:30000', params.path]);
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