/**
 * @jest-environment node
 */

import { apiFollowGET } from '../../../../services/FollowService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

//helper function to create pause between each entry
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('follow posts GET handler tests', () => {
    test('get follow records when not logged in returns error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiFollowGET(null)).rejects.toEqual({
            code: 401,
            error: 'Unauthorized',
        })
    })
    test('get all follow records with with multiple follow records returns a list of ids', async () => {
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
            db.User.build({
                uuid: 3,
                email: 'sjohnson@example.com',
                name: 'Steve Johnson',
                notificationPreference: '',
            }),
            db.Follow.build({ id: 100, follower: 1, followee: 2 }),
            db.Follow.build({ id: 101, follower: 1, followee: 3 }),
            db.Follow.build({ id: 102, follower: 2, followee: 1 }),
        ])

        var data = await apiFollowGET(null, { uuid: 1 })
        expect(typeof data.payload).toBe('object')
        expect('following' in data.payload)
        expect(data.payload.following.length).toBe(2)
        expect('followers' in data.payload)
        expect(data.payload.followers.length).toBe(1)
        expect(data.code).toBe(200)
    })
})
