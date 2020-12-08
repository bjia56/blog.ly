jest.mock('twilio')

const twilio = require('twilio')
const { sendNotifications } = require('../../../../util/twilio')

const dbHelper = require('../../dbHelper')
const db = require('../../../../sql')

describe('twilio util tests', () => {
    test('sends notification to valid follower', async () => {
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
                phone: '+11234567890',
            }),
            db.Follow.build({ follower: 2, followee: 1 }),
        ])

        var textsSent = []
        twilio.mockReturnValue({
            messages: {
                create: (text) => {
                    textsSent.push(text)
                    return {
                        then: (f) => f({ sid: 'some message ID' }),
                    }
                },
            },
        })

        await sendNotifications({ uuid: 1 })
        expect(twilio).toHaveBeenCalledTimes(1)
        expect(textsSent.length).toBe(1)
        expect(textsSent[0].to).toBe('+11234567890')
    })

    test('sends notification to valid follower without phone number', async () => {
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
            db.Follow.build({ follower: 2, followee: 1 }),
        ])

        var textsSent = []
        twilio.mockReturnValue({
            messages: {
                create: (text) => {
                    textsSent.push(text)
                    return {
                        then: (f) => f({ sid: 'some message ID' }),
                    }
                },
            },
        })

        await sendNotifications({ uuid: 1 })
        expect(twilio).toHaveBeenCalledTimes(1)
        expect(textsSent.length).toBe(0)
    })
})
