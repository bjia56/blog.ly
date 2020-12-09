import React from 'react'
import {
    cleanup,
    waitFor,
    render,
    screen,
    fireEvent,
} from '@testing-library/react'
import User from '../../web/src/User'
import { HashRouter as Router } from 'react-router-dom'

const sleep = (m) => new Promise((r) => setTimeout(r, m))

const config = require('../../config')
const { mock } = require('./mock.server')

beforeAll(async (done) => {
    done()
})

afterEach(cleanup)

const props = {
    match: {
        params: {
            id: 2,
        },
    },
}

it('fetchProfileData-following-success', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
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
    render(
        <Router>
            <User {...props} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.getAllByText(/Test User 1/g)).toBeTruthy()
})

it('fetchProfileData-not-following-success', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
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
            following: [],
            followers: [3],
        })
    render(
        <Router>
            <User {...props} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.getAllByText(/Test User 1/g)).toBeTruthy()
})

it('fetchProfileData-failure', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
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
        .reply(404, {
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
    mock.reset()
    render(
        <Router>
            <User {...props} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.getAllByText(/Oops/g)).toBeTruthy()
})

it('fetchFollowData-failure', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
        .reply(200, {
            uuid: 2,
            email: 'user2@example.com',
            name: 'Test User 2',
            description: 'asdf',
            notificationPreference: 'asdf',
        })
        .onGet('/api/user?user=3')
        .reply(404, {
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
        .reply(404, {
            following: [2],
            followers: [3],
        })
    render(
        <Router>
            <User {...props} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.queryByText(/Oops/g)).toBeTruthy()
})

it('fetchArticleData-failure', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
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
        .reply(404)
        .onGet('/api/follow')
        .reply(200, {
            following: [2],
            followers: [3],
        })
    render(
        <Router>
            <User {...props} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.queryByText(/Oops/g)).toBeTruthy()
})

it('onFollow', async () => {
    const counter = {
        followed: false,
    }
    mock.reset()
    mock.onGet('/api/user?user=2')
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
            author: 2,
            authorName: 'Test User 1',
        })
        .onGet(/\/api\/blogs\?.*/)
        .reply(200, {
            uuids: [1],
        })
        .onGet('/api/follow')
        .reply(200, {
            following: [],
            followers: [],
        })

    render(
        <Router>
            <User {...props} />
        </Router>
    )

    await waitFor(() => screen.queryByText(/Follow/))
    fireEvent.click(screen.getByText(/Follow/))

    mock.reset()
    mock.onPost('/api/follow?user=2').reply(404)

    await waitFor(() => screen.queryByText(/Oops/g))

    mock.reset()
    mock.onPost('/api/follow?user=2').reply(200, () => {
        counter.followed = true
    })

    await waitFor(() => screen.queryByText(/Follow/))
    fireEvent.click(screen.getByText(/Follow/))
    await waitFor(() => counter.followed)

    mock.reset()
    mock.onDelete('/api/follow?user=2').reply(404)

    fireEvent.click(screen.getByText(/Unfollow/))
    await waitFor(() => screen.queryByText(/Oops/g))

    mock.reset()
    mock.onDelete('/api/follow?user=2').reply(200, () => {
        counter.followed = false
    })
    fireEvent.click(screen.getByText(/Unfollow/))
    await waitFor(() => !counter.followed)
})
