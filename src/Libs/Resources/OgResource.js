import { set, get, isObject } from 'lodash'
import OgResourceCast from './OgResourceCast'
import OgPagination from '~/Bxpert/Sdk/src/Libs/OgPagination'
import OgQueryBuilder from '~/Bxpert/Sdk/src/Libs/Http/OgQueryBuilder'

const getCastValue = (config, key, casts = {}, value = null) => {
  if (!casts[key]) {
    return value
  }

  const type = casts[key]

  if (OgResourceCast.isPrototypeOf(type) || OgResource.isPrototypeOf(type)) {
    return new type(config, value)
  }

  let output

  switch (type) {
    case 'boolean':
      output = value ? Boolean(value) : false
      break
    case 'string':
      output = value ? String(value) : ''
      break
    case 'integer':
      output = parseInt(value, 10) || 0
      break
    case 'decimal':
      output = parseFloat(value) || 0.0
      break
    default:
      output = value
      break
  }

  return output
}

/**
 * Base class to interact with an entity
 * on the API.
 * @author Delvi Marte <dmarte@famartech.com>
 */
export default class OgResource extends OgQueryBuilder {
  /**
   * @param {OgApi} api
   * @param {Object} attributes
   * @param {String} path String path used to fetch to the API.
   */
  constructor(api, attributes = {}, path = '') {
    super(api.config)
    this.$api = api
    this.$fillable = []
    this.$casts = {}
    this.$attributes = {}
    this.$path = path || '/'
    this.fill(attributes)
  }

  /**
   * Used to define a set of attributes
   * to be casted.
   *
   * @param {Object} casts
   * @returns {OgResource}
   */
  define(casts = {}) {
    Object.keys(casts).forEach((path) => {
      this.cast(path, casts[path])
    })
    return this
  }

  /**
   * Set an attribute to be casted to given type.
   *
   * NOTE: When you cast a vaiue, this means tha
   * value should be fillable by the resource.
   * The SDK will automatically set the pat as fillable.
   *
   * @param {String} path
   * @param {*} type
   * @returns {OgResource}
   */
  cast(path, type) {
    this.$casts[path] = type
    this.fillable(path)
    return this
  }

  /**
   * Define a path of a given resource
   * as fillable.
   *
   * @param {String} path
   * @returns {OgResource}
   */
  fillable(path) {
    this.$fillable.push(path)
    return this
  }

  /**
   * Fill a set of attributes.
   *
   * @param {Object} attributes
   * @returns {OgResource}
   */
  fill(attributes) {
    this.$fillable.forEach((path) => {
      const value = get(attributes, path, null)
      if (!value) {
        return
      }
      this.set(path, value)
    })
    return this
  }

  set(path, value) {
    if (!this.$fillable.includes(path)) {
      return this
    }
    set(
      this.$attributes,
      path,
      getCastValue(this.$api.config, path, this.$casts, value)
    )
    return this
  }

  get(path, defaultValue = null) {
    const value = get(this.$attributes, path, defaultValue)
    if (!value) {
      const schema = this.SCHEMA
      return get(schema, path, defaultValue)
    }
    return value
  }

  /**
   * Determine whether or not a given path
   * has a value.
   *
   * NOTE:
   * A path with a value NULL is considered
   * not filled.
   *
   * @param {String} path
   * @returns {boolean}
   */
  filled(path) {
    return get(this.$attributes, path, null) !== null
  }

  toJSON() {
    const out = {}
    Object.keys(this.$casts).forEach((path) => {
      set(out, path, this.get(path))
    })

    return out
  }

  get ATTRIBUTES() {
    return this.$attributes
  }

  get SCHEMA() {
    const schema = {}
    Object.keys(this.$casts).forEach((path) => {
      set(schema, path, getCastValue(this.$api.config, path, this.$casts, null))
      const value = get(schema, path)
      if (isObject(value) && value instanceof OgResource) {
        set(schema, path, value.SCHEMA)
      }
    })
    return schema
  }
}
