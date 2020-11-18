// const { Middleware } = require('swagger-express-middleware');
const http = require('http')
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const OpenApiValidator = require('express-openapi-validator')
const config = require('./config')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
const compiler = webpack(webpackConfig)

class ExpressServer {
    constructor(port, openApiYaml) {
        this.port = port
        this.app = express()
        this.openApiPath = openApiYaml
        this.setupMiddleware()
    }

    setupMiddleware() {
        // this.setupAllowedMedia();
        this.app.use(
            webpackDevMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
            })
        )

        this.app.use(cors())
        this.app.use(bodyParser.json({ limit: '14MB' }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.get('/login-redirect', (req, res) => {
            res.status(200)
            res.json(req.query)
        })
        this.app.get('/oauth2-redirect.html', (req, res) => {
            res.status(200)
            res.json(req.query)
        })
        this.app.use(
            OpenApiValidator.middleware({
                apiSpec: this.openApiPath,
                operationHandlers: path.join(__dirname),
                fileUploader: { dest: config.FILE_UPLOAD_PATH },
                validateResponses: true,
            })
        )
        this.app.use((err, req, res, next) => {
            // format error
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            })
        })
    }

    launch() {
        http.createServer(this.app).listen(this.port)
        console.log(`Listening on port ${this.port}`)
    }

    async close() {
        if (this.server !== undefined) {
            await this.server.close()
            console.log(`Server on port ${this.port} shut down`)
        }
    }
}

module.exports = ExpressServer
