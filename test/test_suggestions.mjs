import assert from 'assert'

import fetch from 'isomorphic-fetch'
import fetch_mock from 'fetch-mock'

import uds from '../src/suggestions/urbandictionary.mjs'

suite('suggestions', function() {
    setup(function() {
	fetch_mock.get('*', {
	    "results": [{
		"term": "u",
		"preview": "123>"
	    }]
	})
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
