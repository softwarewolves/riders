export default class RideSharingStore {
  constructor() {
    this._map = new Map()
  }

  get length() {
    return this._map.size
  }

  setItem = (key, value) => {
    this._map.set(key, value)
    return this
  }

  getItem = key => this._map.get(key)

  removeItem = key => {
    this._map.delete(key)
    return this
  }

  // terribly inefficient implementation. Consider it a PoC
  key = idx => {
    if (idx >= this._map.size) return
    const keys = Array.from(this._map.keys())
    return keys[idx]
  }
}
