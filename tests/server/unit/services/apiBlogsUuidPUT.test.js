/**
 * @jest-environment node
 */

import {
    apiBlogsUuidPUT,
    apiBlogsUuidGET,
} from '../../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('blog post Uuid PUT handler tests', () => {
    test('invalid blog uuid returns reject error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 2, uuid: 200 }),
            db.Blog.build({ title: '', author: 1, uuid: 101 }),
        ])

        await expect(
            apiBlogsUuidPUT({ uuid: 300, body: {} }, { uuid: 1 })
        ).rejects.toEqual({
            code: 404,
            error: 'Blog not found',
        })
    })

    test('put blog without logging in returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiBlogsUuidPUT({})).rejects.toEqual({
            code: 401,
            error: 'Unauthorized',
        })
    })

    test('valid blog uuid and empty body returns correct object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: 'Number 1',
                author: 1,
                uuid: 100,
                content: 'This is my first post',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                content: 'This is my second post',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])
        await delay(1000)
        var data0 = await apiBlogsUuidPUT({ uuid: 100, body: {} }, { uuid: 1 })
        expect(data0.code).toBe(200)
        expect(data0.payload).toBe(null)

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(100)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('Number 1')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('This is my first post')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBeGreaterThan(0)
        expect('created' in data.payload)
        expect(typeof data.payload.created).toBe('number')
        expect('updated' in data.payload)
        expect(typeof data.payload.updated).toBe('number')
        expect(data.payload.updated).toBe(data.payload.created)
        expect('author' in data.payload)
        expect(typeof data.payload.author).toBe('number')
        expect(data.payload.author).toBe(1)
        expect('authorName' in data.payload)
        expect(typeof data.payload.authorName).toBe('string')
        expect(data.payload.authorName).toBe('John Doe')
    })

    test('valid blog uuid and empty title returns correct object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: 'Number 1',
                author: 1,
                uuid: 100,
                content: 'This is my first post',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                content: 'This is my second post',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])
        await delay(1000)
        var data0 = await apiBlogsUuidPUT(
            {
                uuid: 100,
                body: { contents: 'This is new content' },
            },
            { uuid: 1 }
        )
        expect(data0.code).toBe(200)
        expect(data0.payload).toBe(null)

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(100)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('Number 1')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('This is new content')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBeGreaterThan(0)
        expect('created' in data.payload)
        expect(typeof data.payload.created).toBe('number')
        expect('updated' in data.payload)
        expect(typeof data.payload.updated).toBe('number')
        expect(data.payload.updated).toBeGreaterThan(data.payload.created)
        expect('author' in data.payload)
        expect(typeof data.payload.author).toBe('number')
        expect(data.payload.author).toBe(1)
        expect('authorName' in data.payload)
        expect(typeof data.payload.authorName).toBe('string')
        expect(data.payload.authorName).toBe('John Doe')
    })

    test('valid blog uuid and empty contents returns correct object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: 'Number 1',
                author: 1,
                uuid: 100,
                content: 'This is my first post',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                content: 'This is my second post',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        await delay(1000)
        var data0 = await apiBlogsUuidPUT(
            {
                uuid: 100,
                body: { title: 'This is new title' },
            },
            { uuid: 1 }
        )
        expect(data0.code).toBe(200)
        expect(data0.payload).toBe(null)

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(100)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('This is new title')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('This is my first post')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBeGreaterThan(0)
        expect('created' in data.payload)
        expect(typeof data.payload.created).toBe('number')
        expect('updated' in data.payload)
        expect(typeof data.payload.updated).toBe('number')
        expect(data.payload.updated).toBeGreaterThan(data.payload.created)
        expect('author' in data.payload)
        expect(typeof data.payload.author).toBe('number')
        expect(data.payload.author).toBe(1)
        expect('authorName' in data.payload)
        expect(typeof data.payload.authorName).toBe('string')
        expect(data.payload.authorName).toBe('John Doe')
    })

    test('valid blog uuid and non empty body returns correct object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: 'Number 1',
                author: 1,
                uuid: 100,
                content: 'This is my first post',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                content: 'This is my second post',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        await delay(1000)
        var data0 = await apiBlogsUuidPUT(
            {
                uuid: 100,
                body: {
                    title: 'This is new title',
                    contents: 'This is new content',
                },
            },
            { uuid: 1 }
        )
        expect(data0.code).toBe(200)
        expect(data0.payload).toBe(null)

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(100)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('This is new title')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('This is new content')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBeGreaterThan(0)
        expect('created' in data.payload)
        expect(typeof data.payload.created).toBe('number')
        expect('updated' in data.payload)
        expect(typeof data.payload.updated).toBe('number')
        expect(data.payload.updated).toBeGreaterThan(data.payload.created)
        expect('author' in data.payload)
        expect(typeof data.payload.author).toBe('number')
        expect(data.payload.author).toBe(1)
        expect('authorName' in data.payload)
        expect(typeof data.payload.authorName).toBe('string')
        expect(data.payload.authorName).toBe('John Doe')
    })

    test('call put to multiple times with valid blog uuid and non empty body returns correct objects', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: 'Number 1',
                author: 1,
                uuid: 100,
                content: 'This is my first post',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                content: 'This is my second post',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        await delay(1000)
        var data0 = await apiBlogsUuidPUT(
            {
                uuid: 100,
                body: {
                    title: 'This is new title',
                    contents: 'This is new content',
                },
            },
            { uuid: 1 }
        )
        expect(data0.code).toBe(200)
        expect(data0.payload).toBe(null)

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(100)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('This is new title')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('This is new content')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBeGreaterThan(0)
        expect('created' in data.payload)
        expect(typeof data.payload.created).toBe('number')
        expect('updated' in data.payload)
        expect(typeof data.payload.updated).toBe('number')
        expect(data.payload.updated).toBeGreaterThan(data.payload.created)
        expect('author' in data.payload)
        expect(typeof data.payload.author).toBe('number')
        expect(data.payload.author).toBe(1)
        expect('authorName' in data.payload)
        expect(typeof data.payload.authorName).toBe('string')
        expect(data.payload.authorName).toBe('John Doe')

        await delay(1000)
        var data1 = await apiBlogsUuidPUT(
            {
                uuid: 100,
                body: {
                    title: '',
                    contents: '',
                },
            },
            { uuid: 1 }
        )
        expect(data1.code).toBe(200)
        expect(data1.payload).toBe(null)

        var data2 = await apiBlogsUuidGET({ uuid: 100 })
        expect(typeof data2.payload).toBe('object')
        expect('uuid' in data2.payload)
        expect(typeof data2.payload.uuid).toBe('number')
        expect(data2.payload.uuid).toBe(100)
        expect('title' in data2.payload)
        expect(typeof data2.payload.title).toBe('string')
        expect(data2.payload.title).toBe('')
        expect('contents' in data2.payload)
        expect(typeof data2.payload.contents).toBe('string')
        expect(data2.payload.contents).toBe('')
        expect('rendered' in data2.payload)
        expect(data2.payload.rendered.length).toBe(0)
        expect('created' in data2.payload)
        expect(typeof data2.payload.created).toBe('number')
        expect(data2.payload.created).toBe(data.payload.created)
        expect('updated' in data2.payload)
        expect(typeof data2.payload.updated).toBe('number')
        expect(data2.payload.updated).toBeGreaterThan(data2.payload.created)
        expect(data2.payload.updated).toBeGreaterThan(data.payload.updated)
        expect('author' in data2.payload)
        expect(typeof data2.payload.author).toBe('number')
        expect(data2.payload.author).toBe(1)
        expect('authorName' in data2.payload)
        expect(typeof data2.payload.authorName).toBe('string')
        expect(data2.payload.authorName).toBe('John Doe')
    })
})
