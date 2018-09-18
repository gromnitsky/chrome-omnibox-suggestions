import wikipedia from '../src/suggestions/wikipedia.mjs'
import urbandictionary from '../src/suggestions/urbandictionary.mjs'
import ldoce from '../src/suggestions/ldoce.mjs'
import * as h from './helper'

h.test_fetch('wikipedia', [
    "u",
    [ "u" ],
    [ "123>" ],
    [ "https://u" ],
], null, wikipedia)

h.test_fetch('urbandictionary', {
    "results": [{
	"term": "u",
	"preview": "123>"
    }]
}, null, urbandictionary)

h.test_fetch('ldoce', {
    "results": [{
	"searchtext": "u"
    }]
}, [{content: 'u', "description": "<match>u</match>"}], ldoce)
