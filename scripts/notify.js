const Database = require('../sql')

const NotificationQueue = Database.NotificationQueue
const User = Database.User

const HOUR_IN_MILLISECONDS = 1000 * 60 * 60
const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS

async function fireNotification(text) {}

async function notifyAll() {
    var now = new Date()

    var users = await User.findAll()
    var notifications = await NotificationQueue.findAll()

    var userMap = (() => {
        var result = {}
        users.forEach((user) => (result[user.uuid] = user))
        return result
    })()

    var notificationMap = (() => {
        var result = {}
        notifications.forEach((notification) => {
            if (notification.follower in result) {
                result[notification.follower].push(notification)
            } else {
                result[notification.follower] = [notification]
            }
        })
        return result
    })()

    var usersToNotify = (() => {
        var result = {}
        users.forEach((user) => {
            if (!(user.uuid in notificationMap)) {
                return
            }

            if (
                user.notificationPreference == 'hourly' &&
                now - user.lastNotified < HOUR_IN_MILLISECONDS
            ) {
                return
            }

            if (
                user.notificationPreference == 'daily' &&
                now - user.lastNotified < DAY_IN_MILLISECONDS
            ) {
                return
            }

            result[user.uuid] = notificationMap[user.uuid]
        })
        return result
    })()

    usersToNotify.forEach((notifications, uuid) => {
        var authors = notifications.map(
            (notification) => userMap[notification.uuid].name
        )
        var text =
            'Hello, new blog posts from ' +
            authors.join(', ') +
            ' have been posted and are ready for you to read.'

        fireNotification(text)

        notifications.forEach((notification) => notification.destroy())
    })
}

notifyAll()
