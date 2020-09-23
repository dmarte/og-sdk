export default class OgPagination {
  /**
   * @param {Bootstrap} config
   * @param {Object} attributes
   */
  constructor(config, attributes = {}) {
    this.$config = config
    this.$meta = {
      perPage: this.PER_PAGE,
      currentPage: 1,
      lastPage: 1,
      from: 0,
      to: 0,
      total: 0
    }
    this.fill(attributes)
  }

  fill(meta) {
    this.$meta.perPage = this.getPerPageFromMeta(meta)
    this.$meta.currentPage = this.getCurrentPageFromMeta(meta)
    this.$meta.lastPage = this.getLastPageFromMeta(meta)
    this.$meta.total = meta.total || 0
    this.$meta.from = meta.from || 0
    this.$meta.to = meta.to || 0
    return this
  }

  getLastPageFromMeta(meta) {
    return meta.lastPage || meta.last_page || this.$meta.lastPage
  }

  getPerPageFromMeta(meta) {
    return meta.perPage || meta.per_page || this.PER_PAGE
  }

  getCurrentPageFromMeta(meta) {
    return (
      meta.currentPage ||
      meta.current_page ||
      meta.page ||
      this.$meta.currentPage
    )
  }

  toServer() {
    return {
      page: this.$meta.currentPage,
      per_page: this.$meta.perPage
    }
  }

  toString() {
    return this.$config.locale.trans('Your are seeing amount pages', this.$meta)
  }

  toJSON() {
    return this.$meta
  }

  get perPage() {
    return this.$meta.perPage
  }

  set perPage(value) {
    if (!value) {
      this.$meta.perPage = this.PER_PAGE
    }
    this.$meta.perPage = parseInt(value) || OgPagination.DEFAULT_PER_PAGE
  }

  get currentPage() {
    return this.$meta.currentPage
  }

  set currentPage(value) {
    if (!value) {
      return
    }
    this.$meta.currentPage = parseInt(value) || 0
  }

  get lastPage() {
    return this.$meta.lastPage
  }

  set lastPage(value) {
    this.$meta.lastPage = parseInt(value)
  }

  get from() {
    return this.$meta.from
  }

  set from(value) {
    this.$meta.from = parseInt(value) || 0
  }

  get to() {
    return this.$meta.to
  }

  set to(value) {
    this.$meta.to = parseInt(value)
  }

  get PER_PAGE() {
    return this.$config.COLLECTION_PER_PAGE || OgPagination.DEFAULT_PER_PAGE
  }

  static get DEFAULT_PER_PAGE() {
    return 15
  }
}
