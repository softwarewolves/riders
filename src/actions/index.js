export const notify = text => ({
  type: 'NOTIFY_ERROR',
  errorMessage: text
})
export const clear = () => ({
  type: 'CLEAR_ERROR'
})
export const resetRides = rides => ({
  type: 'SET',
  rides: rides
})
export const remove = ride => ({
  type: 'REMOVE',
  ride: ride
})
export const add = ride => ({
  type: 'ADD',
  ride: ride
})
export const update = ride => ({
  type: 'UPDATE',
  ride: ride
})
export const showAll = () => ({
  type: 'ALL'
})
export const showMine = sub => ({
  type: 'MINE',
  sub: sub
})
