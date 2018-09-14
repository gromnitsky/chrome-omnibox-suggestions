import * as u from '../u.mjs'

export default async function(term, lang) {
    if (!u.term_valid(term)) return []

    return u.efetch(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&profile=fuzzy&search=${encodeURIComponent(term)}`).then( r => r.json()).then(format)
}

function format(json) {
    if (!Array.isArray(json && json[1])) return []
    let [term, suggs, desc, urls] = json

    return suggs.map( (val, idx) => {
	// https://developer.chrome.com/extensions/omnibox#type-SuggestResult
	return {
	    content: val,
	    description: `<match>${u.xml_escape(val)}</match>`
		+ '<dim> - ' + u.xml_escape(desc[idx] || '?') + '</dim>'
	}
    })
}

export function url(term, engine_type) {
    return `https://${engine_type}.wikipedia.org/wiki/${encodeURIComponent(term)}`
}
