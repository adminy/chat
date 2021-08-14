// styles
import './style.scss'

window.React = require('jsx-dom')
const choo = require('choo')
const app = choo()
app.mount('body')

// store procedures
app.use(require('./store-procedures/join-room'))

// routes
app.route('/', require('./views/join-room'))
app.route('/:roomID/:name', require('./views/stream'))
