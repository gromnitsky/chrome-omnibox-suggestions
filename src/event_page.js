import * as u from './u.js'

let manifest = chrome.runtime.getManifest()

import(`./suggestions/${manifest['x-name']}.js`).then( module => {
    let suggestions = function(term, omnibox) {
	console.log('suggestions for:', term)
	module.default(term, manifest['x-type']).then(omnibox)
    }
    let suggestions_debounced = debounce(function(term, omnibox) {
	suggestions(term, omnibox)
    }, 250)

    chrome.omnibox.onInputChanged.addListener(suggestions_debounced)
    chrome.omnibox.onInputEntered.addListener( (term, tab_disposition) => {
	if (!u.term_valid(term)) return
	navigate(module.url(term, manifest['x-type']), tab_disposition)
    })
})

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

/* 3rd party code */

// from underscore.js 1.8.3
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
	var last = Date.now() - timestamp;

	if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
	} else {
            timeout = null;
            if (!immediate) {
		result = func.apply(context, args);
		if (!timeout) context = args = null;
            }
	}
    };

    return function() {
	context = this;
	args = arguments;
	timestamp = Date.now();
	var callNow = immediate && !timeout;
	if (!timeout) timeout = setTimeout(later, wait);
	if (callNow) {
            result = func.apply(context, args);
            context = args = null;
	}

	return result;
    };
}
