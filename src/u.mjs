export function efetch(url, opt) {
    let fetcherr = r => {
	if (!r.ok) throw new Error(r.statusText)
	return r
    }
    return fetch(url, opt).then(fetcherr)
}

export function xml_escape(s) {
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

export function term_valid(term) { return (term || '').trim().length !== 0 }
