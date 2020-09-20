import Odontogo from '../src/Sdk/Odontogo'
import OgApi from '../src/Libs/Http/OgApi'
import OgAuth from '../src/Libs/Http/OgAuth'

const config = new Odontogo()

it('[AUTH] Settings.', () => {
  expect(config.AUTH_SESSION_KEY_TOKEN).toMatch('auth.token')
  expect(config.AUTH_SESSION_KEY_USER).toMatch('auth.user')
  expect(config.AUTH_URL_LOGIN).toMatch('auth/login')
  expect(config.AUTH_URL_USER).toMatch('users/current')
})

it('[api] Get the API library.', () => {
  expect(config.api).toBeInstanceOf(OgApi)
})

it('[auth] Get the auth library.', () => {
  expect(config.auth).toBeInstanceOf(OgAuth)
})
