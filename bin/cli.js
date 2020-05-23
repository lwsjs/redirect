#!/usr/bin/env node
const getTargetUrl = require('../lib/rewrite').getTargetUrl

if (!(process.argv[2], process.argv[3], process.argv[4])) {
  console.log('USAGE:')
  console.log('$ lws-redirect <from> <to> <url>')
} else {
  console.log(getTargetUrl(process.argv[2], process.argv[3], process.argv[4]))
}

