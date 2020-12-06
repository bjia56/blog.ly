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

describe('blog post creation acceptance tests', () => {
    test('create initial blog', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        // Start with no blog records in the database
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [] })
        })

        // Create a new blog
        await client.post('/api/blogs').then((response) => {
            expect(response.status).toBe(201)
            expect(response.data).toEqual({ uuid: 1 })
        })

        // Check blog exists
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [1] })
        })
    })

    test('create second blog', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        // Construct prerequisites
        await client.post('/api/blogs')
        await delay(1000)

        // Create a new blog
        await client.post('/api/blogs').then((response) => {
            expect(response.status).toBe(201)
            expect(response.data).toEqual({ uuid: 2 })
        })

        // Get new blog
        await client.get('/api/blogs/2').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data.uuid).toBe(2)
            expect(response.data.title).toBe('')
            expect(response.data.contents).toBe('')
            expect(response.data.rendered).toBe('')
            expect(typeof response.data.created).toBe('number')
            expect(typeof response.data.updated).toBe('number')
            expect(response.data.author).toBe(MOCK_USER.uuid)
            expect(response.data.authorName).toBe(MOCK_USER.name)
        })
    })

    test('creating blog should ignore request body', async () => {
        await populateDatabase([])
        var client = new TestClient()
        await client.authenticate()

        // Construct prerequisites
        await client.post('/api/blogs')
        await delay(1000)
        await client.post('/api/blogs')
        await delay(1000)

        // Create a new blog with contents in the request body
        await client
            .post('/api/blogs', 'aaaaaaaaaaaaaaaaaaaaaaa')
            .then((response) => {
                expect(response.status).toBe(201)
                expect(response.data).toEqual({ uuid: 3 })
            })

        // Check blog was created
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [3, 2, 1] })
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
