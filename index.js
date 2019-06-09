const EventEmitter = require('events')

class Redirect extends EventEmitter {
  description () {
    return 'Perform a 302 Redirect if the request URL matches a specified regular expression.'
  }

  optionDefinitions () {
    return [
      {
        name: 'redirect',
        multiple: true,
        typeLabel: '{underline expression} {underline ...}',
        description: "A list of URL redirect rules. For each rule, separate the 'from' and 'to' expressions with '->'. Whitespace surrounding the expressions is ignored. E.g. 'http -> https'."
      }
    ]
  }

  middleware (config) {
    const redirects = parseRedirectRules(config.redirect)
    if (redirects.length) {
      this.emit('verbose', 'middleware.redirect.config', { redirects })
      return function (ctx, next) {
        let redirectToUrl = ctx.request.href
        for (const rule of redirects) {
          if (rule.from.test(redirectToUrl)) {
            redirectToUrl = redirectToUrl.replace(rule.from, rule.to)
          }
        }
        ctx.redirect(redirectToUrl)
        next()
      }
    }
  }
}

function parseRedirectRules (rules) {
  const arrayify = require('array-back')

  return arrayify(rules).map(rule => {
    if (typeof rule === 'string') {
      const matches = rule.match(/(\S*)\s*->\s*(\S*)/)
      if (!(matches && matches.length >= 3)) throw new Error('Invalid rule: ' + rule)
      return {
        from: new RegExp(matches[1]),
        to: matches[2]
      }
    } else {
      return rule
    }
  })
}

module.exports = Redirect
