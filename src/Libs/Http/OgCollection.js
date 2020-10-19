import _ from 'lodash'
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
    this.scope()
  }

  abort() {
    this.$api.abort()
  }

  reset() {
    super.reset()
    this.$loading = false
    this.$asDropdown = false
    this.paginator.reset()
    this.scope()
    return this
  }

  /**
   * @param {String} primaryKeyValue
   * @returns {OgResource|null}
   */
  findByPrimaryKey(primaryKeyValue) {
    const resource = this.items.find(
      (item) => item.primaryKeyValue === primaryKeyValue
    )
    if (!resource) {
      return new this.$collector(this.$api)
    }

    return resource
  }

  /**
   * @returns {OgResource}
   */
  first() {
    return this.items[0] || new this.$collector(this.$api)
  }

  /**
   * @param {OgResource} resource
   * @returns {Promise<OgCollection>}
   */
  async deleteFromResource(resource) {
    await resource.delete()
    if (resource.$response.failed) {
      throw new Error(resource.$response.message)
    }
    this.remove(resource)
    return this
  }

  /**
   * @param {String} search
   * @param {String} key
   * @returns {Promise<OgCollection>}
   */
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

  /**
   * @param {String} query
   * @returns {Promise<OgCollection>}
   */
  async paginateFromQuery(query) {
    if (!query) {
      query = {}
    }
    const perPage = query.perPage || this.paginator.perPage
    const currentPage = query.currentPage || this.paginator.currentPage
    const sortBy = query.sortBy || 'id'
    const sortDesc = query.sortDesc === 'true' || false
    await this.paginate(currentPage, perPage, sortBy, sortDesc)
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
      this.reset()
      const Resource = this.collector
      this.$elements = response.data.data.map(
        (item) => new Resource(this.$api, item)
      )
    }
    this.$loading = false
    return this
  }

  /**
   * This option let you remove a resource from
   * the given collection.
   *
   * @param {OgResource} item
   * @returns {boolean}
   */
  remove(item) {
    const index = this.$elements.findIndex(
      ({ primaryKeyValue }) => primaryKeyValue === item.primaryKeyValue
    )
    if (index < 0) {
      return false
    }
    this.$elements.splice(index, 1)
    return true
  }

  /**
   * Set the amount of items per page
   * to reach.
   *
   * @param {Number} value
   * @returns {OgCollection}
   */
  perPage(value) {
    this.paginator.perPage = value
    return this
  }

  /**
   * Defined method to predefine
   * some where conditions
   * to always be present on each request
   * made by the collection.
   * @return {OgCollection}
   */
  scope() {}

  /**
   * Get a { value, text } object from the list
   * useful to be used for dropdown or select forms.
   *
   * @param {String} pathText
   * @param {String} pathValue
   * @returns {{text, value: *}[]}
   */
  pluck(pathText, pathValue) {
    return this.items.map((item) => {
      return {
        value: _.get(item, pathValue || 'id', null),
        text: _.get(item, pathText || 'text', null)
      }
    })
  }

  toJsonItems() {
    return this.$elements.map((item) => item.toJSON())
  }

  toJSON() {
    return {
      meta: this.$paginate.toJSON(),
      items: this.toJsonItems()
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
    return this.length < 1
  }
}
