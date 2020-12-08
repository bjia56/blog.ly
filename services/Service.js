class Service {
    static rejectResponse(error) {
        if (error.status != null) {
            return {
                error: error.message,
                code: error.status,
            }
        } else {
            return {
                error: 'Internal server error',
                code: 500,
            }
        }
    }

    static successResponse(payload, code = 200) {
        return { payload, code }
    }
}

module.exports = Service
