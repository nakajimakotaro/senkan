let webpack = require('webpack');
module.exports = {
    entry: {
        script: "./src/script.ts"
    },
    output: {
        filename: "script.js",
        path: __dirname + "/public/",
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'public/',
        inline: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
};
