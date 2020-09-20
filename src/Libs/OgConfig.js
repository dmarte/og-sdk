import { set, get } from 'lodash'

export default class OgConfig {
  constructor() {
    this.$items = {}
  }

  set(path, value) {
    set(this.$items, path, value)
    return this
  }

  get(path, defaultValue = null) {
    return get(this.$items, path, defaultValue)
  }
}
