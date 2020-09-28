import { set, get, isObject } from 'lodash'
import OgResourceCast from './OgResourceCast'
import OgQueryBuilder from '~/Bxpert/Sdk/src/Libs/Http/OgQueryBuilder'
import OgResponse from '~/Bxpert/Sdk/src/Libs/Http/OgResponse'

const getCastValue = (api, key, casts = {}, value = null) => {
  if (!casts[key]) {
    return value
  }

  const Type = casts[key]

  if (OgResourceCast.isPrototypeOf(Type)) {
    return new Type(api.config, value)
  }

  if (OgResource.isPrototypeOf(Type)) {
    return new Type(api, value)
  }

  let output

  switch (Type) {
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
    this.$response = new OgResponse(api.config)
    this.$primaryKey = 'id'
    this.$fillable = []
    this.$casts = {}
    this.$attributes = {}
    this.$status = {
      updating: false,
      fetching: false,
      creating: false,
      deleting: false
    }
    this.$path = path || '/'
    this.fill(attributes)
  }

  async findOrFail(id) {
    if (!id) {
      return this
    }
    this.$api.abort()
    this._statusReset()
    this.$response.clear()
    this.$status.fetching = true
    const url = [this.$path, id].join('/')
    this.$response = await this.$api.get(url)
    if (this.$response.failed) {
      this.$status.fetching = false
      throw new Error(this.$response.message)
    }
    this._statusReset()
    this.fill(this.$response.data)
    return this
  }

  async create() {
    this.$api.abort()
    this._statusReset()
    this.$response.clear()
    this.$status.creating = true
    this.$response = await this.$api.post(this.$path, this.toJSON())
    if (this.$response.failed) {
      this._statusReset()
      throw new Error(this.$response.message)
    }
    this.fill(this.$response.data)
    this.$status.creating = false
    return this
  }

  async update() {
    this.$api.abort()
    this._statusReset()
    this.$response.clear()
    this.$status.updating = true
    const url = [this.$path, this.primaryKeyValue].join('/')
    this.$response = await this.$api.post(url, {
      ...this.toJSON(),
      _method: 'PUT'
    })
    if (this.$response.failed) {
      this._statusReset()
      throw new Error(this.$response.message)
    }
    this.fill(this.$response.data)
    this._statusReset()
    return this
  }

  async save() {
    if (this.primaryKeyValue) {
      return await this.update()
    }

    return await this.create()
  }

  fail(path) {
    return this.$response.fail(path)
  }

  state(path) {
    return this.$response.state(path)
  }

  feedback(path) {
    return this.$response.feedback(path)
  }

  _statusReset() {
    this.$status.creating = false
    this.$status.updating = false
    this.$status.deleting = false
    this.$status.fetching = false
    return this
  }

  reset() {
    this.$response.clear()
    this.$attributes = this.SCHEMA
  }

  abort() {
    this.$api.abort()
    this._statusReset()
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
    this.$attributes = this.SCHEMA
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
    if (!attributes) {
      return this
    }
    this.$fillable.forEach((path) => {
      const value = get(attributes, path, null)
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
      getCastValue(this.$api, path, this.$casts, value)
    )
    return this
  }

  get(path, defaultValue = null) {
    return get(this.$attributes, path, defaultValue)
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

  get primaryKeyValue() {
    return this.get(this.$primaryKey)
  }

  get FAILED_BY_SESSION_EXPIRE() {
    return this.$response.FAILED_BY_SESSION_EXPIRE
  }

  get FAILED_MESSAGE() {
    return this.$response.message
  }

  get FAILED_CODE() {
    return this.$response.status
  }

  get FAILED() {
    return this.$response.failed
  }

  get IS_SAVING() {
    return this.$status.creating || this.$status.updating || false
  }

  get IS_CREATING() {
    return this.$status.creating
  }

  get IS_UPDATING() {
    return this.$status.updating
  }

  get IS_FETCHING() {
    return this.$status.fetching
  }

  get IS_DELETING() {
    return this.$status.deleting
  }

  get ATTRIBUTES() {
    return this.$attributes
  }

  get SCHEMA() {
    const schema = {}
    Object.keys(this.$casts).forEach((path) => {
      set(schema, path, getCastValue(this.$api, path, this.$casts, null))
      const value = get(schema, path)
      if (isObject(value) && value instanceof OgResource) {
        set(schema, path, value.SCHEMA)
      }
    })
    return schema
  }
}
