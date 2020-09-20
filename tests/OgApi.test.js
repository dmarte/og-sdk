import Api from '../src/Libs/Http/OgApi'
import Config from '../src/Libs/OgConfig'
import DocumentJson from '../json/document'

const config = new Config()
config.set('API_URL', 'https://kw3dd.csb.app/')

const api = new Api(config)

it('Test headers', () => {
  api.acceptJson()
  api.contentTypeJson()
  api.token('ABC')
  expect(api.$headers.Accept).toBeDefined()
  expect(api.$headers['Content-Type']).toBeDefined()
  expect(api.$headers.Authorization).toBeDefined()
  expect(api.$headers.Authorization).toMatch(`Bearer ABC`)
})

it('Test URL path', () => {
  expect(api.url('json/document.json')).toBe(
    [config.get('API_URL'), 'json/document.json'].join('/')
  )
})

it('Test get request', async () => {
  jest.mock('../src/Libs/Http/OgApi')
  api.get = jest.fn().mockResolvedValue(DocumentJson)
  const data = await api.get('json/document.json')
  expect(data).toEqual(DocumentJson)
})
