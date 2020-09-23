export default class OgLocale {
  /**
   * @param {Bootstrap} config
   * @param {Vue.$i18n} i18n
   */
  constructor(config, i18n) {
    this.$config = config
    this.$i18n = i18n
  }

  trans(path, placeholders = {}) {
    if (!this.exists(path)) {
      return path
    }

    return this.$i18n.t(path, placeholders)
  }

  exists(key) {
    if (!this.$i18n) {
      return false
    }
    return this.$i18n.te(key)
  }
}
