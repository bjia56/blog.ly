/**
 * @jest-environment node
 */

import { apiFollowDELETE, apiFollowGET } from '../../../../services/FollowService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

describe('follow DELETE handler tests', () => {
    test('delete follow record when not logged in returns error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiFollowDELETE({ uuid: 200 })).rejects.toEqual({
            code: 401,
            error: 'Unauthorized',
        })
    })

    test('delete follow record when there are no follow records returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(
            apiFollowDELETE({ user: 200 }, { uuid: 1 })
        ).rejects.toEqual({
            code: 404,
            error: 'Follow record not found',
        })
    })

    test('delete follow record with valid uuid ', async () => {
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
            db.Follow.build({ id: 100, follower: 1, followee: 2 })
        ])

        var data0 = await apiFollowGET(null, { uuid: 1 })
        expect(data0.payload.following.length).toBe(1)
        expect(data0.payload.following.includes(2)).toBeTruthy()

        var data = await apiFollowDELETE({ user: 2 }, { uuid: 1 })
        expect(data.payload).toBe(null)
        expect(data.code).toBe(200)

        var data2 = await apiFollowGET(null, { uuid: 1 })
        expect(data2.payload.following.length).toBe(0)
        expect(data2.payload.following.includes(2)).toBeFalsy()
    })
})