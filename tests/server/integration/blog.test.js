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

describe('blog tests', () => {
    test('check blog can be fetched when unauthenticated', async () => {
        await populateDatabase([
            db.User.build({
                uuid: MOCK_UUID,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: MOCK_UUID, uuid: 100 }),
        ])

        await new TestClient().get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [100] })
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
