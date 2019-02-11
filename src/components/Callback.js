import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {notify} from '../actions'

export class Callback extends React.Component {
  componentDidMount() {
    this.props.userManager.signinRedirectCallback(window.location)
      .then(user => {
      })
      .catch(error => {
        this.props.dispatch(notify(`Login failed - ${error}`))
      })
      // I would have liked to use `finally` here, but some pretty mainstream
      // browsers do not support it yet. Neither does Node 8.12.
      this.props.userManager.clearStaleState()
      this.stripCode()
  }

  stripCode = () => {
    this.props.history.replace('/')
  }

  render() {
    return (
      <p></p>
    );
  }
}

Callback.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  userManager: PropTypes.shape({
    signinRedirectCallback: PropTypes.func.isRequired,
    clearStaleState: PropTypes.func.isRequired
  })
}

export default withRouter(connect()(Callback));
