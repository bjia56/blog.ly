import React from 'react'
import {
    cleanup,
    waitFor,
    render,
    screen,
    fireEvent,
} from '@testing-library/react'
import Edit from '../../web/src/Edit'
import { HashRouter as Router } from 'react-router-dom'

const sleep = (m) => new Promise((r) => setTimeout(r, m))

const config = require('../../config')
const { mock } = require('./mock.server')

const params = {
    match: { params: { id: 1 } },
}

beforeAll(async (done) => {
    global.alert = jest.fn()
    global.confirm = () => true
    done()
})

afterEach(cleanup)

it('Edit-load', async () => {
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
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
})

it('Edit-submit-success', async () => {
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
        .onPut('/api/blogs/1')
        .reply(200)
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    fireEvent.click(screen.getByText('Submit'))
    const alertMock = jest.spyOn(window, 'alert')
    await sleep(1000)
    expect(alertMock).toHaveBeenCalledTimes(1)
})

it('Edit-submit-failure', async () => {
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
        .onPut('/api/blogs/1')
        .reply(404)
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    fireEvent.click(screen.getByText('Submit'))
    const alertMock = jest.spyOn(window, 'alert')
    await sleep(1000)
    expect(alertMock).toHaveBeenCalledTimes(0)
})

it('Edit-delete-success', async () => {
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
        .onDelete('/api/blogs/1')
        .reply(200)
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    fireEvent.click(screen.getByText('Delete'))
    const alertMock = jest.spyOn(window, 'alert')
    await sleep(1000)
    expect(alertMock).toHaveBeenCalledTimes(1)
})

it('Edit-delete-failure', async () => {
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
        .onDelete('/api/blogs/1')
        .reply(404)
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    fireEvent.click(screen.getByText('Delete'))
    const alertMock = jest.spyOn(window, 'alert')
    await sleep(1000)
    expect(alertMock).toHaveBeenCalledTimes(0)
})

it('Edit-dont-delete', async () => {
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )

    window.confirm = () => false
    await waitFor(() => screen.getAllByRole('heading'))
    fireEvent.click(screen.getByText('Delete'))
    const alertMock = jest.spyOn(window, 'alert')
    await sleep(1000)
    expect(alertMock).toHaveBeenCalledTimes(0)
})

it('Edit-modify', async () => {
    render(
        <Router>
            <Edit {...params} />
        </Router>
    )
    await waitFor(() => screen.queryByPlaceholderText('Enter your title'))
    fireEvent.change(screen.getByPlaceholderText('Enter your title'), {
        target: { value: 'New Title' },
    })
    await waitFor(() => screen.queryAllByText(/New Title/))
})

it('Edit-cancel', async () => {
    const counter = { clicked: false }
    const mockPush = jest.fn((route) => {
        if (route == '/articles') {
            counter.clicked = true
        }
    })

    render(
        <Router>
            <Edit {...params} history={{ push: mockPush }} />
        </Router>
    )
    await waitFor(() => screen.queryByPlaceholderText('Enter your title'))

    fireEvent.click(screen.getByText('Cancel'))
    await waitFor(() => counter.clicked)
})

it('Edit-no-privilege', async () => {
    mock.reset()
    mock.onGet('/api/user?user=2')
        .reply(200, {
            uuid: 1,
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
            following: [2],
            followers: [3],
        })
        .onDelete('/api/blogs/1')
        .reply(404)

    const counter = { clicked: false }
    const mockPush = jest.fn((route) => {
        if (route == '/articles') {
            counter.clicked = true
        }
    })

    render(
        <Router>
            <Edit {...params} history={{ push: mockPush }} />
        </Router>
    )

    const alertMock = jest.spyOn(window, 'alert')

    await waitFor(() => alertMock.mock.calls.length > 0 && counter.clicked)
})
