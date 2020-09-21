import OgSessionStorage from '../OgSessionStorage'
import OgUserResource from '../../Sdk/Resources/OgUserResource'

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
      this.$user = new OgUserResource(this.$api, this.get(this.PATH_USER))
    }
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
    const response = await this.$api.post(this.URL_LOGIN, { email, password })
    if (!response || !response.token) {
      throw new Error(
        `ERROR ${this.$api.$response.status}: Unable to get the token from the server.`,
        this.$api.$response.status
      )
    }
    const { token } = response
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

    const user = await this.$api.get(this.URL_USER)

    if (!this.$api.$response.ok) {
      throw this.$api.$response.message
    }

    this.set(this.PATH_USER, user)

    this.$user = new OgUserResource(this.$api, user)

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
    const Resource = this.USER_RESOURCE
    return this.$user || new Resource(this.$api)
  }

  /**
   * @returns {boolean}
   */
  get guest() {
    return !this.get(this.PATH_USER) || !this.get(this.PATH_TOKEN)
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
