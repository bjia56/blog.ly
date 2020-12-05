/**
 * @jest-environment node
 */

const passport = require('passport')
const oauth20 = require('../../../oauth20')

describe('oauth20 tests', () => {
    test('oauth20 is a passport module', () => {
        expect(oauth20).toBe(passport)
    })
})
