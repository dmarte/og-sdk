import OgConfig from "../OgConfig";

export default class OgApi {
  constructor(config = new OgConfig()) {
    this.$config = config;
    this.$headers = {};
    this.$response = {
      ok: true,
      message: "",
      status: 200,
      data: {}
    };
  }

  async request(path, data = {}, method = "GET", headers = {}) {
    const resp = await fetch(this.url(path), {
      method,
      headers: {
        ...this.config.API_HEADERS,
        ...headers
      },
      body: JSON.stringify(data)
    });

    if (resp.ok) {
      this.$response = {
        ...this.$response,
        ...{
          ok: true,
          message: resp.statusText,
          data: await resp.json()
        }
      };
    } else {
      this.$response.ok = false;
      this.$response.message = resp.statusText;
      this.$response.status = resp.status;
      this.$response.data = {};
    }

    return this;
  }

  async post(path, data) {
    return await this.request(path, data, "POST");
  }

  async get(path, query) {
    return await this.request(path, query, "GET");
  }

  url(path) {
    return [this.config.API_URL, path].join("/");
  }

  get config() {
    return this.$config;
  }
}
