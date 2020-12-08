/**
 * @jest-environment node
 */

import {
    apiBlogsGET,
    apiBlogsUuidPUT,
} from '../../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

//helper function to create pause between each entry
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('blog posts GET handler tests', () => {
    test('get all blogs with no limit returns a list of ids', async () => {
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

        var data = await apiBlogsGET({})
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(3)
        expect(data.code).toBe(200)
    })

    test('get all blogs with no blogs returns an empty list', async () => {
        await dbHelper.populateDatabase([])
        var data = await apiBlogsGET({})
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(0)
        expect(data.code).toBe(200)
    })

    test('get all blogs with a limit of 2 returns a list of ids', async () => {
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

        var data = await apiBlogsGET({ limit: 2 })
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(2)
        expect(data.code).toBe(200)
    })

    test('get all blogs in descending order based on updated returns a list of ids', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.User.build({
                uuid: 2,
                email: 'jsmith@example.com',
                name: 'John Smith',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.Blog.build({ title: '', author: 2, uuid: 200 }),
            db.Blog.build({ title: '', author: 1, uuid: 101 }),
            db.Blog.build({ title: '', author: 1, uuid: 300 }),
        ])
        await delay(1000)
        await apiBlogsUuidPUT(
            { uuid: 100, body: { title: '100' } },
            { uuid: 1 }
        )

        await delay(1000)
        await apiBlogsUuidPUT(
            { uuid: 200, body: { title: '200' } },
            { uuid: 2 }
        )

        await delay(1000)
        await apiBlogsUuidPUT(
            { uuid: 101, body: { title: '101' } },
            { uuid: 1 }
        )

        await delay(1000)
        await apiBlogsUuidPUT(
            { uuid: 300, body: { title: '300' } },
            { uuid: 1 }
        )

        var data = await apiBlogsGET({})
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(4)
        expect(data.payload.uuids[0]).toBe(300)
        expect(data.payload.uuids[1]).toBe(101)
        expect(data.payload.uuids[2]).toBe(200)
        expect(data.payload.uuids[3]).toBe(100)
        expect(data.code).toBe(200)
    })

    test('get all blogs given a author uuid returns a list of ids', async () => {
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

        var data = await apiBlogsGET({ author: 1 })
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(2)
        expect(data.payload.uuids.includes(100)).toBeTruthy()
        expect(data.payload.uuids.includes(101)).toBeTruthy()
        expect(data.payload.uuids.includes(200)).toBeFalsy()
        expect(data.code).toBe(200)
    })

    test('get all blogs given a author uuid and a limit returns a list of ids', async () => {
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
            db.Blog.build({ title: '', author: 1, uuid: 102 }),
        ])

        var data = await apiBlogsGET({ author: 1, limit: 2 })
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(2)
        expect(data.payload.uuids.includes(200)).toBeFalsy()
        expect(data.code).toBe(200)
    })

    test('get all blogs given a author uuid that does not exist returns an empty list', async () => {
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

        var data = await apiBlogsGET({ author: 3 })
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(0)
        expect(data.code).toBe(200)
    })

    test('get blogs database error', async () => {
        await db.dropAll()

        await expect(apiBlogsGET({ author: 3 })).rejects.toEqual({
            code: 500,
            error: 'Internal server error',
        })
    })
})
