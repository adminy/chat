import './MessageReply.scss'
const FormatMessage = require('../../../components/FormatMessage/FormatMessage')
const AudioPlayer = require('../AudioPlayer/AudioPlayer')
const { isAudioFile, isImageFile, isVideoFile } = require('../../../utils/media-file')
const MessageReply = ({ message, textFormatting, linkOptions, roomUsers }) => {
  const firstFile = message.replyMessage.files[0] || {}
  return (
    <div class='vac-reply-message'>
      <div class='vac-reply-username'>
        {(roomUsers.find(user => user._id === message.replyMessage.senderId) || { username: '' }).username}
      </div>

      {isImageFile(firstFile) && (
        <div class='vac-image-reply-container'>
          <div class='vac-message-image vac-message-image-reply' style={'background-image: url("' + firstFile.url + '")'} />
        </div>
      )}
      {isVideoFile(firstFile) && (
        <div class='vac-video-reply-container'>
          <video width='100%' height='100%' controls>
            <source src={firstFile.url} />
          </video>
        </div>
      )}

      {isAudioFile(firstFile) && <AudioPlayer src={firstFile.url} />}

      <div class='vac-reply-content'>
        <FormatMessage content={message.replyMessage.content} users={roomUsers} text-formatting={textFormatting} link-options={linkOptions} reply />
      </div>
    </div>
  )
}
module.exports = MessageReply
