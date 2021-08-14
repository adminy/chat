const loadSocketServer = async ssl => {
    const server = require('fastify')(ssl)

    await server.register(require('middie'))
    
    ssl && await server.register(require('fastify-https-redirect'), { httpPort: 80 })
    
    await server.register(require('fastify-websocket'), { options: { maxPayload: 16 * 1024 * 1024 } })

    // server.static = root => {
    //     server.register(require('fastify-static'), {root})
    //     server.setNotFoundHandler((req, res) => res.type('text/html').sendFile('index.html'))
    // }
   
    // https://parceljs.org/api.html#bundler
    server.static = path => server.use(new (require('parcel-bundler'))(path).middleware())

    return server
}

module.exports = loadSocketServer
