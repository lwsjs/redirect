const EventEmitter = require('events')
const getTargetUrl = require('./lib/rewrite').getTargetUrl

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
      return async (ctx, next) => {
        let redirectToUrl = ctx.request.href
        for (const rule of redirects) {
          redirectToUrl = getTargetUrl(rule.from, rule.to, redirectToUrl)
        }
        if (redirectToUrl !== ctx.request.href) {
          this.emit('verbose', 'middleware.redirect.redirecting', {
            from: ctx.request.href,
            to: redirectToUrl
          })
          ctx.redirect(redirectToUrl)
        }
        await next()
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
        from: matches[1],
        to: matches[2]
      }
    } else {
      return rule
    }
  })
}

module.exports = Redirect
