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

describe('blog post editing acceptance tests', () => {
    test('edit blog', async () => {
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

        // Check records in database match what is expected
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [3, 2, 1] })
        })

        // Update title and contents
        await client
            .put('/api/blogs/2', { title: 'My Blog', contents: '# Some text' })
            .then((response) => {
                expect(response.status).toBe(200)
                expect(response.data).toEqual('')
            })

        // Fetch updated blog
        await client.get('/api/blogs/2').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data.uuid).toBe(2)
            expect(response.data.title).toBe('My Blog')
            expect(response.data.contents).toBe('# Some text')
            expect(response.data.rendered).toBe('<h1>Some text</h1>\n')
            expect(typeof response.data.created).toBe('number')
            expect(typeof response.data.updated).toBe('number')
            expect(response.data.author).toBe(MOCK_USER.uuid)
            expect(response.data.authorName).toBe(MOCK_USER.name)
        })
    })

    test('editing invalid blog should fail', async () => {
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

        // Attempt to edit an invalid blog
        await client
            .put('/api/blogs/4', { title: 'some title', contents: 'some text' })
            .then((response) => {
                expect(response.status).toBe(404)
            })

        // Check that no new blogs were created
        await client.get('/api/blogs').then((response) => {
            expect(response.status).toBe(200)
            expect(response.data).toEqual({ uuids: [2, 3, 1] })
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
