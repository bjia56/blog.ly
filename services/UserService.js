const Service = require('./Service')
const Database = require('../sql')

const User = Database.User

const phoneRegex = /^\+[1-9]\d{1,14}$/g

function requireAuthenticated(loggedInUser) {
    if (loggedInUser == null || loggedInUser.uuid == null) {
        throw {
            message: 'Unauthorized',
            status: 401,
        }
    }
}

/**
 * Get user information
 *
 * user Integer User uuid.
 * returns User
 * */
const apiUserGET = ({ user }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            var isLoggedIn = false
            if (user == null) {
                requireAuthenticated(loggedInUser)
                user = loggedInUser.uuid
                isLoggedIn = true
            }

            var users = await User.findAll({ where: { uuid: user } })
            if (users.length == 0) {
                throw {
                    message: 'User not found',
                    status: 404,
                }
            }

            user = users[0]
            if (user.description == null) {
                user.description = ''
            }

            var response = {
                uuid: user.uuid,
                email: user.email,
                name: user.name,
                description: user.description,
                notificationPreference: user.notificationPreference,
            }

            if (
                isLoggedIn &&
                user.uuid == loggedInUser.uuid &&
                user.phone != null
            ) {
                response.phone = user.phone
            }

            resolve(Service.successResponse(response))
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })
/**
 * Update user information
 * This can only be done by users who have logged in.
 *
 * body New user information
 * no response value expected for this operation
 * */
const apiUserPUT = ({ body }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var users = await User.findAll({
                where: { uuid: loggedInUser.uuid },
            })

            var user = users[0]

            if (body.name != null) {
                user.name = body.name
            }
            if (body.description != null) {
                user.description = body.description
            }
            if (body.notificationPreference != null) {
                user.notificationPreference = body.notificationPreference
            }
            if (body.phone != null) {
                if (body.phone.match(phoneRegex) != null) {
                    user.phone = body.phone
                } else {
                    throw {
                        message: 'Invalid phone number format',
                        status: 403,
                    }
                }
            }

            await user.save()

            resolve(Service.successResponse())
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })

module.exports = {
    apiUserGET,
    apiUserPUT,
}
