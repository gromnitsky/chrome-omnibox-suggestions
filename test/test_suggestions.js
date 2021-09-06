import wikipedia from '../src/suggestions/wikipedia.js'
import urbandictionary from '../src/suggestions/urbandictionary.js'
import ldoce from '../src/suggestions/ldoce.js'
import * as h from './helper.js'

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
