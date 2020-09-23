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
    this.$api = api
    this.$path = path
  }

  async paginate(page = 1, perPage) {
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
