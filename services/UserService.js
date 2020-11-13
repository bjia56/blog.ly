/* eslint-disable no-unused-vars */
const Service = require('./Service')

/**
 * Get user information
 *
 * user Integer User uuid.
 * returns User
 * */
const apiUserGET = ({ user }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    user,
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
