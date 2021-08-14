import './MessageReactions.scss'
const MessageReactions = ({ currentUserId, message }) => !message.deleted && (
  <span name='vac-slide-left'>
    {Object.entries(message.reaction).map(([reaction, key]) => <button v-show={reaction.length} key={key + 0} class={{ 'vac-button-reaction': true, 'vac-reaction-me': reaction.includes(currentUserId) }} style={'float: ' + (message.senderId === currentUserId ? 'right' : 'left')} onclick={() => emit('sendMessageReaction', { emoji: { unicode: key }, reaction })}>{key}<span>{reaction.length}</span></button>)}
  </span>
)

module.exports = MessageReactions
