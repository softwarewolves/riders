const error = (state = {}, action) => {
  switch (action.type) {
    case 'NOTIFY_ERROR':
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      })
    case 'CLEAR_ERROR':
      return {}
    default:
      return state
  }
}

export default error
