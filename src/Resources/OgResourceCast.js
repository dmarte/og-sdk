import _ from "lodash";
/**
 * Cast class base for resources.
 * @author Delvi Marte <dmarte@famartech.com>
 */
export default class OgResourceCast {
  /**
   * @param {OgConfig} config
   * @param {*} value
   */
  constructor(config, value) {
    this.$value = value;
    this.$config = config;
  }

  toJSON() {
    return this.$value;
  }

  toString() {
    return this.$value;
  }

  get IS_STRING() {
    return _.isString(this.$value);
  }

  get IS_INTEGER() {
    return _.isInteger(this.$value);
  }

  get IS_DECIMAL() {
    return _.isNumber(this.$value) && this.$value % 1 !== 0;
  }

  static get TYPE_STRING() {
    return "string";
  }

  static get TYPE_INTEGER() {
    return "integer";
  }

  static get TYPE_DECIMAL() {
    return "decimal";
  }

  static get TYPE_BOOLEAN() {
    return "boolean";
  }

  static get TYPE_OBJECT() {
    return "object";
  }

  static get TYPE_ARRAY() {
    return "array";
  }
}
