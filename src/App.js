import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {UserManager} from 'oidc-client'
import {connect} from 'react-redux'
import {withRouter, Route} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
import Header from './components/Header'
import ErrorMessage from './components/ErrorMessage'
import Callback from './components/Callback'
import {notify} from './actions'
import AuthenticatedUserContext from './AuthenticatedUserContext'

const config = {
  authority: process.env.REACT_APP_ISSUER,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: `${window.origin}/callback`,
  response_type: 'code',
  scope: 'openid rides/create rides/delete rides/update',
  loadUserInfo: false,
  automaticSilentRenew: true
}

export class App extends Component {

  constructor(props) {
      super(props)
      this.userManager =  new UserManager(config)
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
        <Route path='/' render={() =>
          <div>
            <AuthenticatedUserContext.Provider value={this.state.user}>
              <Header userManager={this.userManager}/>
              <Grid container justify='center'>
                <Rides rides={this.state.rides}/>
              </Grid>
            </AuthenticatedUserContext.Provider>
            <ErrorMessage/>
          </div>}
        />
        <Route path='/callback' component={Callback}/>
      </div>
    )}
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default withRouter(connect()(App))
