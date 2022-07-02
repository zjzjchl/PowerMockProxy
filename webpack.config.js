const path = require('path');
const fs = require('fs');
let nodeModules = {};
fs.readdirSync('node_modules').filter(x=>['.bin'].indexOf(x) === -1).forEach(module=>nodeModules[module] = 'commonjs ' + module);
module.exports = {
    target: 'node',
    mode: 'production',
    entry: {index: './src/index.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    plugins: [

    ],
    externals: nodeModules,
};