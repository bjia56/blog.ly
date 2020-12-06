/**
 * @jest-environment node
 */

const { TestServer, TestClient } = require('./serverHelper')
const { populateDatabase } = require('../dbHelper')

const db = require('../../../sql')

var server = null

const MOCK_USER = {
    uuid: 1234,
    email: 'jdoe@example.com',
    name: 'John Doe',
    notificationPreference: '',
}

beforeEach(async (done) => {
    server = new TestServer(MOCK_USER)
    await server.launch()
    done()
})

describe('check mock authentication', () => {
    test('check mock authentication works', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        await client.get('/api/user').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data.uuid).toBe(MOCK_USER.uuid)
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
