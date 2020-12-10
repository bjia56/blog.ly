import React from 'react'
import {
    cleanup,
    waitFor,
    render,
    screen,
    fireEvent,
} from '@testing-library/react'
import Profile from '../../web/src/Profile'
import { HashRouter as Router } from 'react-router-dom'

const sleep = (m) => new Promise((r) => setTimeout(r, m))

const config = require('../../config')
const { mock, reset } = require('./mock.server')

beforeAll(async (done) => {
    done()
})

afterEach(cleanup)

it('fetchProfileData-success', async () => {
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
            <Profile />
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
        .reply(404)
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
            <Profile />
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
        .reply(200, {
            following: [2],
            followers: [3],
        })
    render(
        <Router>
            <Profile />
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
            <Profile />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)
    expect(screen.queryByText(/Oops/g)).toBeTruthy()
})

it('updateProfile', async () => {
    reset()

    render(
        <Router>
            <Profile history={{ push: () => {} }} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)

    let input = screen.getByTestId('input-name')
    expect(input).toBeTruthy()

    fireEvent.change(input, { target: { value: 'Test Changed' } })
    await waitFor(() => screen.queryAllByText(/Test Changed/))

    input = screen.getByTestId('input-phone')
    expect(input).toBeTruthy()

    fireEvent.change(input, { target: { value: '+17735378605' } })
    await waitFor(() => screen.queryAllByText(/7735378605/))

    input = screen.getByTestId('input-phone')
    expect(input).toBeTruthy()

    const alertMock = jest.spyOn(window, 'alert')

    fireEvent.change(input, { target: { value: '773537860' } })
    await waitFor(() => screen.queryAllByText(/7735378605/))
    expect(alertMock).toHaveBeenCalledTimes(1)
})

it('newArticile', async () => {
    reset()
    jest.spyOn(window, 'alert')

    const counter = { clicked: false }
    const mockPush = jest.fn((route) => {
        if (route == '/edit/4') {
            counter.clicked = true
        }
    })

    render(
        <Router>
            <Profile history={{ push: mockPush }} />
        </Router>
    )
    await waitFor(() => screen.getAllByRole('heading'))
    await sleep(3000)

    fireEvent.click(screen.getByText('New'))
    await waitFor(() => counter.clicked)

    mock.reset()
    mock.onPost('/api/blogs').reply(404)

    fireEvent.click(screen.getByText('New'))
    await waitFor(() => screen.queryByText(/Oops/g))
})
