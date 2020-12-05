const passport = require('passport')
const MockStrategy = require('passport-mock-strategy')
const http = require('http')

const ExpressServer = require('../../../expressServer')
const config = require('../../../config')

const BASE_URL = `http://localhost:${config.URL_PORT}`
const AUTH_URL = `${BASE_URL}${config.OAUTH20_CALLBACK}`

function buildServerWithMockAuthentication(user) {
    var mockPassport = new passport.Passport()
    mockPassport.use(
        new MockStrategy({
            user: user,
        })
    )

    mockPassport.serializeUser((user, cb) => {
        cb(null, JSON.stringify(user))
    })

    mockPassport.deserializeUser((user, cb) => {
        cb(null, JSON.parse(user))
    })

    var server = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML)
    server.setupMiddleware()
    server.app.use(mockPassport.initialize())
    server.app.use(mockPassport.session())
    server.app.get(
        config.OAUTH20_CALLBACK,
        mockPassport.authenticate('mock', {
            failureRedirect: '/login/error',
            successRedirect: '/',
        })
    )
    server.setupAPI()

    return server
}

class SessionHTTPClient {
    constructor() {
        this.cookie = null
    }

    async authenticate() {
        var response = await new Promise((resolve) =>
            http.get(AUTH_URL, resolve)
        )
        this.cookie = response.headers['set-cookie'][0]
    }

    async get(path) {
        return new Promise((resolve, reject) => {
            var req = http.request(
                `${BASE_URL}${path}`,
                {
                    method: 'GET',
                    headers: { Cookie: this.cookie },
                },
                (res) => {
                    var result = {
                        status: res.statusCode,
                        headers: res.headers,
                        contents: '',
                    }
                    res.on('data', (chunk) => (result.contents += chunk))
                    res.on('end', () => resolve(result))
                }
            )
            req.on('error', reject)
            req.end()
        })
    }

    async delete(path) {
        return new Promise((resolve) => {
            http.request(
                `${BASE_URL}${path}`,
                {
                    method: 'DELETE',
                    headers: { Cookie: this.cookie },
                },
                (res) => {
                    var result = {
                        status: res.statusCode,
                        headers: res.headers,
                        contents: '',
                    }
                    res.on('data', (chunk) => (result.contents += chunk))
                    res.on('end', () => resolve(result))
                }
            ).end()
        })
    }

    async post(path, body) {
        return new Promise((resolve) => {
            var req = http.request(
                `${BASE_URL}${path}`,
                {
                    method: 'POST',
                    headers: { Cookie: this.cookie },
                },
                (res) => {
                    var result = {
                        status: res.statusCode,
                        headers: res.headers,
                        contents: '',
                    }
                    res.on('data', (chunk) => (result.contents += chunk))
                    res.on('end', () => resolve(result))
                }
            )
            req.write(body)
            req.end()
        })
    }

    async put(path, body) {
        return new Promise((resolve) => {
            var req = http.request(
                `${BASE_URL}${path}`,
                {
                    method: 'PUT',
                    headers: { Cookie: this.cookie },
                },
                (res) => {
                    var result = {
                        status: res.statusCode,
                        headers: res.headers,
                        contents: '',
                    }
                    res.on('data', (chunk) => (result.contents += chunk))
                    res.on('end', () => resolve(result))
                }
            )
            req.write(body)
            req.end()
        })
    }
}

module.exports = {
    buildServerWithMockAuthentication,
    SessionHTTPClient,
}
