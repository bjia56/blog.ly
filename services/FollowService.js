/* eslint-disable no-unused-vars */
const Service = require('./Service')

function requireAuthenticated(loggedInUser) {
    if (loggedInUser == null || loggedInUser.uuid == null) {
        throw {
            message: 'Unauthorized',
            status: 401,
        }
    }
}

/**
 * Delete a follow entry
 * This can only be done by users who have logged in.
 *
 * user Integer User uuid.
 * no response value expected for this operation
 * */
const apiFollowDELETE = ({ user }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var followRecords = await Follow.findAll({ where: { follower: user, followee: loggedInUser.uuid } })
            if (followRecords.length == 0) {
                throw {
                    message: 'Follow record not found',
                    status: 404,
                }
            }

            var followRecord = followRecords[0]
            if (followRecord.follower !== loggedInUser.uuid) {
                throw {
                    message: 'Unauthorized',
                    status: 403,
                }
            }

            await followRecord.destroy()
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
 * Add a follow entry
 * This can only be done by users who have logged in.
 *
 * user Integer User uuid.
 * no response value expected for this operation
 * */
const apiFollowPOST = ({ user }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var followRecord = await Follow.create({
                follower: user,
                followee: loggedInUser.uuid
            })
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

module.exports = {
    apiFollowDELETE,
    apiFollowPOST,
}
