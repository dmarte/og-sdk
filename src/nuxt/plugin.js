import Bootstrap from '../Sdk/Bootstrap'
import Settings from '~/og.config'

export default ({ app }, inject) => {
  const config = new Bootstrap(Settings, app)
  inject('og', config)
}
