import OgConfig from '../Libs/OgConfig'
import OgApi from '../Libs/Http/OgApi'
import OgAuth from '../Libs/Http/OgAuth'
import OgUserResource from '../Sdk/Resources/OgUserResource'
import OgLocale from '~/Bxpert/Sdk/src/Libs/OgLocale'

export default class Bootstrap extends OgConfig {
  /**
   * @param {Object} options
   * @param {Vue} vue
   */
  constructor(options, vue) {
    super()
    // URL base to make API requests.
    this.set('API_URL', process.env.OG_SDK_URL_API)
    // Headers must be included with every request.
    this.set('API_HEADERS', {})
    // Determine whether or not to include credentials.
    this.set('API_CREDENTIALS', false)
    // OgAuth module
    this.set('AUTH_API_PATH_LOGIN', 'login')
    this.set('AUTH_API_PATH_USER', 'users/current')
    this.set('AUTH_USER_RESOURCE', null)
    this.set('AUTH_SESSION_KEY_TOKEN', 'auth.token')
    this.set('AUTH_SESSION_KEY_USER', 'auth.user')
    // Collections
    this.set('COLLECTION_PER_PAGE', 15)
    this.fill(options)
    // Accessors
    this.set('api', new OgApi(this))
    this.set('auth', new OgAuth(this.api))
    this.set('locale', new OgLocale(this, vue.i18n))
  }

  /**
   * @returns {OgAuth}
   */
  get auth() {
    return this.get('auth')
  }

  /**
   * @returns {OgApi}
   */
  get api() {
    return this.get('api')
  }

  /**
   * @returns {OgLocale}
   */
  get locale() {
    return this.get('locale')
  }

  get COLLECTION_PER_PAGE() {
    return this.get('COLLECTION_PER_PAGE')
  }

  get AUTH_USER_RESOURCE() {
    return this.get('AUTH_USER_RESOURCE')
  }

  get AUTH_SESSION_KEY_TOKEN() {
    return this.get('AUTH_SESSION_KEY_TOKEN')
  }

  get AUTH_SESSION_KEY_USER() {
    return this.get('AUTH_SESSION_KEY_USER')
  }

  get AUTH_URL_LOGIN() {
    return this.get('AUTH_API_PATH_LOGIN')
  }

  get AUTH_URL_USER() {
    return this.get('AUTH_API_PATH_USER')
  }

  get API_URL() {
    return this.get('API_URL')
  }
}
