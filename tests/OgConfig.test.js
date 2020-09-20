import OgConfig from '../src/Libs/OgConfig'

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

it('Fills the config with a set.', () => {
  config.fill({ DEMO: 'John' })
  expect(config.get('DEMO')).toMatch('John')
})

it('All items', () => {
  config.fill({ a: 1, b: 1 })
  expect(config.all()).toMatchObject({ a: 1, b: 1 })
})
