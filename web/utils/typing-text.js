export default (room, currentUserId, textMessages) => {
  if (room.typingUsers && room.typingUsers.length) {
    const typingUsers = room.users.filter(user => (user._id !== currentUserId) && (room.typingUsers.includes(user._id)) && (user.status && user.status.state !== 'offline'))
    if (!typingUsers.length) return
    return room.users.length === 2 ? textMessages.IS_TYPING : typingUsers.map(user => user.username).join(', ') + ' ' + textMessages.IS_TYPING
  }
}
