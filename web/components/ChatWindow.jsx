import '../styles/index.scss'
const RoomsList = require('./RoomsList/RoomsList')
const Room = require('./Room/Room')

const locales = require('../locales')
const { defaultThemeStyles, cssThemeVars } = require('../themes')
const { roomsValidation, partcipantsValidation } = require('../utils/data-validation')

const state = {
	room: {},
	loadingMoreRooms: false,
	showRoomsList: true,
	isMobile: false,
	watch: {
		rooms: {
			immediate: true,
			deep: true,
			handler(newVal, oldVal) {
				if (!newVal[0] || !newVal.find(room => room.roomId === state.room.roomId)) {
					state.showRoomsList = true
				}
				if (!state.loadingMoreRooms && state.loadFirstRoom && newVal[0] && (!oldVal || newVal.length !== oldVal.length)) {
					if (state.roomId) {
						const room = newVal.find(r => r.roomId === state.roomId) || {}
						state.fetchRoom({ room })
					} else if (!state.isMobile || state.singleRoom) {
						state.fetchRoom({ room: state.orderedRooms[0] })
					} else {
						state.showRoomsList = true
					}
				}
			}
		},

		loadingRooms(val) {
			if (val) state.room = {}
		},

		roomId: {
			immediate: true,
			handler(newVal, oldVal) {
				if (newVal && !state.loadingRooms && state.rooms.length) {
					const room = state.rooms.find(r => r.roomId === newVal)
					state.fetchRoom({ room })
				} else if (oldVal && !newVal) {
					state.room = {}
				}
			}
		},

		room(val) {
			if (!val || Object.entries(val).length === 0) return

			roomsValidation(val)

			val.users.forEach(user => partcipantsValidation(user))
		},

		roomsListOpened(val) {
			state.showRoomsList = val
		}
	}
}
const t = textMessages => ({ ...locales, ...textMessages })
const cssVars = styles => {
	const defaultStyles = defaultThemeStyles[state.theme]
	const customStyles = {}
	Object.keys(defaultStyles).map(key => customStyles[key] = { ...defaultStyles[key], ...(styles[key] || {}))
	return cssThemeVars(customStyles)
}
const orderedRooms = rooms => rooms.slice().sort((a, b) => {
		const aVal = a.index || 0
		const bVal = b.index || 0
		return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
})

const updateResponsive = () => state.isMobile = window.innerWidth < state.responsiveBreakpoint

const created = () => {
	updateResponsive()
	window.addEventListener('resize', ev => ev.isTrusted && updateResponsive())
}

const toggleRoomsList = () => {
	state.showRoomsList = !state.showRoomsList
	if (state.isMobile) state.room = {}
	state.$emit('toggle-rooms-list', { opened: state.showRoomsList })
}

const fetchRoom = ({ room }) => {
	state.room = room
	state.fetchMessages({ reset: true })
	if (state.isMobile) state.showRoomsList = false
}
const fetchMoreRooms = () => emit('fetch-more-rooms')
const roomInfo = () => emit('room-info', state.room)
const addRoom = () => emit('add-room')
const fetchMessages = (options) => emit('fetch-messages', { room: state.room, options })
const sendMessage = (message) => emit('send-message', { ...message, roomId: state.room.roomId })
const editMessage = (message) => emit('edit-message', { ...message, roomId: state.room.roomId })
const deleteMessage = (message) => emit('delete-message', { message, roomId: state.room.roomId })
const openFile = ({ message, file }) => emit('open-file', { message, file })
const openUserTag = ({ user }) => emit('open-user-tag', { user })
const menuActionHandler = (ev) => emit('menu-action-handler', { action: ev, roomId: state.room.roomId })
const roomActionHandler = ({ action, roomId }) => emit('room-action-handler', { action, roomId })
const messageActionHandler = (ev) => emit('message-action-handler', { ...ev, roomId: state.room.roomId })
const sendMessageReaction = (messageReaction) => emit('send-message-reaction', { ...messageReaction, roomId: state.room.roomId })
const typingMessage = (message) => emit('typing-message', { message, roomId: state.room.roomId })
const textareaActionHandler = (message) => emit('textarea-action-handler', { message, roomId: state.room.roomId })

const ChatContainer = ({height='600px', theme='light', styles={}, responsiveBreakpoint=900, singleRoom=false, roomsListOpened=true, textMessages, currentUserId: { type: [String, Number], default: '' }, rooms=[], loadingRooms=false, roomsLoaded=false, roomId, loadFirstRoom=true, messages=[], messagesLoaded=false, roomActions=[], menuActions=[], messageActions=[ { name: 'replyMessage', title: 'Reply' }, { name: 'editMessage', title: 'Edit Message', onlyMe: true }, { name: 'deleteMessage', title: 'Delete Message', onlyMe: true } ], showSearch=true, showAddRoom=true, showSendIcon=true, showFiles=true, showAudio=true, showEmojis=true, showReactionEmojis=true, showNewMessagesDivider=true, showFooter=true, textFormatting=true, linkOptions={ disabled: false, target: '_blank' }, roomInfoEnabled=false, textareaActionEnabled=false, roomMessage='', acceptedFiles='*' }) => (
	<div class="vac-card-window" style="[{ height }, cssVars]">
		<div class="vac-chat-container">
			{!singleRoom && (
			<RoomsList
				current-user-id={currentUserId}
				rooms={orderedRooms(rooms)}
				loading-rooms={loadingRooms}
				rooms-loaded={roomsLoaded}
				room={room}
				room-actions={roomActions}
				text-messages={t()}
				show-search={showSearch}
				show-add-room={showAddRoom}
				show-rooms-list={showRoomsList}
				text-formatting={textFormatting}
				link-options={linkOptions}
				is-mobile={isMobile}
				fetch-room={fetchRoom({room})}
				fetch-more-rooms={fetchMoreRooms()}
				loading-more-rooms={loadingMoreRooms}
				add-room={addRoom()}
				room-action-handler={roomActionHandler({ action, roomId })}
			/>
			)}
			<Room
				current-user-id={currentUserId}
				rooms={rooms}
				room-id={room.roomId || ''}
				load-first-room={loadFirstRoom}
				messages={messages}
				room-message={roomMessage}
				messages-loaded={messagesLoaded}
				menu-actions={menuActions}
				message-actions={messageActions}
				show-send-icon={showSendIcon}
				show-files={showFiles}
				show-audio={showAudio}
				show-emojis={showEmojis}
				show-reaction-emojis={showReactionEmojis}
				show-new-messages-divider={showNewMessagesDivider}
				show-footer={showFooter}
				text-messages={t()}
				single-room={singleRoom}
				show-rooms-list={showRoomsList}
				text-formatting={textFormatting}
				link-options={linkOptions}
				is-mobile={isMobile}
				loading-rooms={loadingRooms}
				room-info-enabled={roomInfoEnabled}
				textarea-action-enabled={textareaActionEnabled}
				accepted-files={acceptedFiles}
				toggle-rooms-list={toggleRoomsList()}
				room-info={roomInfo()}
				fetch-messages={fetchMessages()}
				send-message={sendMessage()}
				edit-message={editMessage()}
				delete-message={deleteMessage()}
				open-file={openFile}
				open-user-tag={openUserTag}
				menu-action-handler={menuActionHandler}
				message-action-handler={messageActionHandler}
				send-message-reaction={sendMessageReaction}
				typing-message={typingMessage}
				textarea-action-handler={textareaActionHandler}
			/>
		</div>
	</div>
)
