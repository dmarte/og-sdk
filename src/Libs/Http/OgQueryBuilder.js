import { set, isArray } from 'lodash'
/**
 * Class to build query string to interact
 * with the APIs.
 *
 */
export default class OgQueryBuilder {
  /**
   * @param {Bootstrap} boot
   */
  constructor(boot) {
    this.$query = new URLSearchParams()
    this.$config = boot
  }

  /**
   * Reverse of queryStringToDotNotation
   * @param path
   * @returns {String}
   */
  pathToQueryString(path) {
    return path
      .split('.')
      .map((item, index) => {
        if (index < 1) {
          return item
        }
        return `[${item}]`
      })
      .join('')
  }

  /**
   * Convert this: contact[name][first]
   * To this: contact.name.first
   *
   * @param path
   * @returns {String}
   */
  queryStringToDotNotation(path) {
    return path
      .split('[')
      .map((path) => path.trim().replace(/\W/g, ''))
      .join('.')
  }

  /**
   * Set a given key into the query string path.
   * @param {String} path
   * @param {String} value
   * @returns {OgQueryBuilder}
   */
  where(path, value) {
    if (this.hasQueryString(path)) {
      this.$query.append(this.pathToQueryString(path), value)
      return this
    }
    this.$query.set(this.pathToQueryString(path), value)
    return this
  }

  /**
   * Set an object pagination
   * into the query string.
   *
   * @param {OgPagination} paginator
   * @returns {OgQueryBuilder}
   */
  wherePagination(paginator) {
    const pagination = paginator.toServer()
    Object.keys(pagination).forEach((key) => {
      this.where(key, pagination[key])
    })
    return this
  }

  /**
   * Verify if a given path exists in the query string.
   *
   * @param {String} path
   * @returns {boolean}
   */
  hasQueryString(path) {
    return this.$query.has(this.pathToQueryString(path))
  }

  toString() {
    return this.$query.toString()
  }

  toJSON() {
    const out = {}
    const output = {}
    for (const item of this.$query.entries()) {
      const i = item.shift()
      const key = this.queryStringToDotNotation(i)
      if (out[key]) {
        if (isArray(out[key])) {
          out[key].push(item.pop())
          continue
        }

        out[key] = [out[key]]
        out[key].push(item.pop())
        continue
      }
      out[key] = item.pop()
    }
    Object.keys(out).forEach((path) => {
      set(output, path, out[path])
    })

    return output
  }
}
