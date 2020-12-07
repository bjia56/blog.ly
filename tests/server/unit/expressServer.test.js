/**
 * @jest-environment node
 */

const ExpressServer = require('../../../expressServer')

describe('expressServer tests', () => {
    test('calling close() on un-launched server gives no error', async () => {
        await new ExpressServer().close()
    })
})
