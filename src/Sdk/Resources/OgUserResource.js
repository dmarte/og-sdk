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

  get id() {
    return this.get('id')
  }

  set id(value) {
    this.set('id', value)
  }

  get email() {
    this.get('email')
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
