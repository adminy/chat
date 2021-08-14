import './RoomEmojis.scss'
const RoomEmojis = ({ filteredEmojis }) => (
  <div name='vac-slide-up'>
    {filteredEmojis.length && (
      <div class='vac-emojis-container' style={`bottom: ${parent.$refs.roomFooter.clientHeight}px`}>
        {filteredEmojis.map(emoji => <div key={emoji} class='vac-emoji-element' onclick={() => emit('select-emoji', emoji)}>{emoji}</div>)}
      </div>
    )}
  </div>
)

module.exports = RoomEmojis
