import OgResource from '../../Libs/Resources/OgResource'
import OgResourceCast from '../../Libs/Resources/OgResourceCast'

/**
 * This resource is used by the following libraries:
 * - auth
 *
 * NOTE: If you rename this class, some of those libraries my not work.
 */
export default class OgUserResource extends OgResource {
  constructor(api, attributes) {
    super(api)
    this.define({
      id: OgResourceCast.TYPE_INTEGER,
      email: OgResourceCast.TYPE_STRING,
      password: OgResourceCast.TYPE_STRING
    })
    this.fill(attributes)
  }

  get username() {
    if (this.filled('username')) {
      return this.get('username')
    }

    const email = this.get('email', 'Username')

    return email.substring(0, email.lastIndexOf('@')).replace(/\W/, '')
  }

  get currency() {
    if (this.filled('currency')) {
      return this.get('currency')
    }
    const option = this.$config.DROPDOWN_CURRENCIES_DATA[0] || {
      value: 'DOP',
      text: ''
    }

    return option.value
  }

  get id() {
    return this.get('id')
  }

  set id(value) {
    this.set('id', value)
  }

  get email() {
    return this.get('email')
  }

  set email(value) {
    this.set('email', value)
  }

  get password() {
    return this.get('password')
  }

  set password(value) {
    this.set('password', value)
  }
}
