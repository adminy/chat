import './RoomFile.scss'
const SvgIcon = require('../../../components/SvgIcon/SvgIcon')
const { isImageFile, isVideoFile } = require('../../../utils/media-file')

const Video = ({ file }) => isVideoFile(file) && <video controls><source src={file.localUrl || file.url} /></video>
const Image = ({ file }) => isImageFile(file) && <div class='vac-message-image' style={'background-image: url("' + (file.localUrl || file.url) + '")'} />
const File = ({ file }) => !isVideoFile(file) && !isImageFile(file) && (
  <div class='vac-file-container'>
    <div><slot name='file-icon'><svg-icon name='file' /></slot></div>
    <div class='vac-text-ellipsis'>{file.name}</div>
    {file.extension && <div class='vac-text-ellipsis vac-text-extension'>{file.extension}</div>}
  </div>
)

const RoomFile = ({ file, index }) => (
  <div class='vac-room-file-container'>
    <div class='vac-svg-button vac-icon-remove' onclick={() => emit('remove-file', index)}>
      <slot name='image-close-icon'><SvgIcon name='close' param='image' /></slot>
    </div>
    <Video file={file} />
    <Image file={file} />
    <File file={file} />
  </div>
)
module.exports = RoomFile
