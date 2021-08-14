import './RoomFiles.scss'
const SvgIcon = require('../../../components/SvgIcon/SvgIcon')
const RoomFile = require('../RoomFile/RoomFile')

const RoomFiles = ({ files }) => (
  <transition name='vac-slide-up'>
    {files.length && (
      <div class='vac-room-files-container' style={'bottom: ' + parent.$refs.roomFooter.clientHeight + 'px'}>
        <div class='vac-files-box'>
          {files.map((file, i) => <div key={i}><RoomFile file={file} index={i} onRemoveFile={e => emit('remove-file', e)} /></div>)}
        </div>

        <div class='vac-icon-close'>
          <div class='vac-svg-button' onclick={e => emit('reset-message')}>
            <slot name='reply-close-icon'><SvgIcon name='close-outline' /></slot>
          </div>
        </div>
      </div>
    )}
  </transition>
)

module.exports = RoomFiles
