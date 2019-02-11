import RideSharingStore from '../helpers/RideSharingStore'

describe('RideSharingStore', () => {

  let store

  beforeAll(() => {
    store = new RideSharingStore()
  })

  it('is initially empty', () => {
    expect(store.length).toBe(0)
  })

  it('returns the value set with a key', () => {
    store.setItem('foo', 'bar')
    expect(store.getItem('foo')).toEqual('bar')
  })

  it('overwrites the original value', () => {
    store.setItem('foo', 'bar')
    expect(store.getItem('foo')).toEqual('bar')
    expect(store.length).toBe(1)
    store.setItem('foo', 'baz')
    expect(store.getItem('foo')).toEqual('baz')
    expect(store.length).toBe(1)
  })

  it('removeItem removes a key-value pair', () => {
    store.setItem('foo', 'bar')
    expect(store.getItem('foo')).toEqual('bar')
    expect(store.length).toBe(1)
    store.removeItem('foo')
    expect(store.length).toBe(0)
    expect(store.getItem('foo')).toBeUndefined()
  })

  it('key with an out of bound index returns undefined', () => {
    expect(store.key(0)).toBeUndefined()
  })

  it('key returns the key at the specified index', () => {
    store.setItem('foo', 'bar')
    expect(store.key(0)).toEqual('foo')
  })

})
