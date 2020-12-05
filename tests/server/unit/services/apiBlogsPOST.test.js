import { apiBlogsPOST } from '../../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

describe('create Blog POST handler tests', () => {
    test('create blog returns JSON with an integer uuid', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
        ])

        var data = await apiBlogsPOST(null, { uuid: 1 })
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(101)
        expect(data.code).toBe(201)
    })

    test('blogIDs increment by 1', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.Blog.build({ title: '', author: 1, uuid: 100 }),
        ])

        var blogID1 = await apiBlogsPOST(null, { uuid: 1 })
        var blogID2 = await apiBlogsPOST(null, { uuid: 1 })
        expect(blogID2.payload.uuid).toBe(blogID1.payload.uuid + 1)
    })
})

afterAll(async (done) => {
    // close db after completion
    await db.close()
    done()
})
