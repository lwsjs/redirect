function getTargetUrl (from, to, url) {
  if (typeof from === 'string') {
    from = new RegExp(from)
  }
  if (from.test(url)) {
    return url.replace(from, to)
  } else {
    return url
  }
}

exports.getTargetUrl = getTargetUrl
