const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const koutoSwiss = require('kouto-swiss');

var isProd = process.env.NODE_ENV === 'production';
var cssDev = ['style-loader', 'css-loader', 'stylus-loader'];
var cssProd = ExtractTextPlugin.extract({
    use: ['css-loader', 'stylus-loader'],
    fallback: 'style-loader'
});

console.log('prod', isProd);
var cssConfig = isProd ? cssProd : cssDev;

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        // 'babel-polyfill',
        index: ['./js/index']
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, "www"),
        filename: !isProd ? 'js/[name].js' : 'js/[name].min.js',
        chunkFilename: !isProd ? 'js/[id].chunk.js' : 'js/[id].chunk.min.js'
    },
    module: {
        // 'loaders' change to 'rules'

        rules: [{
            test: /\.(es6|js)$/,
            exclude: /node_modules/,
            use: 'babel-loader'

        }, {
            test: /\.styl$/,
            // include: /node_modules/,
            use: cssConfig
        }, {
            test: /\.pug$/,
            use: 'pug-loader'
        }, {
            test: /\.(ttf|otf|eot|woff|woff2)$/,
            loader: 'file-loader?name=[path][name].[ext]?[hash]'
        }, {
            test: /\.png$/,
            loader: 'file-loader?name=[path][name].[ext]?[hash]'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: 'pug/index.pug'
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.styl$/,
            stylus: {
                default: {
                    use: [koutoSwiss()],
                    preferPathResolver: 'webpack',
                }
            }
        }),
        new ExtractTextPlugin({
            filename: "css/[name].min.css",
            disable: !isProd,
            allChunks: true
        }),
        new CleanWebpackPlugin(['www'], {
            root: __dirname,
            verbose: true,
            dry: false,
            exclude: ['']
        }),
        new CopyWebpackPlugin([{
            from: path.resolve('src/images'),
            to: path.resolve('www/images')
        }]),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        //modulesDirectories change to modules
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: ['.js', '.es6', '.styl', '.pug'],
    }
};


if (isProd) {
    config.devtool = "cheap-source-map";
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
        // new webpack.optimize.CommonsChunkPlugin({
        //     filename: 'js/commons.js',
        //     name: 'commons'
        // })
    )

} else {
    config.devServer = {
        // proxy: {
        //   '*': 'http://localhost:8080'
        // },
        hot: true,
        contentBase: path.join(__dirname, "www"),
        compress: true
    };
}

module.exports = config;
