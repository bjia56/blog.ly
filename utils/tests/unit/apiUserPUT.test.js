import { apiUserPUT } from '../../../services/UserService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('./dbHelper')
const db = require('../../../sql')

describe('user PUT handler tests', () => {
    test('dummy test', async () => {
        let data = await apiUserPUT({
            uNKNOWNUnderscoreBASEUnderscoreTYPE: 'abc123',
        })
        expect(data.code).toBe(200)
        expect(typeof data.payload).toBe('object')
        expect('uNKNOWNUnderscoreBASEUnderscoreTYPE' in data.payload)
    })
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
