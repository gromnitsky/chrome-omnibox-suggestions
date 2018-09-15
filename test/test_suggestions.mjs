import wikipedia from '../src/suggestions/wikipedia.mjs'
import urbandictionary from '../src/suggestions/urbandictionary.mjs'
import * as h from './helper'

h.test_fetch('wikipedia', [
    "u",
    [ "u" ],
    [ "123>" ],
    [ "https://u" ],
], wikipedia)

h.test_fetch('urbandictionary', {
    "results": [{
	"term": "u",
	"preview": "123>"
    }]
}, urbandictionary)
