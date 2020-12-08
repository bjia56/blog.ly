/**
 * @jest-environment node
 */

import { apiSearchGET } from '../../../../services/SearchService.js'
import 'regenerator-runtime/runtime'

describe('search GET handler tests', () => {
    test('dummy test', async () => {
        await apiSearchGET({})
    })
})
