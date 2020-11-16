import { apiBlogsPOST } from '../../../services/BlogService.js'
import 'regenerator-runtime/runtime'

// test('test for test', () => {
//     expect(1 + 1).toBe(2)
// })

describe('create Blog POST handler tests', () => {
    test('create blog returns an integer id', () => {
        return apiBlogsPOST().then((data) => {
            expect(typeof data.payload).toBe('number')
            expect(data.code).toBe(200)
        })
    })

    test('blogIDs increment by 1', async () => {
        let blogID1 = await apiBlogsPOST()
        let blogID2 = await apiBlogsPOST()
        expect(blogID2.payload).toBe(blogID1.payload + 1)
    })
})
