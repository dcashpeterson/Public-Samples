"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
// Note: this require may need to be fixed to point to the build that exports the gulp-core-build-webpack instance.
const webpackTask = require('@microsoft/web-library-build').webpack;
const webpack = webpackTask.resources.webpack;
const isProduction = webpackTask.buildConfig.production;
// eslint-disable-next-line
const packageJSON = require('./package.json');
const webpackConfiguration = {
    context: __dirname,
    devtool: isProduction ? undefined : 'source-map',
    entry: {
        [packageJSON.name]: path.join(__dirname, webpackTask.buildConfig.libFolder, 'index.js')
    },
    output: {
        libraryTarget: 'umd',
        path: path.join(__dirname, webpackTask.buildConfig.distFolder),
        filename: `[name]${isProduction ? '.min' : ''}.js`
    },
    // The typings are missing the "object" option here (https://webpack.js.org/configuration/externals/#object)
    externals: {
        react: {
            amd: 'react',
            commonjs: 'react'
        },
        'react-dom': {
            amd: 'react-dom',
            commonjs: 'react-dom'
        }
    },
    plugins: [
    // new WebpackNotifierPlugin()
    ]
};
if (isProduction && webpackConfiguration.plugins) {
    webpackConfiguration.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
            dead_code: true,
            warnings: false
        }
    }));
}
exports = webpackConfiguration;
//# sourceMappingURL=webpack.config.js.map