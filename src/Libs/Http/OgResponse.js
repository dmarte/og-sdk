import Bootstrap from '~/Bxpert/Sdk/src/Sdk/Bootstrap'

const parseMessageFromData = (data = {}, defaults = '') => {
  if (!data || !data.message) {
    return defaults
  }
  return data.message
}

const parseErrorsFromData = (data = {}) => {
  if (!data || !data.errors) {
    return {}
  }
  const out = {}
  Object.keys(data.errors).forEach((key) => {
    const field = data.errors[key]
    if (!Array.isArray(field)) {
      return
    }
    out[key] = field.shift()
  })
  return out
}

export default class OgResponse {
  /**
   * @param {Bootstrap} bootstrap
   * @param {Object} data
   * @param {Number} status
   * @param {String} message
   */
  constructor(bootstrap, data = {}, status = 200, message = '') {
    this.$status = status
    this.$data = data
    this.$message = message
    this.$feedbacks = parseErrorsFromData(data)
    this.$config = bootstrap
  }

  /**
   * Verify if a given field has an error in the current
   * response.
   *
   * @param {String} field
   * @returns {boolean}
   */
  fail(field) {
    return !!this.$feedbacks[field]
  }

  /**
   * Returns FALSE when field failed in response.
   * Returns NULL when field not exists in response.
   *
   * @param {String} field
   * @returns {null|boolean}
   */
  state(field) {
    if (this.fail(field)) {
      return false
    }
    return null
  }

  /**
   * Get a response error for a given field.
   *
   * @param {String} field
   * @returns {null|String}
   */
  feedback(field) {
    if (!this.fail(field)) {
      return null
    }
    return this.resolveResponseValidationKey(field).message || ''
  }

  clear() {
    this.$status = 200
    this.$data = {}
    this.$message = ''
    this.$feedbacks = {}
    return this
  }

  resolveResponseValidationKey(field) {
    if (!this.fail(field)) {
      return { attribute: null, rule: null, value: null, message: null }
    }
    const key = this.$feedbacks[field]
    // Get the rules
    const rules = String(key)
      .replace('validation.', '')
      .split(',')
    let rule = rules.shift()
    // Any other value should be values separated by /
    const value = String(rules.shift())
      .split('/')
      .map((value) => {
        return this.$config.locale.exists(`attributes.${value.trim()}`)
          ? this.$config.locale.trans(`attributes.${value.trim()}`)
          : value
      })
      .join(', ')
    const attribute = this.$config.locale.exists(`attributes.${field}`)
      ? this.$config.locale.trans(`attributes.${field}`)
      : field
    rule = this.$config.locale.exists(`validation.${rule}`)
      ? this.$config.locale.trans(`validation.${rule}`)
      : rule
    const message = rule
    return { attribute, message, value: value || '' }
  }

  get message() {
    this.$message = this.$config.locale.trans(
      parseMessageFromData(this.$data, this.$message)
    )
    return this.$message
  }

  get messages() {
    return this.$feedbacks
  }

  get failed() {
    return [
      OgResponse.HTTP_TOKEN_MISMATCH,
      OgResponse.HTTP_BAD_REQUEST,
      OgResponse.HTTP_UNAUTHORIZED,
      OgResponse.HTTP_NOT_FOUND,
      OgResponse.HTTP_NO_METHOD_ALLOWED,
      OgResponse.HTTP_REQUEST_TIMEOUT,
      OgResponse.HTTP_SERVER_ERROR,
      OgResponse.HTTP_PAGE_EXPIRED,
      OgResponse.HTTP_UNPROCESSABLE_ENTITY
    ].includes(this.$status)
  }

  get success() {
    return [
      OgResponse.HTTP_OK,
      OgResponse.HTTP_CREATED,
      OgResponse.HTTP_ACCEPTED,
      OgResponse.HTTP_NO_CONTENT,
      OgResponse.HTTP_RESET_CONTENT
    ].includes(this.$status)
  }

  toJSON() {
    return {
      message: this.message,
      status: this.$status,
      data: this.$data
    }
  }

  get data() {
    return this.$data
  }

  get status() {
    return this.$status
  }

  static get HTTP_OK() {
    return 200
  }

  static get HTTP_CREATED() {
    return 201
  }

  static get HTTP_ACCEPTED() {
    return 202
  }

  static get HTTP_NO_CONTENT() {
    return 204
  }

  static get HTTP_RESET_CONTENT() {
    return 205
  }

  static get HTTP_TOKEN_MISMATCH() {
    return 419
  }

  static get HTTP_BAD_REQUEST() {
    return 400
  }

  static get HTTP_UNAUTHORIZED() {
    return 401
  }

  static get HTTP_NOT_FOUND() {
    return 404
  }

  static get HTTP_NO_METHOD_ALLOWED() {
    return 405
  }

  static get HTTP_REQUEST_TIMEOUT() {
    return 408
  }

  static get HTTP_SERVER_ERROR() {
    return 500
  }

  static get HTTP_PAGE_EXPIRED() {
    return 419
  }

  static get HTTP_UNPROCESSABLE_ENTITY() {
    return 422
  }
}
