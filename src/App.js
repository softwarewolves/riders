import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {Log, UserManager, WebStorageStateStore} from 'oidc-client'
import {connect} from 'react-redux'
import {withRouter, Route} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
import Header from './components/Header'
import AddRideDialog from './components/AddRideDialog'
import ErrorMessage from './components/ErrorMessage'
import Callback from './components/Callback'
import {notify} from './actions'
import AuthenticatedUserContext from './AuthenticatedUserContext'
import RideSharingStore from './helpers/RideSharingStore'

// const log = text => console.log(text)
//
// const logger = {
//     debug: log,
//     info: log,
//     warn: log,
//     error: log
// }
//
// Log.logger = logger

const config = {
  authority: process.env.REACT_APP_ISSUER,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: `${window.origin}/callback`,
  silent_redirect_uri: `${window.origin}/callback`,
  response_type: 'code',
  // ideally, we would like to get access tokens with only the scopes needed for a specific request.
  // Our client library scuppers that plan.
  // The oidc-client's UserManager takes a one-shot scope configuration.
  scope: 'openid rides/create rides/delete rides/update',
  loadUserInfo: false,
  // triggers usermanager to send a request to the token endpoint for new tokens.
  // The request sends form data with:
  // refresh_token: ...
  // grant_type: refresh_token
  // client_id: ...
  // Cognito responds with a new access and ID token. No new refresh token is issued,
  // in spite of advice in the BCP.
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({store: new RideSharingStore()})
}

const listRidesConfig = {
  baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
  url: 'rides',
  method: 'get',
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY
  }
}

export class App extends Component {

  constructor(props) {
      super(props)
      this.userManager =  new UserManager(config)
      this.userManager.getUser()
        .then(user => {
          // if no user is found, oidc-client returns null
          // Rejecting the promise would have been more elegant
          if (user)
            this.setState({
              user: user
            })
          else {
            // here we want to check whether there is a session with the OP.
            // UserManager has a method for this: querySessionStatus.
            // This method sends an authorization request with prompt=none.
            // AWS does not have a problem with prompt=none, but does not support response_type=id_token.
            // It also seems to set the X-Frame-Options header to DENY, although
            // I have not tested sending the Cognito cookie with the request.
            // If X-Frame-Options is always DENY, the usual silent authentication tricks do not work.
          }
        })
        .catch(err => {
          console.log(`no user: ${JSON.stringify(err)}`)
        })
      // Events raised by the user manager:
      // userLoaded: Raised when a user session has been established (or re-established).
      // userUnloaded: Raised when a user session has been terminated.
      // accessTokenExpiring: Raised prior to the access token expiring.
      // accessTokenExpired: Raised after the access token has expired.
      // silentRenewError: Raised when the automatic silent renew has failed.
      // userSignedOut [1.1.0]: Raised when the user's sign-in status at the OP has changed.
      //
      // Register for events.
      this.userManager.events.addSilentRenewError((event) => {
        this.props.dispatch(notify(`cannot silently renew login - ${JSON.stringify(event)}`))
      })
      this.userManager.events.addUserLoaded((event) => {
        this.setState({
          user: event
        })
      })
      this.userManager.events.addUserUnloaded((event) => {
        this.setState({
          user: undefined
        })
      })
      this.userManager.events.addAccessTokenExpiring((event) => {
        console.log('access token expiring - expecting silent renew to be triggered automatically')
      })
      this.userManager.events.addAccessTokenExpired((event) => {
        console.log('access token expired - silent renew failed')
      })
      this.state = {
        rides: [],
        addingRide: false
      }
  }

  listRides = () =>
    axios(listRidesConfig)
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

  componentDidMount() {
    this.listRides()
  }

  openAddRideDialog = event => {
    this.setState({
      addingRide: true
    })
  }

  closeAddRideDialog = event => {
    this.setState({
      addingRide: false
    })
  }

  addRide = ride => {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}`,
      url: `${process.env.REACT_APP_API_STAGE}/rides`,
      method: 'post',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
        'Authorization': `Bearer ${this.state.user.access_token}`
      },
      data: ride
    }
    axios(config)
      .then(
        res => {
          this.listRides()
      })
      .catch(
        error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.props.dispatch(notify(`cannot share ride - ${error.response.data.message}`))
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            this.props.dispatch(notify(`no response to share request`))
          } else {
            // Something happened in setting up the request that triggered an Error
            this.props.dispatch(notify(`cannot share ride - ${error.message}`))
          }
      })
      this.closeAddRideDialog()
  }

  myRides = event => {
    this.setState({
      rides: this.state.rides.filter(ride => ride.sub === this.state.user.profile.sub)
    })
  }

  render() {
    return (
      <div>
        <Route path='/' render={() =>
          <div>
            <AuthenticatedUserContext.Provider value={this.state.user}>
              <Header
                userManager={this.userManager}
                addRide={this.openAddRideDialog}
                myRides={this.myRides}
              />
              <AddRideDialog
                open={this.state.addingRide}
                handleClose={this.closeAddRideDialog}
                addRide={this.addRide}
              />
              <Grid container justify='center'>
                <Rides rides={this.state.rides}/>
              </Grid>
            </AuthenticatedUserContext.Provider>
            <ErrorMessage/>
          </div>}
        />
        <Route path='/callback' render={props => (
          <Callback {...props} userManager={this.userManager}/>
        )}/>
      </div>
    )}
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default withRouter(connect()(App))
