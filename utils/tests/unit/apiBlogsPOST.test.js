import { apiBlogsPOST } from '../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

const db = require('../../../sql')

describe('create Blog POST handler tests', () => {
    test('create blog returns JSON with an integer uuid', () => {
        return apiBlogsPOST().then((data) => {
            expect(typeof data.payload).toBe('object')
            expect('uuid' in data.payload)
            expect(typeof data.payload.uuid).toBe('number')
            expect(data.code).toBe(201)
        })
    })

    test('blogIDs increment by 1', async () => {
        var blogID1 = await apiBlogsPOST()
        var blogID2 = await apiBlogsPOST()
        expect(blogID2.payload.uuid).toBe(blogID1.payload.uuid + 1)
    })
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
