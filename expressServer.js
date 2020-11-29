// const { Middleware } = require('swagger-express-middleware');
const http = require('http')
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const OpenApiValidator = require('express-openapi-validator')
const config = require('./config')
const oauth20 = require('./oauth20')

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
        this.app.use(session({ secret: config.EXPRESS_SESSION_KEY }))
        this.app.use(oauth20.initialize())
        this.app.use(oauth20.session())
        this.app.get(
            '/login',
            oauth20.authenticate('google', { scope: ['profile', 'email'] })
        )
        this.app.get('/login/error', (req, res) => {
            res.status(401).send('<h2>Login error. Unauthorized</h2>')
        })
        this.app.get(
            '/login/callback',
            oauth20.authenticate('google', {
                failureRedirect: '/login/error',
                successRedirect: '/',
            })
        )
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
