import deburr from '../rollup/lodash.deburr/index.js'
import * as u from '../u.js'

export default async function(term, lang) {
    let url = sg_url(term)
    if (!url) return []

    return u.efetch(url).then( r => r.text()).then(format)
}

let query

function format(text) {
    let json = JSON.parse(text.replace(/^imdb[^(]+\(/, '').slice(0, -1))
    if (!Array.isArray(json && json.d)) return []

    query = {}
    return json.d.map( val => {
	query[val.l] = val.id
	// https://developer.chrome.com/extensions/omnibox#type-SuggestResult
	return {
	    content: val.l,
	    description: `<match>${u.xml_escape(val.l)}</match>`
		+ '<dim> - ' + (val.y ? `(${val.y}) ` : '')
		+ u.xml_escape(val.s || '?') + '</dim>'
	}
    })
}

export function url(term, engine_type) {
    let q = query[term] || ''
    switch (q.slice(0,2)) {
    case 'nm': return `https://www.imdb.com/name/${q}/`
    case 'tt': return `https://www.imdb.com/title/${q}/`
    default: return q[0] === '/' ? `https://www.imdb.com${q}/` : `https://www.imdb.com/find?q=${encodeURIComponent(term)}`
    }
}

//  input: åmëlí
// return: https://v2.sg.media-imdb.com/suggests/a/ameli.json
let sg_url = function(input) {
    let url = function(a, b) {
        return "https://v2.sg.media-imdb.com/suggests/" + a + "/" + b + ".json"
    }

    if (!input) return
    input = deburr(input)
    return url(input.substr(0, 1), input)
}
