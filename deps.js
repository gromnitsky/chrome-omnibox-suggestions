#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import detective from 'detective-es6'

let out = process.argv[2]
process.argv.slice(3).forEach( file => {
    let deps = detective(fs.readFileSync(file).toString(), {
        skipAsyncImports: true
    }).map( dep => {
        return path.join(out, dep)
    }).filter( v => /rollup/.test(v))

    if (!deps.length) return

    deps.forEach( dep => console.log(`${file}: ${dep}`))
})
