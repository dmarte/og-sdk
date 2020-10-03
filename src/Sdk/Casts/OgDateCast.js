import { DateTime } from 'luxon'
import OgResourceCast from '../../Libs/Resources/OgResourceCast'

export default class OgDateCast extends OgResourceCast {
  constructor(config, value) {
    super(config, value)
    this.$format = DateTime.DATETIME_SHORT
  }

  get raw() {
    return this.$value
  }

  toString() {
    if (!this.$value) {
      return ''
    }
    return DateTime.local(super.toString())
      .setLocale(this.$config.language)
      .toLocaleString(this.$format)
  }
}
