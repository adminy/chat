module.exports = (state, emit) => {
  !state.connectingRoom && emit('connectRoom')
  return (
<body>
        <div class="display: flex;">
            <a href="/"><img src={backButton} width="48px" height="48px"/></a>
            <span style={'float:right; font-size: 48px; color: '+(state.meOnline ? 'green' : 'red')}>
                {state.meOnline ? '☻' : '☹'}
            </span>
        </div>
        {videoStream(state, emit)}
    </body>
)
}
