import SvgIcon from '../SvgIcon/SvgIcon'
import FormatMessage from '../../components/FormatMessage/FormatMessage'

import MessageReply from './MessageReply/MessageReply'
import MessageFiles from './MessageFiles/MessageFiles'
import MessageActions from './MessageActions/MessageActions'
import MessageReactions from './MessageReactions/MessageReactions'
import AudioPlayer from './AudioPlayer/AudioPlayer'

const { messagesValidation } = require('../../utils/data-validation')
const { isAudioFile } = require('../../utils/media-file')

export default {
	name: 'Message',
	components: {
		SvgIcon,
		FormatMessage,
		AudioPlayer,
		MessageReply,
		MessageFiles,
		MessageActions,
		MessageReactions
	},

	props: {
	
	},

	emits: [
		'hide-options',
		'message-added',
		'open-file',
		'open-user-tag',
		'message-action-handler',
		'send-message-reaction'
	],

	data() {
		return {
			hoverMessageId: null,
			messageHover: false,
			optionsOpened: false,
			emojiOpened: false,
			newMessage: {},
			progressTime: '- : -',
			hoverAudioProgress: false
		}
	},

	computed: {
		showDate() {
			return (
				this.index > 0 &&
				this.message.date !== this.messages[this.index - 1].date
			)
		},
		messageOffset() {
			return (
				this.index > 0 &&
				this.message.senderId !== this.messages[this.index - 1].senderId
			)
		},
		isMessageHover() {
			return (
				this.editedMessage._id === this.message._id ||
				this.hoverMessageId === this.message._id
			)
		},
		isAudio() {
			return this.message.files?.some(file => isAudioFile(file))
		},
		isCheckmarkVisible() {
			return (
				this.message.senderId === this.currentUserId &&
				!this.message.deleted &&
				(this.message.saved || this.message.distributed || this.message.seen)
			)
		}
	},

	watch: {
		newMessages: {
			immediate: true,
			deep: true,
			handler(val) {
				if (!val.length || !this.showNewMessagesDivider) {
					return (this.newMessage = {})
				}

				this.newMessage = val.reduce((res, obj) =>
					obj.index < res.index ? obj : res
				)
			}
		}
	},

	mounted() {
		messagesValidation(this.message)

		this.$emit('message-added', {
			message: this.message,
			index: this.index,
			ref: this.$refs[this.message._id]
		})
	},

	methods: {
		onHoverMessage() {
			this.messageHover = true
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return !this.message.deleted
		},
		onLeaveMessage() {
			if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false
			this.hoverMessageId = null
		},
		openFile(file) {
			this.$emit('open-file', { message: this.message, file: file })
		},
		openUserTag(user) {
			this.$emit('open-user-tag', { user })
		},
		messageActionHandler(action) {
			this.messageHover = false
			this.hoverMessageId = null

			setTimeout(() => {
				this.$emit('message-action-handler', { action, message: this.message })
			}, 300)
		},
		sendMessageReaction({ emoji, reaction }) {
			this.$emit('send-message-reaction', {
				messageId: this.message._id,
				reaction: emoji,
				remove: reaction && reaction.indexOf(this.currentUserId) !== -1
			})
			this.messageHover = false
		}
	}
}
const Message = ({	currentUserId, textMessages, index, message, messages, editedMessage, roomUsers=[], messageActions, roomFooterRef, newMessages=[], showReactionEmojis, showNewMessagesDivider, textFormatting, linkOptions, hideOptions }) => (
	<div id={message._id} ref={message._id} class="vac-message-wrapper">
		{showDate && <div v-if="" class="vac-card-info vac-card-date">{message.date}</div>}
		{newMessage._id === message._id && <div class="vac-line-new">{textMessages.NEW_MESSAGES}</div>}
		{message.system && (
			<div class="vac-card-info vac-card-system">
				<FormatMessage content={message.content} users={roomUsers} text-formatting={textFormatting} link-options={linkOptions} open-user-tag={openUserTag} />
			</div>
		)}
		{!message.system && (
			<div class={{ 'vac-message-box': true, 'vac-offset-current': message.senderId === currentUserId }}>
			<slot name="message" v-bind="{ message }">
				{message.avatar && message.senderId !== currentUserId && 
				<div class="vac-avatar" style={'background-image: url"(' + message.avatar + '")'}/>
				<div class={{ 'vac-message-container': true, 'vac-message-container-offset': messageOffset }}>
					<div class={{ 'vac-message-card': true, 'vac-message-highlight': isMessageHover, 'vac-message-current': message.senderId === currentUserId, 'vac-message-deleted': message.deleted }} onmouseover={onHoverMessage} onmouseleave={onLeaveMessage}>
						{roomUsers.length > 2 && message.senderId !== currentUserId && (
							<div
							class={{
								'vac-text-username': true,
								'vac-username-reply': !message.deleted && message.replyMessage
							}}
						>
							<span>{message.username}</span>
						</div>
						)}
						{!message.deleted && message.replyMessage && <MessageReply message={message} room-users={roomUsers} text-formatting={textFormatting} link-options={linkOptions} />
						{!message.deleted && (
							<div>
							<slot name="deleted-icon">
								<svg-icon name="deleted" class="vac-icon-deleted" />
							</slot>
							<span>{textMessages.MESSAGE_DELETED}</span>
						</div>
						)}
					)}
					{!message.files || !message.files.length && <FormatMessage content={message.content} users={roomUsers} text-formatting={textFormatting} link-options={linkOptions} open-user-tag={openUserTag}/>)
					{!isAudio || message.files.length > 1 && <MessageFiles current-user-id="currentUserId" message="message" room-users="roomUsers" text-formatting="textFormatting" link-options="linkOptions" open-file="openFile"/>
					{isAudio && (
						<AudioPlayer src="message.files[0].url" update-progress-time="progressTime = $event" hover-audio-progress="hoverAudioProgress = $event"/>
						{!message.deleted && <div v-if="" class="vac-progress-time">{progressTime}</div>}
					)}
						<div class="vac-text-timestamp">
							<div
								v-if="message.edited && !message.deleted"
								class="vac-icon-edited"
							>
								<slot name="pencil-icon">
									<svg-icon name="pencil" />
								</slot>
							</div>
							<span>{{ message.timestamp }}</span>
							<span v-if="isCheckmarkVisible">
								<slot name="checkmark-icon" v-bind="{ message }">
									<svg-icon
										:name="
											message.distributed ? 'double-checkmark' : 'checkmark'
										"
										:param="message.seen ? 'seen' : ''"
										class="vac-icon-check"
									/>
								</slot>
							</span>
						</div>

						<message-actions
							:current-user-id="currentUserId"
							:message="message"
							:message-actions="messageActions"
							:room-footer-ref="roomFooterRef"
							:show-reaction-emojis="showReactionEmojis"
							:hide-options="hideOptions"
							:message-hover="messageHover"
							:hover-message-id="hoverMessageId"
							:hover-audio-progress="hoverAudioProgress"
							@hide-options="$emit('hide-options', false)"
							@update-message-hover="messageHover = $event"
							@update-options-opened="optionsOpened = $event"
							@update-emoji-opened="emojiOpened = $event"
							@message-action-handler="messageActionHandler"
							@send-message-reaction="sendMessageReaction"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</message-actions>
					</div>

					<message-reactions
						:current-user-id="currentUserId"
						:message="message"
						@send-message-reaction="sendMessageReaction"
					/>
				</div>
			</slot>
		</div>
	</div>
		)