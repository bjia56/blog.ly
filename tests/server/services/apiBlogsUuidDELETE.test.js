import {
    apiBlogsGET,
    apiBlogsUuidDELETE,
} from '../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('./dbHelper')
const db = require('../../../sql')

describe('blog post Uuid DELETE handler tests', () => {
    test('delete blog when not logged in returns error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiBlogsUuidDELETE({ uuid: 200 })).rejects.toEqual({
            code: 401,
            error: 'Unauthorized',
        })
    })

    test('delete blog when there are no blogs returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(
            apiBlogsUuidDELETE({ uuid: 200 }, { uuid: 1 })
        ).rejects.toEqual({
            code: 404,
            error: 'Blog not found',
        })
    })

    test('delete blog with invalid input returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiBlogsUuidDELETE({}, { uuid: 1 })).rejects.toEqual({
            code: 405,
            error: 'WHERE parameter "uuid" has invalid "undefined" value',
        })
    })

    test('delete blog with invalid uuid returns reject error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
        ])

        await expect(
            apiBlogsUuidDELETE({ uuid: 200 }, { uuid: 1 })
        ).rejects.toEqual({
            code: 404,
            error: 'Blog not found',
        })
    })

    test('delete blog with valid uuid ', async () => {
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

        var data = await apiBlogsUuidDELETE({ uuid: 100 }, { uuid: 1 })
        expect(data.payload).toBe(null)
        expect(data.code).toBe(200)

        var data2 = await apiBlogsGET({})
        expect(data2.payload.uuids.length).toBe(2)
        expect(data2.payload.uuids.includes(100)).toBeFalsy()
    })

    test('delete 2 blog with valid uuid ', async () => {
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

        var data = await apiBlogsUuidDELETE({ uuid: 100 }, { uuid: 1 })
        expect(data.payload).toBe(null)
        expect(data.code).toBe(200)

        var data2 = await apiBlogsUuidDELETE({ uuid: 101 }, { uuid: 1 })
        expect(data2.payload).toBe(null)
        expect(data2.code).toBe(200)

        var data3 = await apiBlogsGET({})
        expect(data3.payload.uuids.length).toBe(1)
        expect(data3.payload.uuids.includes(100)).toBeFalsy()
        expect(data3.payload.uuids.includes(101)).toBeFalsy()
    })
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
