[![view on npm](https://img.shields.io/npm/v/lws-redirect.svg)](https://www.npmjs.org/package/lws-redirect)
[![npm module downloads](https://img.shields.io/npm/dt/lws-redirect.svg)](https://www.npmjs.org/package/lws-redirect)
[![Build Status](https://travis-ci.org/lwsjs/redirect.svg?branch=master)](https://travis-ci.org/lwsjs/redirect)
[![Dependency Status](https://badgen.net/david/dep/lwsjs/redirect)](https://david-dm.org/lwsjs/redirect)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# lws-redirect

A [lws](https://github.com/lwsjs/lws) middleware plugin to perform a 302 Redirect if the request URL matches a specified regular expression.

Adds the following option to lws.

```
--redirect expression ...   A list of URL redirect rules. For each rule, separate the 'from' and 'to'
                            expressions with '->'. Whitespace surrounding the expressions is ignored.
                            E.g. 'http -> https'.
```

## Usage

Supply a "from" regular expression and "to" replace string. If the request URL matches the "from" regexp, the matching "from" string will be replaced by the "to" string.

Some examples if the incoming request URL is `http://localhost`:

* `--redirect 'http -> https'` would redirect to `https://localhost`.
* `--redirect 'http -> https' 'localhost -> remotehost'` would redirect to `https://remotehost`.

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

## Debugging

This package includes a trivial command-line tool for testing redirect rules. Test each rule individually using this command structure:

```
$ npx lws-redirect <from> <to> <url>
```

The following examples test a rule which adds a trailing `/` to a path ending with `one` or `two`. The first two examples produce a match and modified target URL. The third and fourth examples do not produce a match so the target URL remains unmodified.

_Note: Windows users may need to use double instead of single quotes._

```
$ npx lws-redirect '(one|two$)' '$1/' http://something.com/one
http://something.com/one/

$ npx lws-redirect '(one|two$)' '$1/' http://something.com/two
http://something.com/two/

$ npx lws-redirect '(one|two$)' '$1/' http://something.com/three
http://something.com/three

$ npx lws-redirect '(one|two)$' '$1/' http://something.com/one/four
http://something.com/one/four
```

## Tutorials

* [How to redirect all HTTP traffic to HTTPS](https://github.com/lwsjs/local-web-server/wiki/How-to-redirect-HTTP-traffic-to-HTTPS).

* * *

&copy; 2019-20 Lloyd Brookes \<75pound@gmail.com\>.
