const Tom = require('test-runner').Tom
const Redirect = require('./')
const Lws = require('lws')
const a = require('assert')
const fetch = require('node-fetch')

const tom = module.exports = new Tom('redirect')

tom.test('http -> https', async function () {
  const port = 8000 + this.index
  const lws = Lws.create({
    stack: Redirect,
    port,
    redirect: 'http -> https'
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.strictEqual(response.status, 302)
  a.strictEqual(response.headers.get('location'), 'https://localhost:8001/one')
})

tom.test('port', async function () {
  const port = 8000 + this.index
  const lws = Lws.create({
    stack: Redirect,
    port,
    redirect: `:${port} -> :9000`
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.strictEqual(response.status, 302)
  a.strictEqual(response.headers.get('location'), 'http://localhost:9000/one')
})

tom.test('schema and port', async function () {
  const port = 8000 + this.index
  const lws = Lws.create({
    stack: Redirect,
    port,
    redirect: [
      'http -> https',
      `:${port} -> :9000`
    ]
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.strictEqual(response.status, 302)
  a.strictEqual(response.headers.get('location'), 'https://localhost:9000/one')
})
