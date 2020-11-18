const Service = require('./Service')
const Database = require('../sql')

const User = Database.User

/**
 * Get user information
 *
 * user Integer User uuid.
 * returns User
 * */
const apiUserGET = ({ user }) =>
    new Promise(async (resolve, reject) => {
        try {
            var users = await User.findAll({ where: { uuid: user } })
            if (users.length == 0) {
                throw {
                    message: 'User not found',
                }
            }

            user = users[0]
            if (user.description === null) {
                user.description = ''
            }

            resolve(
                Service.successResponse({
                    uuid: user.uuid,
                    username: user.username,
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
 * uNKNOWNUnderscoreBASEUnderscoreTYPE UNKNOWN_BASE_TYPE New user information
 * no response value expected for this operation
 * */
const apiUserPUT = ({ uNKNOWNUnderscoreBASEUnderscoreTYPE }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    uNKNOWNUnderscoreBASEUnderscoreTYPE,
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

module.exports = {
    apiUserGET,
    apiUserPUT,
}
