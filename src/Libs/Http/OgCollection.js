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
    this.$paginate = new OgPagination(api.config)
    this.$loading = false
    this.$asDropdown = true
    this.$api = api
    this.$path = path
  }

  async dropdown(search = '', key = 'dropdown') {
    this.$asDropdown = true
    this.$loading = true
    const query = this.newQuery().where(key, true)
    const q = this.toQueryString()
    Object.keys(q).forEach((k) => {
      query.where(this.queryStringToDotNotation(k), q[k])
    })
    if (search) {
      query.whereQuery(search)
    }
    const response = await this.$api.get(this.$path, query.toQueryString())
    if (response.failed) {
      this.$loading = false
      throw new Error(response.message)
    }

    if (Array.isArray(response.data)) {
      this.setItems(response.data)
    }

    this.$loading = false
    return this
  }

  reset() {
    super.reset()
    this.$loading = false
    this.$asDropdown = false
    this.paginator.reset()
    return this
  }

  async paginate(page = 1, perPage = 15, sortBy = 'id', sortDesc = true) {
    this.$asDropdown = false
    this.$paginate.perPage = perPage
    this.$paginate.currentPage = page
    this.$loading = true
    this.wherePagination(this.$paginate).sortBy(sortBy, sortDesc)
    const response = await this.$api.get(this.$path, super.toQueryString())
    if (response.failed) {
      throw new Error(response.message)
    }
    if (response.data.meta) {
      this.$paginate.fill(response.data.meta)
    }
    if (Array.isArray(response.data.data)) {
      const Resource = this.collector
      this.$elements = response.data.data.map(
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

  add(item) {
    const Collector = this.$collector
    this.$elements.push(new Collector(this.$api, item))
    return this
  }

  get length() {
    return this.items.length
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

  get IS_EMPTY() {
    return !this.$loading && this.length < 1
  }
}
