import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {connect} from 'react-redux'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
import ErrorMessage from './components/ErrorMessage'
import {notify} from './actions'


export class App extends Component {

  constructor(props) {
      super(props)
      this.state = {
        rides: []
      }
  }

  componentDidMount() {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: 'rides',
      method: 'get',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    }
    axios(config)
      .then(
        (res) => {
          this.setState({
            rides: res.data
          })
      })
      .catch(
        (err) => {
          this.props.dispatch(notify(`cannot retrieve rides - ${err}`))
      })
  }

  render() {
    return (
      <div>
        <Grid container justify='center'>
          <Rides rides={this.state.rides}/>
        </Grid>
        <ErrorMessage/>
      </div>
    )}
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default connect()(App)
