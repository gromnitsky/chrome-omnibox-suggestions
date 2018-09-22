import assert from 'assert'

import 'isomorphic-fetch'
import fetch_mock from 'fetch-mock'

import * as imdb from '../src/suggestions/imdb.mjs'

suite('imdb', function() {
    setup(function() {
	fetch_mock.get('*', `imdb$u({
    "q": "u",
    "v": "1",
    "d": [{
	"id": "tt123",
	"l": "u",
	"s": "123>"
    }]
})`)
    })
    teardown(function() {
	fetch_mock.restore()
    })

    test('smoke', async function() {
	let r = await imdb.default('u')
	assert.deepEqual(r, [
	    { content: 'u',
	      description: '<match>u</match><dim> - 123&gt;</dim>'
	    }
	])
    })

    test('empty input', async function() {
	let r = await imdb.default('')
	assert.deepEqual(r, [])
    })

    test('invalid responce object', async function() {
	fetch_mock.get('*', '{}', {overwriteRoutes: true})
	assert.rejects( async () => {
	    await imdb.default('u')
	}, /Unexpected end of JSON input/)

	fetch_mock.get('*', 'imdb$u([1,2,3])', {overwriteRoutes: true})
	assert.deepEqual(await imdb.default('u'), [])
    })

    test('url', async function() {
	assert.equal(imdb.url('1 2'), 'https://www.imdb.com/find?q=1%202')

	fetch_mock.get('*', `imdb$u({
    "d": [{
	"id": "/bar",
	"l": "foo"
    }]
})`, {overwriteRoutes: true})
	await imdb.default("foo")
	assert.equal(imdb.url('foo'), 'https://www.imdb.com/bar/')

	fetch_mock.get('*', `imdb$u({
    "d": [{
	"id": "tt123",
	"l": "foo"
    }]
})`, {overwriteRoutes: true})
	await imdb.default("foo")
	assert.equal(imdb.url('foo'), 'https://www.imdb.com/title/tt123/')
    })
})
