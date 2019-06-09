const EventEmitter = require('events')

class Redirect extends EventEmitter {
  description () {
    return 'Create a redirect rule.'
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
