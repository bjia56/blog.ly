const { Client, Init, TearDown } = require('../../elastic')

beforeAll(async (done) => {
    TearDown()
        .then(() => {
            done()
        })
        .catch((e) => {
            done()
        })
})

it('Elastic-create', async () => {
    expect(Client).toBeTruthy()

    await Init()
    let index = await Client.indices.get({ index: 'blogs' })
    expect(index.statusCode).toBe(200)

    await TearDown()
    const exists = await Client.indices.exists({ index: 'blogs' }).body
    expect(exists).toBeFalsy()
})
