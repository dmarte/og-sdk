import OgSessionStorage from '../src/Libs/OgSessionStorage'
const session = new OgSessionStorage()

it('[Session] Engine available.', () => {
  expect(session.engine).toEqual(sessionStorage)
  expect(session.SUPPORTED).toBeTruthy()
})

it('[Session] Set and get value from session.', () => {
  session.set('user.id', 1)
  session.set('user', { name: { first: 'John' } })
  expect(session.get('user.id')).toEqual(1)
  expect(session.get('user')).toMatchObject({ name: { first: 'John' } })
})

it('[Session] Get all items in it.', () => {
  session.set('user', { id: 1 }).set('token', 'abc')
  expect(session.all()).toMatchObject({
    user: { id: 1 },
    token: 'abc'
  })
})

it('[Session] Remove all items on it.', () => {
  session.set('user', { id: 1 }).set('token', 'abc')
  expect(session.all()).toMatchObject({
    user: { id: 1 },
    token: 'abc'
  })
  expect(session.clear().all()).toMatchObject({})
})
