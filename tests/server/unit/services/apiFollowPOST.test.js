/**
 * @jest-environment node
 */

import {
    apiFollowPOST,
    apiFollowGET,
} from '../../../../services/FollowService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('follow POST handler tests', () => {
    test('create follow record when not logged in returns error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiFollowPOST({ uuid: 200 })).rejects.toEqual({
            code: 401,
            error: 'Unauthorized',
        })
    })

    test('create follow record cannot follow self returns error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
        ])

        await expect(apiFollowPOST({ user: 1 }, { uuid: 1 })).rejects.toEqual({
            code: 403,
            error: 'Cannot follow self',
        })
    })

    test('create follow record when user not found returns error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                email: 'jdoe@example.com',
                name: 'John Doe',
                notificationPreference: '',
            }),
        ])

        await expect(apiFollowPOST({ user: 2 }, { uuid: 1 })).rejects.toEqual({
            code: 404,
            error: 'User not found',
        })
    })

    test('create follow record with valid uuids', async () => {
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
        ])

        await expect(apiFollowPOST({ user: 2 }, { uuid: 1 }))
        await delay(1000)
        var data = await apiFollowGET(null, { uuid: 1 })
        expect(typeof data.payload).toBe('object')
        expect('following' in data.payload)

        expect(data.payload.following.length).toBe(1)
        expect(data.payload.following.includes(2)).toBeTruthy()
        expect('followers' in data.payload)
        expect(data.payload.followers.length).toBe(0)
        expect(data.code).toBe(200)
    })
})
