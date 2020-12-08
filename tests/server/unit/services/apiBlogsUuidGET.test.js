/**
 * @jest-environment node
 */

import { apiBlogsUuidGET } from '../../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

describe('blog post Uuid GET handler tests', () => {
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

        await expect(apiBlogsUuidGET({ uuid: 300 })).rejects.toEqual({
            code: 404,
            error: 'Blog not found',
        })
    })

    test('empty database returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiBlogsUuidGET({ uuid: 300 })).rejects.toEqual({
            code: 404,
            error: 'Blog not found',
        })
    })

    test('get blog with invalid input returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiBlogsUuidGET({})).rejects.toEqual({
            code: 500,
            error: 'Internal server error',
        })
    })

    test('valid blog uuid returns correct object', async () => {
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

        var data = await apiBlogsUuidGET({ uuid: 100 })
        expect(data.code).toBe(200)
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

    test('valid blog uuid with no content returns correct object', async () => {
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
                content: '',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        var data = await apiBlogsUuidGET({ uuid: 101 })
        expect(data.code).toBe(200)
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(101)
        expect('title' in data.payload)
        expect(typeof data.payload.title).toBe('string')
        expect(data.payload.title).toBe('')
        expect('contents' in data.payload)
        expect(typeof data.payload.contents).toBe('string')
        expect(data.payload.contents).toBe('')
        expect('rendered' in data.payload)
        expect(data.payload.rendered.length).toBe(0)
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
})
