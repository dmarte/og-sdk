import OgAuth from '../src/Libs/Http/OgAuth'
import OgApi from '../src/Libs/Http/OgApi'
import Odontogo from '../src/Sdk/Odontogo'
import OgUserResource from '../src/Sdk/Resources/OgUserResource'
import UserJson from '../json/user'

const config = new Odontogo() // A set of predefined settings
const api = new OgApi(config)
const auth = new OgAuth(api)

it('[auth] Has paths and urls to make requests.', () => {
  expect(auth.URL_USER).toMatch(config.AUTH_URL_USER)
  expect(auth.URL_LOGIN).toMatch(config.AUTH_URL_LOGIN)
  expect(auth.PATH_USER).toMatch(config.AUTH_SESSION_KEY_USER)
  expect(auth.PATH_TOKEN).toMatch(config.AUTH_SESSION_KEY_TOKEN)
})

it('[auth] Set api token through auth', () => {
  auth.token('abc')
  expect(api.$headers.Authorization).toMatch('Bearer abc')
})

it('[auth] Init api token from session', () => {
  auth.set(auth.PATH_TOKEN, 'ABC$$')
  expect(auth.setTokenFromSession()).toBeInstanceOf(OgAuth)
  expect(api.$headers.Authorization).toMatch('Bearer ABC$$')
})

it('[auth] User logout.', () => {
  auth.set(auth.PATH_TOKEN, 'abc')
  auth.set(auth.PATH_USER, { email: 'john.doe@example.com' })
  auth.setTokenFromSession()
  auth.setUserFromSession()

  expect(auth.$api.$headers.Authorization).toMatch('Bearer abc')
  expect(auth.get(auth.PATH_USER)).toBeTruthy()
  expect(auth.$user).toBeInstanceOf(OgUserResource)
  expect(auth.$user.get('email')).toMatch('john.doe@example.com')
  expect(auth.guest).toBeFalsy()

  expect(auth.logout()).toBeInstanceOf(OgAuth)
  expect(auth.$api.$headers.Authorization).toBeUndefined()
  expect(auth.has(auth.PATH_USER)).toBeFalsy()
  expect(auth.get(auth.PATH_USER)).toBeNull()
  expect(auth.$user).toBeNull()
  expect(auth.guest).toBeTruthy()
})

it('[auth] Login user.', async () => {
  jest.mock('../src/Libs/Http/OgApi')
  api.post = jest.fn().mockResolvedValue({ token: 'abc' })
  api.get = jest.fn().mockResolvedValue(UserJson)
  auth.logout()
  expect(auth.guest).toBeTruthy()
  expect(await auth.login('john.doe@example.com', 'secret')).toBeInstanceOf(
    OgAuth
  )
  expect(api.post).toBeCalledTimes(1)
  expect(auth.guest).toBeFalsy()
  expect(auth.$user).toBeInstanceOf(OgUserResource)
})
