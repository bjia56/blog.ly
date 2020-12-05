/**
 * @jest-environment node
 */

const {
    buildServerWithMockAuthentication,
    SessionHTTPClient,
} = require('./serverHelper')
const { populateDatabase } = require('../dbHelper')

const db = require('../../../sql')

var server = null
var client = null

const MOCK_UUID = 1234

beforeEach(async (done) => {
    server = buildServerWithMockAuthentication({
        uuid: MOCK_UUID,
    })
    client = new SessionHTTPClient()
    await server.launch()
    await client.authenticate()
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

        await client.get('/api/user').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data.uuid).toBe(MOCK_UUID)
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    client = null
    done()
})

afterAll(async (done) => {
    // close db after completion
    await db.close()
    done()
})
