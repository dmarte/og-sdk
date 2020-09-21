import OgConfig from '../Libs/OgConfig'
import OgApi from '../Libs/Http/OgApi'
import OgAuth from '../Libs/Http/OgAuth'
import OgUserResource from '../Sdk/Resources/OgUserResource'

export default class Bootstrap extends OgConfig {
  constructor(options) {
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
    this.set('AUTH_USER_RESOURCE', OgUserResource)
    this.set('AUTH_SESSION_KEY_TOKEN', 'auth.token')
    this.set('AUTH_SESSION_KEY_USER', 'auth.user')
    // Accessors
    this.set('api', new OgApi(this))
    this.set('auth', new OgAuth(this.api))
    this.fill(options)
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

  get AUTH_USER_RESOURCE() {
    return this.get('AUTH.USER_RESOURCE')
  }

  get AUTH_SESSION_KEY_TOKEN() {
    return this.get('AUTH.SESSION_KEY_TOKEN')
  }

  get AUTH_SESSION_KEY_USER() {
    return this.get('AUTH.SESSION_KEY_USER')
  }

  get AUTH_URL_LOGIN() {
    return this.get('AUTH.URL_LOGIN')
  }

  get AUTH_URL_USER() {
    return this.get('AUTH.URL_USER')
  }

  get API_URL() {
    return this.get('API_URL')
  }
}
