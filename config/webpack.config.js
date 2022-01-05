const fs = require('fs')；
const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: '../src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 
    },
    mode: 'development',
    module: {
        rules: []
    }
}