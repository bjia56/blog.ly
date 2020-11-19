import { apiUserPUT } from '../../../services/UserService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('./dbHelper')
const db = require('../../../sql')

describe('user PUT handler tests', () => {
    test('dummy in place test', () => {
        expect(1 + 1).toBe(2)
    })
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
