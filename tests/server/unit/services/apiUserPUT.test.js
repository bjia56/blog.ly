/**
 * @jest-environment node
 */

import { apiUserPUT } from '../../../../services/UserService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

describe('user PUT handler tests', () => {
    test('update user name', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: 'hourly',
            }),
        ])
        let data = await apiUserPUT(
            {
                body: {
                    name: 'John J Doe',
                },
            },
            { uuid: 1 }
        )
        expect(data.code).toBe(200)
        expect(data.payload).toBe(null)
    })
})

afterAll(async (done) => {
    // close db after completion
    await db.close()
    done()
})
