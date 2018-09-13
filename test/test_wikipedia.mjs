import assert from 'assert'

import 'isomorphic-fetch'
import fetch_mock from 'fetch-mock'

import uds from '../src/suggestions/wikipedia.mjs'

suite('wikipedia', function() {
    setup(function() {
	fetch_mock.get('*', [
	    "u",
	    [ "u" ],
	    [ "123>" ],
	    [ "https://u" ],
	])
    })
    teardown(function() {
	fetch_mock.restore()
    })

    test('smoke', async function() {
	let r = await uds('u')
	assert.deepEqual(r, [
	    { content: 'u',
	      description: '<match>u</match><dim> - 123&gt;</dim>'
	    }
	])
    })

    test('empty input', async function() {
	let r = await uds('')
	assert.deepEqual(r, [])
    })

    test('invalid responce object', async function() {
	fetch_mock.get('*', {}, {overwriteRoutes: true})
	let r = await uds('u')
	assert.deepEqual(r, [])

	fetch_mock.get('*', [1,2,3], {overwriteRoutes: true})
	r = await uds('u')
	assert.deepEqual(r, [])
    })
})
