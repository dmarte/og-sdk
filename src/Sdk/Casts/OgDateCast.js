import { DateTime } from 'luxon'
import OgResourceCast from '../../Libs/Resources/OgResourceCast'

export default class OgDateCast extends OgResourceCast {
  constructor(config, value) {
    super(config, null)
    this.$value = value ? DateTime.fromISO(value) : DateTime.utc()
    this.$format = DateTime.DATETIME_MED
  }

  get date() {
    return this.$value.toJSDate()
  }

  set date(value) {
    this.$value = DateTime.fromJSDate(value)
  }

  get empty() {
    return !this.$value
  }

  get formatted() {
    if (!this.$value.isValid) {
      return ''
    }
    return this.$value
      .setLocale(this.$config.language)
      .toLocaleString({ ...this.$format, hour12: true })
  }

  toString() {
    if (this.empty) {
      return ''
    }

    return this.$value.toSQL()
  }
}
