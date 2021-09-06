import assert from 'assert'

import 'isomorphic-fetch'
import fetch_mock from 'fetch-mock'

export function test_fetch(suite_name, res, expect, fn) {
    suite(suite_name, function() {
	setup(function() {
	    fetch_mock.get('*', res)
	})
	teardown(function() {
	    fetch_mock.restore()
	})

	test('smoke', async function() {
	    let r = await fn('u')
	    assert.deepEqual(r, expect || [
		{ content: 'u',
		  description: '<match>u</match><dim> - 123&gt;</dim>'
		}
	    ])
	})

	test('empty input', async function() {
	    let r = await fn('')
	    assert.deepEqual(r, [])
	})

	test('invalid responce object', async function() {
	    fetch_mock.get('*', {}, {overwriteRoutes: true})
	    let r = await fn('u')
	    assert.deepEqual(r, [])

	    fetch_mock.get('*', [1,2,3], {overwriteRoutes: true})
	    r = await fn('u')
	    assert.deepEqual(r, [])
	})
    })
}
