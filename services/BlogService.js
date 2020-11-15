/* eslint-disable no-unused-vars */
const Service = require('./Service')

/**
 * Get a list of blogs
 *
 * author Integer Fetch blogs by author uuid. (optional)
 * cursor String Cursor token for paging the blogs returned. (optional)
 * limit Integer Maximum number of results to return in a page. (optional)
 * returns List
 * */
const apiBlogsGET = ({ author, cursor, limit }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(Service.successResponse([1, 10, 100]))
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
 * Create a new blog
 * This can only be done by users who have logged in.
 *
 * returns Integer
 * */
const apiBlogsPOST = () =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(Service.successResponse({}))
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
 * Delete an existing blog
 * This can only be done by users who have logged in and on blogs that the user has authored.
 *
 * uuid Integer Blog uuid.
 * no response value expected for this operation
 * */
const apiBlogsUuidDELETE = ({ uuid }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    uuid,
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
 * Get blog details
 *
 * uuid Integer Blog uuid.
 * returns Blog
 * */
const apiBlogsUuidGET = ({ uuid }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    uuid,
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
 * Update an existing blog
 * This can only be done by users who have logged in and on blogs that the user has authored.
 *
 * uuid Integer Blog uuid.
 * uNKNOWNUnderscoreBASEUnderscoreTYPE UNKNOWN_BASE_TYPE New blog contents
 * no response value expected for this operation
 * */
const apiBlogsUuidPUT = ({ uuid, uNKNOWNUnderscoreBASEUnderscoreTYPE }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    uuid,
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
    apiBlogsGET,
    apiBlogsPOST,
    apiBlogsUuidDELETE,
    apiBlogsUuidGET,
    apiBlogsUuidPUT,
}
