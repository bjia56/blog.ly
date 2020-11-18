import { apiBlogsGET } from '../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('./dbHelper')
const db = require('../../../sql')

describe('blog posts GET handler tests', () => {
    test('get all blogs with no limit returns a list of ids', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
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
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
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

    test('get all blogs in decending order based on updated returns a list of ids', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 100,
                updated: new Date(2020, 8, 12),
            }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
                name: 'John Smith',
                notificationPreference: '',
            }),
            db.Blog.build({
                title: '',
                author: 2,
                uuid: 200,
                updated: new Date(2020, 9, 1),
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 101,
                updated: new Date(2020, 9, 14),
            }),
            db.Blog.build({
                title: '',
                author: 1,
                uuid: 300,
                updated: new Date(2020, 9, 15),
            }),
        ])

        var data = await apiBlogsGET({})
        console.log(data.payload.uuids)
        expect(typeof data.payload).toBe('object')
        expect('uuids' in data.payload)
        expect(data.payload.uuids.length).toBe(4)
        expect(data.payload.uuids[0]).toBe(300)
        expect(data.payload.uuids[2]).toBe(100)
        expect(data.code).toBe(200)
    })

    test('get all blogs given a author uuid returns a list of ids', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
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
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
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
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
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
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
