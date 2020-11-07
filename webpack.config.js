const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
    // set the default mode to be development.
    // we should adjust it once the skeleton of the project is complete.
    mode: 'development',
    entry: './web/src/index.js',
    // for debugging
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './web/src/index.html',
            filename: './index.html',
        }),
    ],
}
