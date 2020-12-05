/**
 * @jest-environment node
 */

const { TestServer, TestClient } = require('./serverHelper')
const { populateDatabase } = require('../dbHelper')

const db = require('../../../sql')

var server = null

const MOCK_UUID = 1234

beforeEach(async (done) => {
    server = new TestServer({ uuid: MOCK_UUID })
    await server.launch()
    done()
})

describe('check mock authentication', () => {
    test('check mock authentication works', async () => {
        await populateDatabase([
            db.User.build({
                uuid: MOCK_UUID,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
        ])
        var client = new TestClient()
        await client.authenticate()

        await client.get('/api/user').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data.uuid).toBe(MOCK_UUID)
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
