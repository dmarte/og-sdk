import { isFunction } from 'lodash'
import OgSessionStorage from '../OgSessionStorage'
import OgUserResource from '../../Sdk/Resources/OgUserResource'
import OgResponse from './OgResponse.js'
import OgCookie from './OgCookie'
/**
 * @property {OgApi} $api
 */
export default class OgAuth extends OgSessionStorage {
  /**
   * @param {OgApi} api
   */
  constructor(api) {
    super()
    this.$api = api
    this.$user = null
    this.$response = new OgResponse(api.config)
    this.$cookie = new OgCookie()
    this.setTokenFromSession()
    this.setUserFromSession()
  }

  setTokenFromSession() {
    if (this.has(this.PATH_TOKEN)) {
      this.token(this.get(this.PATH_TOKEN))
    }
    return this
  }

  setUserFromSession() {
    if (this.has(this.PATH_USER)) {
      this.$user = new this.USER_RESOURCE(this.$api, this.get(this.PATH_USER))
    }
    return this
  }

  async loginWithSanctum(email, password) {
    await this.logout()
    // Get the cookie
    await this.$api.get('/sanctum/csrf-cookie')

    this.$api.withCredentials()
    this.$api.withCookeXSRFHeader()

    this.$response = await this.$api.post(this.URL_LOGIN, { email, password })
    if (this.$response.failed) {
      throw new Error(this.$response.message)
    }
    await this.fetchUser()
    return this
  }

  /**
   * Create a session for a given user credentials.
   *
   * @param {String} email
   * @param {String} password
   * @returns {Promise<OgAuth>}
   */
  async login(email, password) {
    await this.logout()
    this.$api.acceptJson().contentTypeJson()
    this.$response = await this.$api.post(this.URL_LOGIN, { email, password })
    if (this.$response.failed) {
      throw new Error(this.$response.message)
    }
    const { token } = this.$response.data
    this.set(this.PATH_TOKEN, token)
    this.token(token)
    await this.fetchUser()
    return this
  }

  /**
   * Fetch the user from the API
   * or get from the current session.
   *
   * @returns {Promise<OgUserResource>}
   */
  async fetchUser() {
    if (this.$user instanceof OgUserResource) {
      return this.$user
    }

    if (this.has(this.PATH_USER)) {
      this.setUserFromSession()
      return this.$user
    }

    this.$response = await this.$api.get(this.URL_USER)

    if (this.$response.failed) {
      throw new Error(this.$response.message)
    }

    this.set(this.PATH_USER, this.$response.data)

    this.$user = new this.USER_RESOURCE(this.$api, this.$response.data)

    return this.$user
  }

  /**
   * This method is used to set the token
   * in the API to be able to make requests
   * that require authentication.
   *
   * @param {String} token
   * @returns {OgAuth}
   */
  token(token) {
    this.$api.token(token)
    return this
  }

  logout() {
    this.clear()
    this.$cookie.clear()
    this.$user = null
    delete this.$api.$headers.Authorization
    return this
  }

  /**
   *  This method let you change
   *  the default user resource used by the
   *  auth provider.
   *
   * @param {OgResource} resource
   * @returns {OgAuth}
   */
  use(resource) {
    this.set('AUTH_USER_RESOURCE', resource)
    return this
  }

  /**
   * Get current authenticated user
   * or empty user instance.
   *
   * @returns {OgUserResource|OgResource}
   */
  get user() {
    const Resource = this.USER_RESOURCE || OgUserResource

    if (this.$user) {
      return this.$user
    }
    if (!isFunction(Resource)) {
      return new OgUserResource()
    }

    return new Resource(this.$api)
  }

  get response() {
    return this.$response
  }

  /**
   * @returns {boolean}
   */
  get guest() {
    if (this.get(this.PATH_USER)) {
      return false
    }

    return !this.get(this.PATH_TOKEN)
  }

  get USER_RESOURCE() {
    return this.$api.config.get('AUTH_USER_RESOURCE', OgUserResource)
  }

  get URL_LOGIN() {
    return this.$api.config.get('AUTH_API_PATH_LOGIN')
  }

  get URL_USER() {
    return this.$api.config.get('AUTH_API_PATH_USER')
  }

  get PATH_TOKEN() {
    return this.$api.config.get('AUTH_SESSION_KEY_TOKEN')
  }

  get PATH_USER() {
    return this.$api.config.get('AUTH_SESSION_KEY_USER')
  }
}
