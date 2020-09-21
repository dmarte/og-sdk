import OgCookie from './OgCookie'
import OgResponse from '~/Bxpert/Sdk/src/Libs/Http/OgResponse'
import Bootstrap from '~/Bxpert/Sdk/src/Sdk/Bootstrap'

export default class OgApi {
  /**
   * @param {Bootstrap} config
   */
  constructor(config = new Bootstrap()) {
    this.$config = config
    this.$headers = {}
    this.$response = new OgResponse(config)
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

  async request(path, data = {}, method = 'GET', headers = {}) {
    this.$response.clear()
    const url = this.url(path)
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
    return this.$response
  }

  async post(path, data) {
    return await this.request(path, data, 'POST')
  }

  async get(path, query = {}) {
    return await this.request(path, query, 'GET')
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

  settings(args) {
    if (!args) {
      args = {}
    }

    const init = {
      mode: 'cors',
      method: args.method || 'GET',
      headers: {}
    }
    if (!['GET', 'HEAD'].includes(init.method) && args.data) {
      init.body = JSON.stringify(args.data)
    }

    if (this.config.get('API_CREDENTIALS')) {
      init.credentials = 'include'
    }

    this.withCookeXSRFHeader()

    init.headers = {
      ...this.config.get('API_HEADERS', {}),
      ...this.$headers,
      ...(args.headers || {})
    }

    return init
  }
}
