import Bootstrap from '../Sdk/Bootstrap'
import Settings from '~/og.config'

export default ({ $config, app }, inject) => {
  const config = new Bootstrap(Settings, app)
  inject('og', config)
}
