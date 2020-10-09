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

  reset() {
    this.$query = new URLSearchParams()
    return this
  }

  /**
   * @returns {OgQueryBuilder}
   */
  newQuery() {
    return new OgQueryBuilder(this.$config)
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
   * @param {String|Number|Boolean} value
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
   * Set a general query filter.
   *
   * @param {String} value
   * @returns {OgQueryBuilder}
   */
  whereQuery(value) {
    if (!value) {
      return this
    }
    this.where('q', value)
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
   * Let us set the sort direction of column.
   *
   * @param {String} path
   * @param {Boolean} desc
   * @returns {OgQueryBuilder}
   */
  sortBy(path, desc = false) {
    this.where('sort_by', path)
    this.where('sort_desc', desc)
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

  getQueryString(path) {
    const query = this.toQueryString()
    const parts = [`${path}?`]
    Object.keys(query).forEach((key) => {
      parts.push(`${key}=${query[key]}`)
    })
    return parts.join('&')
  }

  toQueryString() {
    const out = {}
    for (const key of this.$query.keys()) {
      const values = this.$query.getAll(key)
      if (values.length > 1) {
        values.forEach((val, index) => {
          out[`${key}[${index}]`] = val
        })
        continue
      }
      out[key] = values.pop()
    }
    return out
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
