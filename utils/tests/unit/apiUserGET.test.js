import { apiUserGET } from '../../../services/UserService.js'
import 'regenerator-runtime/runtime'

const dbHelper = require('./dbHelper')
const db = require('../../../sql')

describe('user GET handler tests', () => {
    test('invalid user returns reject error', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: '',
            }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        await expect(apiUserGET({ user: 4 })).rejects.toEqual({
            code: 405,
            error: 'User not found',
        })
    })

    test('empty database returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiUserGET({ user: 4 })).rejects.toEqual({
            code: 405,
            error: 'User not found',
        })
    })

    test('put blog with invalid input returns reject error', async () => {
        await dbHelper.populateDatabase([])

        await expect(apiUserGET({})).rejects.toEqual({
            code: 405,
            error: 'WHERE parameter "uuid" has invalid "undefined" value',
        })
    })

    test('valid user returns correct user object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: 'hourly',
            }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        var data = await apiUserGET({ user: 1 })
        expect(data.code).toBe(200)
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(1)
        expect('username' in data.payload)
        expect(typeof data.payload.username).toBe('string')
        expect(data.payload.username).toBe('jdoe')
        expect('name' in data.payload)
        expect(typeof data.payload.name).toBe('string')
        expect(data.payload.name).toBe('John Doe')
        expect('description' in data.payload)
        expect(typeof data.payload.description).toBe('string')
        expect(data.payload.description).toBe('')
        expect('notificationPreference' in data.payload)
        expect(typeof data.payload.notificationPreference).toBe('string')
        expect(data.payload.notificationPreference).toBe('hourly')
    })

    test('valid user description given returns correct user object', async () => {
        await dbHelper.populateDatabase([
            db.User.build({
                uuid: 1,
                username: 'jdoe',
                passwordHash: '',
                name: 'John Doe',
                notificationPreference: 'hourly',
                description:
                    'I am studying computer science at Columnia University and I love intricate algorithms!',
            }),
            db.User.build({
                uuid: 2,
                username: 'jsmith',
                passwordHash: '',
                name: 'John Smith',
                notificationPreference: '',
            }),
        ])

        var data = await apiUserGET({ user: 1 })
        expect(data.code).toBe(200)
        expect(typeof data.payload).toBe('object')
        expect('uuid' in data.payload)
        expect(typeof data.payload.uuid).toBe('number')
        expect(data.payload.uuid).toBe(1)
        expect('username' in data.payload)
        expect(typeof data.payload.username).toBe('string')
        expect(data.payload.username).toBe('jdoe')
        expect('name' in data.payload)
        expect(typeof data.payload.name).toBe('string')
        expect(data.payload.name).toBe('John Doe')
        expect('description' in data.payload)
        expect(typeof data.payload.description).toBe('string')
        expect(data.payload.description).toBe(
            'I am studying computer science at Columnia University and I love intricate algorithms!'
        )
        expect('notificationPreference' in data.payload)
        expect(typeof data.payload.notificationPreference).toBe('string')
        expect(data.payload.notificationPreference).toBe('hourly')
    })
})

afterAll(async (done) => {
    // close db after completion
    db.close()
    done()
})
