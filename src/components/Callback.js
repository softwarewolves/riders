import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

export const Callback = props => {

  props.exchangeCodeForToken()
  props.history.replace('/')
  return (
    <p></p>
  )
}

Callback.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  userManager: PropTypes.shape({
    signinRedirectCallback: PropTypes.func.isRequired,
    clearStaleState: PropTypes.func.isRequired
  })
}

export default withRouter(Callback)
