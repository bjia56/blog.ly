/* eslint-disable no-unused-vars */
const Service = require('./Service')

/**
 * Search for blogs
 *
 * keyword String Keyword(s) to search for
 * cursor String Cursor token for paging the blogs returned. (optional)
 * limit Integer Maximum number of results to return in a page. (optional)
 * returns List
 * */
const apiSearchGET = ({ keyword, cursor, limit }) =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                Service.successResponse({
                    keyword,
                    cursor,
                    limit,
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
    apiSearchGET,
}
