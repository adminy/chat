module.exports = (state, emitter) => {
	state.error = ''
	state.onJoinRoom = e => {
		e.preventDefault()

		const form = new FormData(e.target)
		
		const id = form.get('room-id')
		const name = form.get('your-name')
		if(id && name) { //TODO: check room length == 3
			document.location.href = `/${id}/${name}`
		} else {
			state.error = 'Please complete all the fields ...'
			emitter.emit('render')
		}
	}

	emitter.on('connectRoom', () => {
		state.connectingRoom = true
		const {roomID, name} = state.params
		const ws = new WebSocket(`ws://localhost/watch/${roomID}/${name}`)
		ws.binaryType = 'arraybuffer'
		ws.onopen = () => emitter.emit('render', state.meOnline = true)
		ws.onerror = ws.onclose = () => emitter.emit('render', state.meOnline = false)
		state.ws = ws
	})
}