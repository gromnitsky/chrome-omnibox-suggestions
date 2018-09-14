import * as u from '../u.mjs'

export default async function(term) {
    if (!u.term_valid(term)) return []

    return u.efetch(`http://api.urbandictionary.com/v0/autocomplete-extra?term=${encodeURIComponent(term)}`).then( r => r.json()).then(format)
}

function format(json) {
    if (!Array.isArray(json && json.results)) return []

    return json.results.map( val => {
	// https://developer.chrome.com/extensions/omnibox#type-SuggestResult
	return {
	    content: val.term,
	    description: `<match>${u.xml_escape(val.term)}</match>`
		+ '<dim> - ' + u.xml_escape(val.preview || '?') + '</dim>'
	}
    })
}

export function url(term) {
    return `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(term)}`
}
