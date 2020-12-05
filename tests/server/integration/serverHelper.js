const passport = require('passport')
const MockStrategy = require('passport-mock-strategy')
const http = require('http')
const axios = require('axios')

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
        var client = axios.create({
            method: 'GET',
            headers: { common: { Cookie: this.cookie } },
        })
        return client(`${BASE_URL}${path}`)
    }

    async delete(path) {
        var client = axios.create({
            method: 'DELETE',
            headers: { common: { Cookie: this.cookie } },
        })
        return client(`${BASE_URL}${path}`)
    }

    async post(path, body) {
        var client = axios.create({
            method: 'POST',
            data: body,
            headers: { common: { Cookie: this.cookie } },
        })
        return client(`${BASE_URL}${path}`)
    }

    async put(path, body) {
        var client = axios.create({
            method: 'PUT',
            data: body,
            headers: { common: { Cookie: this.cookie } },
        })
        return client(`${BASE_URL}${path}`)
    }
}

module.exports = {
    buildServerWithMockAuthentication,
    SessionHTTPClient,
}
