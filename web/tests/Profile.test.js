import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Profile from '../src/Profile'

var axios = require('axios')
var MockAdapter = require('axios-mock-adapter')

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios)

mock.onGet('/user').reply(200, {
    users: [
        {
            uuid: 1,
            username: 'testTest',
            name: 'Test Test',
            description: 'My Description',
            notificationPreference: '__test_notification__',
        },
    ],
})

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

it('Profile fetches data correctly', () => {
    const { queryAllByText } = render(<Profile />)
    expect(queryAllByText(/Test Test/g)).toBeTruthy()
    expect(queryAllByText(/My Description/g)).toBeTruthy()
    expect(queryAllByText(/__test_notification__/g)).toBeTruthy()
})
