import OgConfig from '../OgConfig'
import OgCookie from './OgCookie'

export default class OgApi {
  constructor(config = new OgConfig()) {
    this.$config = config
    this.$headers = {}
    this.$response = {
      ok: true,
      message: '',
      status: 200,
      data: {}
    }
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
    const url = this.url(path)
    const resp = await fetch(url, this.settings({ data, method, headers }))

    if (resp.ok) {
      this.$response = {
        ...this.$response,
        ...{
          ok: true,
          message: resp.statusText,
          data: resp.status !== OgApi.HTTP_NO_CONTENT ? await resp.json() : {}
        }
      }
    } else {
      this.$response.ok = false
      this.$response.message = resp.statusText
      this.$response.status = resp.status
      this.$response.data = {}
    }

    return this
  }

  async post(path, data) {
    await this.request(path, data, 'POST')
    return this.$response.data
  }

  async get(path, query = {}) {
    await this.request(path, query, 'GET')
    return this.$response.data
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

  static get HTTP_NO_CONTENT() {
    return 204
  }

  static get HTTP_TOKEN_MISMATCH() {
    return 419
  }
}
