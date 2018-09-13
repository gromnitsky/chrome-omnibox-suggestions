export default async function(term) {
    if (!(term = term.trim())) return []

    return efetch(`http://api.urbandictionary.com/v0/autocomplete-extra?term=${encodeURIComponent(term)}`).then( r => r.json()).then(format)
}

function efetch(url, opt) {
    let fetcherr = r => {
	if (!r.ok) throw new Error(r.statusText)
	return r
    }
    return fetch(url, opt).then(fetcherr)
}

function format(json) {
    if (!Array.isArray(json && json.results)) return []

    return json.results.map( val => {
	// https://developer.chrome.com/extensions/omnibox#type-SuggestResult
	return {
	    content: val.term,
	    description: `<match>${xml_escape(val.term)}</match>`
		+ '<dim> - ' + xml_escape(val.preview || '?') + '</dim>'
	}
    })
}

function xml_escape(s) {
    return s.replace(/[<>&'"]/g, ch => {
        switch (ch) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case '\'': return '&apos;'
        case '"': return '&quot;'
        }
    })
}
