/**
 * The BlogController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller')
const service = require('../services/BlogService')
const apiBlogsGET = async (request, response) => {
    await Controller.handleRequest(request, response, service.apiBlogsGET)
}

const apiBlogsPOST = async (request, response) => {
    await Controller.handleRequest(request, response, service.apiBlogsPOST)
}

const apiBlogsUuidDELETE = async (request, response) => {
    await Controller.handleRequest(
        request,
        response,
        service.apiBlogsUuidDELETE
    )
}

const apiBlogsUuidGET = async (request, response) => {
    await Controller.handleRequest(request, response, service.apiBlogsUuidGET)
}

const apiBlogsUuidPUT = async (request, response) => {
    await Controller.handleRequest(request, response, service.apiBlogsUuidPUT)
}

module.exports = {
    apiBlogsGET,
    apiBlogsPOST,
    apiBlogsUuidDELETE,
    apiBlogsUuidGET,
    apiBlogsUuidPUT,
}
