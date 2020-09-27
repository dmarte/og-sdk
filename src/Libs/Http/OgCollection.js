import OgPagination from '../OgPagination'
import OgQueryBuilder from './OgQueryBuilder'

export default class OgCollection extends OgQueryBuilder {
  /**
   * @param {OgApi} api
   * @param {OgResource} collector
   * @param {String} path
   */
  constructor(api, collector, path = '/') {
    super(api.config)
    this.$elements = []
    this.$collector = collector
    this.$paginate = new OgPagination(api)
    this.$loading = false
    this.$asDropdown = true
    this.$api = api
    this.$path = path
  }

  async dropdown(key = 'dropdown') {
    this.$asDropdown = true
    this.$loading = true
    const query = this.newQuery().where(key, true)
    const response = await this.$api.get(this.$path, query.toJSON())
    this.$loading = false
    if (response.failed) {
      throw new Error(response.message)
    }

    if (Array.isArray(response.data)) {
      this.setItems(response.data)
    }

    return this
  }

  async paginate(page = 1, perPage) {
    this.$asDropdown = false
    this.$paginate.perPage = perPage
    this.$paginate.currentPage = page
    this.$loading = true
    this.wherePagination(this.$paginate)
    const response = await this.$api.get(this.$path, super.toJSON())
    if (response.meta) {
      this.$paginate.fill(response.meta)
    }
    if (Array.isArray(response.data)) {
      const Resource = this.collector
      this.$elements = response.data.map(
        (item) => new Resource(this.$api, item)
      )
    }
    this.$loading = false
    return this
  }

  toJSON() {
    return {
      meta: this.$paginate.toJSON(),
      items: this.$elements.map((item) => item.toJSON())
    }
  }

  setItems(items = []) {
    const Collector = this.$collector
    this.$elements = items.map((item) => new Collector(this.$api, item))
    return this
  }

  get items() {
    return this.$elements
  }

  get collector() {
    return this.$collector
  }

  set collector(collector) {
    this.$collector = collector
  }

  get paginator() {
    return this.$paginate
  }

  get IS_LOADING() {
    return this.$loading
  }
}
