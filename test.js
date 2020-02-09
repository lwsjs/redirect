const Tom = require('test-runner').Tom
const Redirect = require('./')
const Lws = require('lws')
const a = require('assert').strict
const fetch = require('node-fetch')

const tom = module.exports = new Tom()

tom.test('http -> https', async function () {
  const port = 8000 + this.index
  const lws = Lws.create({
    stack: Redirect,
    port,
    redirect: 'http -> https'
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.equal(response.status, 302)
  a.equal(response.headers.get('location'), 'https://localhost:8001/one')
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
  a.equal(response.status, 302)
  a.equal(response.headers.get('location'), 'http://localhost:9000/one')
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
  a.equal(response.status, 302)
  a.equal(response.headers.get('location'), 'https://localhost:9000/one')
})

tom.test('no redirect match', async function () {
  const port = 8000 + this.index
  const lws = Lws.create({
    stack: Redirect,
    port,
    redirect: 'something -> anotherthing'
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.equal(response.status, 404)
})

tom.test('no redirect match, next middleware invoked', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return async (ctx, next) => {
        ctx.response.status = 405
        await next()
      }
    }
  }
  const lws = Lws.create({
    stack: [ Redirect, One ],
    port,
    redirect: 'something -> anotherthing'
  })
  const response = await fetch(`http://localhost:${port}/one`, { redirect: 'manual' })
  lws.server.close()
  a.equal(response.status, 405)
})
