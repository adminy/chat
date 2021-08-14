'use strict'
const fs = require('fs')
const loadSocketServer = require('./server')

const ssl = !{
    http2: true,
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      key: fs.readFileSync(`${__dirname}/ssl/server.key`),
      cert: fs.readFileSync(`${__dirname}/ssl/server.cert`)
    }
}

const isMember = (ws, roomID) => ws.readyState == ws.OPEN && ws.user && ws.user.roomID == roomID

loadSocketServer(ssl).then(server => {

    const updateRoom = roomID => [...server.websocketServer.clients].filter(ws => isMember(ws, roomID)).map(ws => ws.user.name)

    const getHost = roomID => [...server.websocketServer.clients].filter(ws => ws.roomHost == roomID)[0]
    
    const updateHost = roomID => {
        const host = getHost(roomID)
        host && host.send(JSON.stringify(updateRoom(roomID)))
    }

    server.static(process.cwd() + '/web/index.html')

    // API here
    // server.get('/checkRoom/:roomID', (req, res) => res.send(updateRoom(req.params.roomID)))
    // server.get('/:roomID/:name', (req, res) => res.send(process.cwd() + '/dist/index.html'))
    

    // Live API here
    
    server.get('/watch/:roomID/:name', { websocket: true }, (connection, req, params) => {
        const room = params.roomID
        const ws = connection.socket
        ws.user = params
        console.log(`Client ${ws.user.name} joined ${room}`)
        updateHost(room)
        ws.on('close', () => {
            updateHost(room)
            console.log(`Client ${ws.user.name} left ${room}`)
        })
    })
    server.get('/host/:roomID', { websocket: true }, (connection, req, params) => {
        console.log('host created room ' + params.roomID)
        const ws = connection.socket
        ws.roomHost = params.roomID
        ws.on('message', msg => server.websocketServer.clients.forEach(client => client != ws && isMember(client, params.roomID) && client.send(msg)))
        ws.on('close', () => console.log(`Host in room ${params.roomID} finished streaming`))
        ws.send('[]')
        // ws.on('message', msg => ws.send( Buffer.from( 'hi from server, ack you said: ' + msg + ' in room: ' + params.roomID ) ) )
    })

    server.listen(ssl ? 443 : 80, '0.0.0.0').then(addr => console.log(`server listening on ${addr}`))
})

