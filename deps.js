#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import detective from 'detective-es6'

process.argv.slice(2).forEach( file => {
    let deps = detective(fs.readFileSync(file).toString(), {
        skipAsyncImports: true
    }).filter( v => /rollup/.test(v)).map( v => {
        return path.join(path.dirname(file), v)
    })

    if (!deps.length) return
    deps.forEach( v => console.log(`${file}: ${v}`))
})
