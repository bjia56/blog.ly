import React from 'react'
import {
    cleanup,
    waitFor,
    render,
    screen,
    fireEvent,
} from '@testing-library/react'
import { HashRouter as Router } from 'react-router-dom'
import App from '../../web/src/App'
import { createHashHistory } from 'history'

const sleep = (m) => new Promise((r) => setTimeout(r, m))

const config = require('../../config')
const { mock, reset } = require('./mock.server')

beforeAll(async (done) => {
    done()
})

afterEach(cleanup)

it('App-loggedIn', async () => {
    const history = createHashHistory()

    render(<App />)
    await waitFor(() => screen.queryAllByText(/Start exploring/))

    history.push('/profile')
    render(<App history={history} />)
    await waitFor(() => screen.getAllByRole('heading'))

    history.push('/articles')
    render(<App history={history} />)
    await waitFor(() => screen.getAllByRole('heading'))

    history.push('/edit/1')
    render(<App history={history} />)
    await waitFor(() => screen.getAllByRole('heading'))

    history.push('/user/1')
    render(<App history={history} />)
    await waitFor(() => screen.getAllByRole('heading'))
})

it('App-not-loggedIn', async () => {
    mock.reset()
    mock.onGet('/api/user').reply(404)
    render(<App />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    mock.reset()
    mock.onGet('/api/user').reply(401)
    render(<App />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    const history = createHashHistory()
    history.push('/profile')
    render(<App history={history} />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    history.push('/articles')
    render(<App history={history} />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    history.push('/edit/1')
    render(<App history={history} />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    history.push('/user/1')
    render(<App history={history} />)
    await waitFor(() => screen.queryAllByText(/Login with/))

    const alertMock = jest.spyOn(window, 'alert')
    fireEvent.click(screen.getAllByTestId('login')[0])
    await waitFor(() => alertMock.mock.calls.length == 1)
})
