const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

const api = require('./api/api')

// TODO This should be conditional once we have a production environment set up.
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
)

app.use('/api', api)

// Serve the files on port 3000.
app.listen(3000, function () {
    console.log('blog.ly: server is listening on localhost:3000')
})
