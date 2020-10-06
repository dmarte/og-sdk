import Bootstrap from '../../Sdk/Bootstrap'
import OgResponse from './OgResponse'
import OgCookie from './OgCookie'

export default class OgApi {
  /**
   * @param {Bootstrap} config
   */
  constructor(config = new Bootstrap()) {
    this.$config = config
    this.$headers = {}
    this.$response = new OgResponse(config)
    this.$abort = null
  }

  header(key, value) {
    this.$headers[key] = value
    return this
  }

  acceptJson() {
    this.header('Accept', 'application/json')
    return this
  }

  contentTypeJson() {
    this.header('Content-Type', 'application/json')
    return this
  }

  xMLHttpRequest() {
    this.header('X-Requested-With', 'XMLHttpRequest')
    return this
  }

  withCredentials() {
    this.config.set('API_CREDENTIALS', true)
    return this
  }

  withXSRFHeader(token) {
    this.header('X-XSRF-TOKEN', token)
    return this
  }

  withCookeXSRFHeader() {
    const cookie = new OgCookie()
    if (!cookie.has('XSRF-TOKEN')) {
      return this
    }
    this.withXSRFHeader(cookie.get('XSRF-TOKEN'))
    return this
  }

  token(bearerToken) {
    this.header('Authorization', `Bearer ${bearerToken}`)
    return this
  }

  query(data) {
    const params = new URLSearchParams()
    Object.keys(data).forEach((key) => params.set(key, data[key]))
    return params
  }

  /**
   *
   * @param path
   * @param {String|Object} data
   * @param method
   * @param headers
   * @returns {Promise<OgResponse>}
   */
  async request(path, data, method = 'GET', headers = {}) {
    this.$response.clear()
    const url = new URL(this.url(path))

    if (method === 'GET' && data) {
      url.search = this.query(data)
    }

    const resp = await fetch(url, this.settings({ data, method, headers }))
    let responseData = {}
    if (OgResponse.HTTP_NO_CONTENT !== resp.status) {
      responseData = await resp.json()
    }
    this.$response = new OgResponse(
      this.$config,
      responseData,
      resp.status,
      resp.statusText
    )

    if (this.$response.FAILED_BY_SESSION_EXPIRE) {
      this.config.get('AUTH_ON_SESSION_EXPIRE_CALLBACK')(this.$response)
    }
    return this.$response
  }

  post(path, data) {
    return this.request(path, data, 'POST')
  }

  /**
   * @param {String} path
   * @param {String|Object} query
   * @returns {Promise<OgResponse>}
   */
  get(path, query) {
    return this.request(path, query, 'GET')
  }

  url(path = '') {
    return [
      String(this.config.get('API_URL')).replace(/\/$/g, ''),
      String(path).replace(/^\//g, '')
    ].join('/')
  }

  get config() {
    return this.$config
  }

  get response() {
    return this.$response
  }

  get signal() {
    return this.$abort
  }

  abort() {
    if (this.$abort) {
      this.$abort.abort()
      this.$abort = new AbortController()
    }
    return this
  }

  settings(args) {
    if (!args) {
      args = {}
    }
    this.$abort = new AbortController()
    const init = {
      mode: 'cors',
      method: args.method || 'GET',
      headers: {},
      signal: this.$abort.signal
    }
    if (!['GET', 'HEAD'].includes(init.method) && args.data) {
      init.body = JSON.stringify(args.data)
    }

    if (this.config.get('API_CREDENTIALS')) {
      init.credentials = 'include'
    }

    this.withCookeXSRFHeader().acceptJson()

    init.headers = {
      ...this.config.get('API_HEADERS', {}),
      ...this.$headers,
      ...(args.headers || {})
    }

    return init
  }
}
