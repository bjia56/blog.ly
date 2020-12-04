const config = require('./config')
const logger = require('./logger')
const ExpressServer = require('./expressServer')

const launchServer = async () => {
    var state = {
        started: false,
        expressServer: null,
    }

    try {
        state.expressServer = new ExpressServer(
            config.URL_PORT,
            config.OPENAPI_YAML
        )
        await state.expressServer.launch()
        logger.info('Express server running')
        state.started = true
    } catch (error) {
        console.log(error)
        logger.error('Express Server failure: ' + error.message)
        await state.expressServer.close()
    }

    return state
}

module.exports = launchServer().catch((e) => logger.error(e))
