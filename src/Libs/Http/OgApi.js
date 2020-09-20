import OgConfig from '../OgConfig'

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

  token(bearerToken) {
    this.header('Authorization', `Bearer ${bearerToken}`)
    return this
  }

  async request(path, data = {}, method = 'GET', headers = {}) {
    const resp = await fetch(this.url(path), {
      method,
      headers: {
        ...this.config.API_HEADERS,
        ...headers
      },
      body: JSON.stringify(data)
    })

    if (resp.ok) {
      this.$response = {
        ...this.$response,
        ...{
          ok: true,
          message: resp.statusText,
          data: await resp.json()
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

  async get(path, query) {
    await this.request(path, query, 'GET')
    return this.$response.data
  }

  url(path) {
    return [this.config.API_URL, path].join('/')
  }

  get config() {
    return this.$config
  }
}
