import assert from 'assert'

import fetch from 'isomorphic-fetch'
import fetch_mock from 'fetch-mock'

import uds from '../src/suggestions.mjs'

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
})
