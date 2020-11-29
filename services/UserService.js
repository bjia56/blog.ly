const Service = require('./Service')
const Database = require('../sql')

const User = Database.User

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
            if (user == null) {
                requireAuthenticated(loggedInUser)
                user = loggedInUser.uuid
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

            resolve(
                Service.successResponse({
                    uuid: user.uuid,
                    email: user.email,
                    name: user.name,
                    description: user.description,
                    notificationPreference: user.notificationPreference,
                })
            )
        } catch (e) {
            reject(
                Service.rejectResponse(
                    e.message || 'Invalid input',
                    e.status || 405
                )
            )
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
            if (users.length == 0) {
                throw {
                    message: 'User not found',
                    status: 404,
                }
            }

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

            resolve(Service.successResponse(null))
        } catch (e) {
            reject(
                Service.rejectResponse(
                    e.message || 'Invalid input',
                    e.status || 405
                )
            )
        }
    })

module.exports = {
    apiUserGET,
    apiUserPUT,
}
