
const path = require('path');
const WebpackExtractTextPlugin = require('extract-text-webpack-plugin');
const sfraBuilderConfig = require('./sfraBuilderConfig');

/**
 * @param {string} executingDir - DirName from which this script is originally executed to be the same as node_modules
 * @param {string} cartridge - Cartridge to compile
 * @param {boolean} isDevelopment - Determine the mode of bundling
 * @param {string} fileType - File to add rulesets for
 * @returns {array} Rulesets for frontend compilation
 */
function buildRuleSet(executingDir, cartridge, isDevelopment, fileType) {
    const sourcePath = path.resolve(executingDir, cartridge, 'cartridge/client');
    let sassIncludePath = [];
    sfraBuilderConfig.cartridges.map(includeCartridges => {
        sassIncludePath.push(path.resolve(includeCartridges.split('cartridges')[0], 'node_modules'));
        sassIncludePath.push(path.resolve(includeCartridges.split('cartridges')[0], 'node_modules/flag-icon-css/sass'));
    });
    sassIncludePath.push(path.resolve(executingDir, 'node_modules'));
    sassIncludePath.push(path.resolve(executingDir, 'node_modules/flag-icon-css/sass'));
    const ruleSet = [];
    if (fileType === 'js') {
        ruleSet.push(
            {
                test: /\.js$/,
                include: sourcePath,
                exclude: /node_modules/,
                use: ['eslint-loader'],
                enforce: 'pre',
            },
            {
                test: /bootstrap(.)*\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread'],
                        cacheDirectory: true,
                    },
                },
            }
        );
    } else if (fileType === 'jsx') {
        ruleSet.push(
            {
                test: /\.jsx$/,
                include: sourcePath,
                exclude: /node_modules/,
                use: ['eslint-loader'],
                enforce: 'pre',
            },
            
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['react'],
                },
            },
        );
    }  else {
        ruleSet.push({
            test: /\.scss$/,
            loader: WebpackExtractTextPlugin.extract([
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        sourceMap: isDevelopment,
                        minimize: !isDevelopment,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('autoprefixer')],
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        includePaths: sassIncludePath,
                        sourceMap: isDevelopment,
                        minimize: !isDevelopment,
                    },
                },
            ]),
        });
    }
    return ruleSet;
}

module.exports = {
    buildRuleSet,
};
