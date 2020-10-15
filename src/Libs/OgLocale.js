export default class OgLocale {
  /**
   * @param {Bootstrap} config
   * @param {Vue.$i18n} i18n
   */
  constructor(config, i18n) {
    this.$config = config
    this.$i18n = i18n
  }

  trans(path, placeholders = {}, defaultValue = null) {
    if (!this.exists(path)) {
      return defaultValue || path
    }

    return this.$i18n.t(path, placeholders)
  }

  choice(path, index = 0, placeholders = {}, defaultValue = null) {
    if (!this.exists(path)) {
      return defaultValue || path
    }

    return this.$i18n.tc(path, index, placeholders)
  }

  exists(key) {
    if (!this.$i18n) {
      return false
    }
    return this.$i18n.te(key)
  }

  get language() {
    if (!this.$i18n) {
      return 'en'
    }
    return this.$i18n.locale || 'en'
  }
}
