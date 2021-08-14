import './RoomSearch.scss'

const SvgIcon = require('../../../components/SvgIcon/SvgIcon')

const RoomsSearch = ({ textMessages, showSearch, showAddRoom, rooms, loadingRooms }) => (
  <div class={showSearch || showAddRoom ? 'vac-box-search' : 'vac-box-empty'}>
    {showSearch && !loadingRooms && rooms.length && (
      <>
        <div class='vac-icon-search'>
          <slot name='search-icon'>
            <SvgIcon name='search' />
          </slot>
        </div>
        <input type='search' placeholder={textMessages.SEARCH} autocomplete='off' class='vac-input' oninput="$emit('search-room', $event)" />
      </>
    )}
    {showAddRoom && (
      <div class='vac-svg-button vac-add-icon' onclick="$emit('add-room')">
        <slot name='add-icon'>
          <SvgIcon name='add' />
        </slot>
      </div>
    )}
  </div>
)

module.exports = RoomsSearch
