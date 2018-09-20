import * as u from '../u.mjs'

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

let sg_url = function(input) {
    // mein gott, lieber vasisualy
    let G = /[àÀáÁâÂãÃäÄåÅæÆçÇèÈéÉêÊëËìÍíÍîÎïÏðÐñÑòÒóÓôÔõÕöÖøØùÙúÚûÛüÜýÝÿþÞß]/
    function n(a) {
	if (a) {
            var b = a.toLowerCase();
            return b.length > 20 && (b = b.substr(0, 20)),
            b = b.replace(/^\s*/, "").replace(/[ ]+/g, "_"),
            G.test(b) && (b = b.replace(/[àÀáÁâÂãÃäÄåÅæÆ]/g, "a").replace(/[çÇ]/g, "c").replace(/[èÈéÉêÊëË]/g, "e").replace(/[ìÍíÍîÎïÏ]/g, "i").replace(/[ðÐ]/g, "d").replace(/[ñÑ]/g, "n").replace(/[òÒóÓôÔõÕöÖøØ]/g, "o").replace(/[ùÙúÚûÛüÜ]/g, "u").replace(/[ýÝÿ]/g, "y").replace(/[þÞ]/g, "t").replace(/[ß]/g, "ss")),
            b = b.replace(/[\W]/g, "")
	}
	return ""
    }

    let url = function(a, b) {
        return "https://v2.sg.media-imdb.com/suggests/" + a + "/" + b + ".json"
    }
    let term = n(input)
    if (!term) return ""
    return url(term.substr(0, 1), term)
}
