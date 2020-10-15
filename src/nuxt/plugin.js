import Bootstrap from '../Sdk/Bootstrap'
import Settings from '~/og.config'

export default ({ app }, inject) => {
  const config = new Bootstrap(Settings, app)
  config.set('DEFAULT_COUNTRY', process.env.OG_SDK_DEFAULT_COUNTRY || 'DO')
  config.set('DEFAULT_CURRENCY', process.env.OG_SDK_DEFAULT_CURRENCY || 'DOP')
  config.set('DEFAULT_LOCALE', app.i18n.locale)
  inject('og', config)
}
