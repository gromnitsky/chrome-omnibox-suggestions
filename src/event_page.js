import debounce from './rollup/lodash.debounce/index.js'
import * as u from './u.js'

let manifest = chrome.runtime.getManifest()

import(`./suggestions/${manifest['x-name']}.js`).then( module => {
    let suggestions = function(term, suggestions_upd) {
	console.log('suggestions for:', term)
	module.default(term, manifest['x-type']).then( json => {
            set_first_suggestion(json, term)
            suggestions_upd(json)
        })
    }
    let suggestions_debounced = debounce(function(term, suggestions_upd) {
        suggestions(term, suggestions_upd)
    }, 250)

    chrome.omnibox.onInputChanged.addListener(suggestions_debounced)
    chrome.omnibox.onInputEntered.addListener( (term, tab_disposition) => {
	if (!u.term_valid(term)) return
	navigate(module.url(term, manifest['x-type']), tab_disposition)
    })
})

function set_first_suggestion(json, term) { // modifies `json`
    let idx = json.findIndex( v => v?.content === term)
    if (idx !== -1) {
        chrome.omnibox.setDefaultSuggestion({
            description: json[idx].description
        })
        json.splice(idx, 1)
        return
    }

    // reset
    chrome.omnibox.setDefaultSuggestion({
        description: `<url><match>${u.xml_escape(term)}</match></url>`
    })
}

function navigate(url, tab_disposition) {
    console.log(tab_disposition, 'navigate to', url)
    switch (tab_disposition) {
    case 'newForegroundTab':
	chrome.tabs.create({url})
	break;
    case 'newBackgroundTab':
	chrome.tabs.create({url, active: false})
	break;
    default:
	chrome.tabs.query({currentWindow: true, active: true}, tabs => {
	    chrome.tabs.update(tabs[0].id, {url})
	})
    }
}
