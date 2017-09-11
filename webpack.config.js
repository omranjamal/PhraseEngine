const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './scripts/try.js',
    output: {
        path: path.resolve(__dirname, 'dist_scripts'),
        filename: 'try.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat",
            'create-react-class': "preact-compat/lib/create-react-class"
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "scripts"),
                    path.resolve(__dirname, "node_modules/phrase-engine/dist")
                ]
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin()
    ]
};