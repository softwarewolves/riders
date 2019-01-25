export const notify = text => ({
  type: 'NOTIFY_ERROR',
  errorMessage: text
})
export const clear = () => ({
  type: 'CLEAR_ERROR'
})
