/**
 * @jest-environment node
 */

const index = require('../../../index')

describe('index tests', () => {
    test('index server is started', async () => {
        await expect(index).resolves.toHaveProperty('started', true)
    })
})

afterAll((done) => {
    index.then(async (state) => {
        await state.expressServer.close()
        done()
    })
})
