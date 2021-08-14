import './Loader.scss'

const Loader = ({ show = false, infinite = false }) => (
  <transition name='vac-fade-spinner' appear>
    {show && (
      <div class={{ 'vac-loader-wrapper': true, 'vac-container-center': !infinite, 'vac-container-top': infinite }}>
        <div id='vac-circle' />
      </div>
    )}
  </transition>
)

module.exports = Loader
