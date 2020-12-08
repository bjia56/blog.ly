const logger = require('../logger')

class Controller {
    static sendResponse(response, payload) {
        response.status(payload.code)
        const responsePayload = payload.payload
        if (responsePayload == null) {
            response.end(responsePayload)
        } else {
            response.json(responsePayload)
        }
    }

    static sendError(response, error) {
        response.status(error.code)
        response.end(error.error)
    }

    static collectRequestParams(request) {
        const requestParams = {}
        if (request.openapi.schema.requestBody !== undefined) {
            requestParams.body = request.body
        }

        if (request.openapi.schema.parameters !== undefined) {
            request.openapi.schema.parameters.forEach((param) => {
                // We assume parameters are only path-based or query-based.
                // This will need to be modified if we want to support
                // header parameters
                if (param.in === 'path') {
                    requestParams[param.name] =
                        request.openapi.pathParams[param.name]
                } else {
                    requestParams[param.name] = request.query[param.name]
                }
            })
        }
        return requestParams
    }

    static async handleRequest(request, response, serviceOperation) {
        try {
            const serviceResponse = await serviceOperation(
                this.collectRequestParams(request),
                request.user
            )
            Controller.sendResponse(response, serviceResponse)
        } catch (error) {
            logger.warn(error)
            Controller.sendError(response, error)
        }
    }
}

module.exports = Controller
