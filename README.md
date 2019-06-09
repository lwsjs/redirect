[![view on npm](https://img.shields.io/npm/v/lws-redirect.svg)](https://www.npmjs.org/package/lws-redirect)
[![npm module downloads](https://img.shields.io/npm/dt/lws-redirect.svg)](https://www.npmjs.org/package/lws-redirect)
[![Build Status](https://travis-ci.org/lwsjs/redirect.svg?branch=master)](https://travis-ci.org/lwsjs/redirect)
[![Dependency Status](https://badgen.net/david/dep/lwsjs/redirect)](https://david-dm.org/lwsjs/redirect)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# lws-redirect

A [lws](https://github.com/lwsjs/lws) middleware plugin to perform a HTTP 302 Redirect if a specified rule is met.

Adds the following option to lws.

```
--redirect    A list of URL redirect rules. For each rule, separate the 'from' and 'to'
              expressions with '->'. Whitespace surrounding the expressions is ignored.
              E.g. 'http -> https'.
```

## Usage

```
$ npm install --save-dev lws-redirect

$ lws --port 80 --stack lws-redirect --redirect 'http -> https'
Listening on http://mba4.local:80, http://127.0.0.1:80, http://192.168.0.200:80

$ $ curl -I http://127.0.0.1/
HTTP/1.1 302 Found
Location: https://127.0.0.1/
Content-Type: text/html; charset=utf-8
Content-Length: 67
Date: Sun, 09 Jun 2019 16:53:38 GMT
Connection: keep-alive
```

* * *

&copy; 2019 Lloyd Brookes \<75pound@gmail.com\>.
