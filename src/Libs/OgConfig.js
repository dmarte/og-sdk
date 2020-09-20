import { set, get, isObject } from 'lodash'

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

  all() {
    return this.$items
  }

  fill(attributes) {
    if (!isObject(attributes)) {
      return this
    }
    Object.keys(attributes).forEach((path) => {
      this.set(path, attributes[path])
    })
    return this
  }
}
