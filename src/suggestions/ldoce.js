import * as u from '../u.js'

export default async function(term, type) {
    if (!u.term_valid(term)) return []

    return u.efetch(`https://www.ldoceonline.com/autocomplete/english/?q=${encodeURIComponent(term)}`).then( r => r.json()).then(format)
}

function format(json) {
    if (!Array.isArray(json && json.results)) return []

    return json.results.map( val => {
	// https://developer.chrome.com/extensions/omnibox#type-SuggestResult
	return {
	    content: val.searchtext,
	    description: `<match>${u.xml_escape(val.searchtext)}</match>`
	}
    })
}

export function url(term, engine_type) {
    return `https://www.ldoceonline.com/dictionary/${encodeURIComponent(term)}`
}
