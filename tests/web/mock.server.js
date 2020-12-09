const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)

module.exports = {
    mock,
    reset: (arg) => {
        let newMock = arg || mock
        newMock
            .onGet('/api/user?user=2')
            .reply(200, {
                uuid: 2,
                email: 'user2@example.com',
                name: 'Test User 2',
                description: 'asdf',
                notificationPreference: 'asdf',
            })
            .onGet('/api/user?user=3')
            .reply(200, {
                uuid: 3,
                email: 'user3@example.com',
                name: 'Test User 3',
                description: 'asdf',
                notificationPreference: 'asdf',
            })
            .onGet('/api/user')
            .reply(200, {
                uuid: 1,
                email: 'user1@example.com',
                name: 'Test User 1',
                description: 'asdf',
                notificationPreference: 'asdf',
            })
            .onGet('/api/blogs/1')
            .reply(200, {
                uuid: 1,
                title: 'title1',
                contents: 'contents1',
                rendered: 'contents',
                created: 0,
                updated: 0,
                author: 1,
                authorName: 'Test User 1',
            })
            .onGet(/\/api\/blogs\?.*/)
            .reply(200, {
                uuids: [1],
            })
            .onGet('/api/follow')
            .reply(200, {
                following: [2],
                followers: [3],
            })
            .onPost('/api/blogs')
            .reply(200, {
                uuid: 4,
            })
            .onPut('/api/user')
            .reply(200, {})
    },
}
