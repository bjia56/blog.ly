/**
 * @jest-environment node
 */

import { apiUserPUT, apiUserGET } from '../../../../services/UserService.js'
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
        expect(data.payload).toBe(undefined)

        data = await apiUserGET({ user: 1 })
        expect(data.code).toBe(200)
        expect(data.payload).toHaveProperty('name', 'John J Doe')
    })

    test('update user description', async () => {
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
                    description: 'I am a programmer',
                },
            },
            { uuid: 1 }
        )
        expect(data.code).toBe(200)
        expect(data.payload).toBe(undefined)

        data = await apiUserGET({ user: 1 })
        expect(data.code).toBe(200)
        expect(data.payload).toHaveProperty('description', 'I am a programmer')
    })

    test('update notification preference', async () => {
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
                    notificationPreference: 'daily',
                },
            },
            { uuid: 1 }
        )
        expect(data.code).toBe(200)
        expect(data.payload).toBe(undefined)

        data = await apiUserGET({ user: 1 })
        expect(data.code).toBe(200)
        expect(data.payload).toHaveProperty('notificationPreference', 'daily')
    })

    test('update phone', async () => {
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
                    phone: '+11234567890',
                },
            },
            { uuid: 1 }
        )
        expect(data.code).toBe(200)
        expect(data.payload).toBe(undefined)

        data = await apiUserGET({}, { uuid: 1 })
        expect(data.code).toBe(200)
        expect(data.payload).toHaveProperty('phone', '+11234567890')
    })

    test('invalid phone returns error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: 'hourly',
            }),
        ])
        await expect(
            apiUserPUT(
                {
                    body: {
                        phone: 'foo',
                    },
                },
                { uuid: 1 }
            )
        ).rejects.toEqual({
            error: 'Invalid phone number format',
            code: 403,
        })
    })
})
