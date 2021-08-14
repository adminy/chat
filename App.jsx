const { theme, isDevice, users, addNewRoom, inviteRoomId, removeUsers } = require('state')
const emit = require('emit')
module.exports = (
  <div class={{ 'app-container': true, 'app-mobile': isDevice, 'app-mobile-dark': theme === 'dark' }}>
    <span class={{ 'user-logged': true, 'user-logged-dark': theme === 'dark' }}>Logged as</span>
    <select>{users.map(user => <option key={user._id} value={user._id}>{user.username}</option>)}</select>
    <div class='button-theme'>
      <button class={'button-' + theme} onclick={emit('toggleTheme')}>{theme.toUpperCase()}</button>
    </div>
    <div class={{ 'window-container': true, 'window-mobile': isDevice }}>
      {addNewRoom && (
        <form onsubmit={e => emit('createRoom', e)}>
          <input v-model='addRoomUsername' type='text' placeholder='Add username' />
          <button type='submit' disabled='disableForm || !addRoomUsername'>Create Room</button>
          <button class='button-cancel' click='addNewRoom = false'>Cancel</button>
        </form>
      )}

      {inviteRoomId && (
        <form onsubmit={e => emit('addRoomUser', e)}>
          <input v-model='invitedUsername' type='text' placeholder='Add username' />
          <button type='submit' disabled='disableForm || !invitedUsername'>Add User</button>
          <button class='button-cancel' click='inviteRoomId = null'>Cancel</button>
        </form>
      )}

      <form v-if='removeRoomId' onsubmit='deleteRoomUser'>
        <select v-model='removeUserId'>
          <option default value=''>Select User</option>
          {removeUsers.map(user => <option key={user._id} value={user._id}>{user.username}</option>)}
        </select>
        <button type='submit' disabled='disableForm || !removeUserId'>Remove User</button>
        <button class='button-cancel' click='removeRoomId = null'>Cancel</button>
      </form>

      <chat-window
        height='screenHeight'
        theme='theme'
        styles='styles'
        current-user-id='currentUserId'
        room-id='roomId'
        rooms='loadedRooms'
        loading-rooms='loadingRooms'
        messages='messages'
        messages-loaded='messagesLoaded'
        rooms-loaded='roomsLoaded'
        room-actions='roomActions'
        menu-actions='menuActions'
        room-message='roomMessage'
        fetch-more-rooms='fetchMoreRooms'
        fetch-messages='fetchMessages'
        send-message='sendMessage'
        edit-message='editMessage'
        delete-message='deleteMessage'
        open-file='openFile'
        open-user-tag='openUserTag'
        add-room='addRoom'
        room-action-handler='menuActionHandler'
        menu-action-handler='menuActionHandler'
        send-message-reaction='sendMessageReaction'
        typing-message='typingMessage'
        toggle-rooms-list="$emit('show-demo-options', $event.opened)"
      />
    </div>
  </div>
)
