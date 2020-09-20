import Odontogo from '../src/Sdk/Odontogo'

const config = new Odontogo()

it('[AUTH] Settings.', () => {
  expect(config.AUTH_SESSION_KEY_TOKEN).toMatch('auth.token')
  expect(config.AUTH_SESSION_KEY_USER).toMatch('auth.user')
  expect(config.AUTH_URL_LOGIN).toMatch('auth/login')
  expect(config.AUTH_URL_USER).toMatch('users/current')
})
