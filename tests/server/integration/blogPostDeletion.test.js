/**
 * @jest-environment node
 */

const { TestServer, TestClient } = require('./serverHelper')
const { populateDatabase } = require('../dbHelper')

const db = require('../../../sql')

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

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

describe('blog post deletion acceptance tests', () => {
    test('delete blog', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        // Construct prerequisites
        await client.post('/api/blogs')
        await delay(1000)
        await client.post('/api/blogs')
        await delay(1000)
        await client.post('/api/blogs')
        await delay(1000)
        await client.put('/api/blogs/2', {
            title: 'My Blog',
            contents: '# Some text',
        })
        await delay(1000)

        // Check records in database match what is expected
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [2, 3, 1] })
        })

        // Delete blog entry
        await client.delete('/api/blogs/1').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual('')
        })

        // Make sure blog was deleted
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [2, 3] })
        })
    })

    test('deleting invalid blog should fail', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        // Construct prerequisites
        await client.post('/api/blogs')
        await delay(1000)
        await client.post('/api/blogs')
        await delay(1000)
        await client.post('/api/blogs')
        await delay(1000)
        await client.put('/api/blogs/2', {
            title: 'My Blog',
            contents: '# Some text',
        })
        await delay(1000)
        await client.delete('/api/blogs/1')
        await delay(1000)

        // Check records in database match what is expected
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [2, 3] })
        })

        // Attempt to delete invalid blog
        await client.delete('/api/blogs/1').then((response) => {
            expect(response.status).toBe(404)
        })

        // Check that no other blogs were affected
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [2, 3] })
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
