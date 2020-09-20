import OgConfig from '../Libs/OgConfig'

export default class Odontogo extends OgConfig {
  constructor() {
    super()
    this.set('API_URL', process.env.API_URL)
    this.set('AUTH', {
      SESSION_KEY_TOKEN: 'auth.token',
      SESSION_KEY_USER: 'auth.user',
      URL_LOGIN: 'auth/login',
      URL_USER: 'users/current'
    })
  }

  get AUTH_SESSION_KEY_TOKEN() {
    return this.get('AUTH.SESSION_KEY_TOKEN')
  }

  get AUTH_SESSION_KEY_USER() {
    return this.get('AUTH.SESSION_KEY_USER')
  }

  get AUTH_URL_LOGIN() {
    return this.get('AUTH.URL_LOGIN')
  }

  get AUTH_URL_USER() {
    return this.get('AUTH.URL_USER')
  }

  get API_URL() {
    return this.get('API_URL')
  }
}
