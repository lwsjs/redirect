#!/usr/bin/env node
const getTargetUrl = require('../lib/rewrite').getTargetUrl
const [from, to, url] = process.argv.slice(2)

if (!(from && to && url)) {
  console.log('USAGE:')
  console.log('$ lws-redirect <from> <to> <url>')
} else {
  console.log(getTargetUrl(from, to, url))
}

