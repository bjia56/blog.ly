const passport = require('passport')
const MockStrategy = require('passport-mock-strategy')
const http = require('http')
const axios = require('axios')

const ExpressServer = require('../../../expressServer')
const config = require('../../../config')
const User = require('../../../sql').User

const BASE_URL = `http://localhost:${config.URL_PORT}`
const AUTH_URL = `${BASE_URL}${config.OAUTH20_CALLBACK}`

// Wraps an ExpressServer and uses a mocked authentication
// module instead of oauth20
class TestServer {
    constructor(user) {
        var mockPassport = new passport.Passport()
        mockPassport.use(
            new MockStrategy(
                {
                    user: user,
                },
                function (user, cb) {
                    User.findOrCreate({
                        where: { email: user.email },
                        defaults: user,
                    }).then((user) => {
                        cb(null, { uuid: user[0].uuid })
                    })
                }
            )
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

        this.server = server
    }

    launch() {
        return this.server.launch()
    }

    close() {
        return this.server.close()
    }
}

class TestClient {
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
        var client = axios.create({
            method: 'GET',
            headers: { get: { Cookie: this.cookie } },
            validateStatus: () => true,
        })
        return client(`${BASE_URL}${path}`)
    }

    async delete(path) {
        var client = axios.create({
            method: 'DELETE',
            headers: { delete: { Cookie: this.cookie } },
            validateStatus: () => true,
        })
        return client(`${BASE_URL}${path}`)
    }

    async post(path, body) {
        var client = axios.create({
            method: 'POST',
            headers: { post: { Cookie: this.cookie } },
            validateStatus: () => true,
        })
        return client(`${BASE_URL}${path}`, { data: body })
    }

    async put(path, body) {
        console.log(body)
        var client = axios.create({
            method: 'PUT',
            headers: { put: { Cookie: this.cookie } },
            validateStatus: () => true,
        })
        return client(`${BASE_URL}${path}`, { data: body })
    }
}

module.exports = {
    TestServer,
    TestClient,
}
