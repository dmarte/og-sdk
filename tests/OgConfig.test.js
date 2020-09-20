import OgConfig from '../src/OgConfig'

const config = new OgConfig()

it('Has default settings', () => {
  expect(config).toBeInstanceOf(OgConfig)
  expect(config.$items).toBeDefined()
  expect(config.$items).toMatchObject({
    API_URL: ''
  })
})

it('Has app settings getters.', () => {
  expect(config.API_URL).toBeDefined()
})

it('Setters and getters works.', () => {
  config.set('APP_NAME', 'Demo')
  expect(config.get('APP_NAME')).toMatch('Demo')
})
