import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AuthenticatedUserContext from '../AuthenticatedUserContext'
import {Log} from 'oidc-client'

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

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

class Header extends Component {

  static contextType = AuthenticatedUserContext

  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    }
  }

  login = () => {
    this.props.userManager.signinRedirect()
  }

  logout = () => {
    // the most logical implementation would be
    // this.props.userManager.signoutRedirect()
    // unfortunately this does not work because the query parameters Cognito
    // expects are not sent by oidc-client.
    // Without arguments, as it is being called here, oidc-client sends the
    // id_token in a parameter named id_token_hint.
    // By judiciously adding parameters, it can be arranged to also send state and post_logout_redirect_uri.
    // The latter could have been useful since Cognito expects a parameter `logout_uri` with the same semantics.
    // It also expects the client_id. These will be supplied in the redirect below.
    // But first, we remove the user from the store. If we do not do this, the app will continue
    // to use stored tokens. Since we are self-contained tokens, these are not validated
    // with the issuer and will continue to afford access.
    this.props.userManager.removeUser()
    // redirect the browser to the Cognito logout page. This will cause flicker.
    // Using an iframe is a technique to avoid that, but this is not possible unfortunately
    // since Cognito serves all its responses with X-Frame-Option DENY.
    // In the response to the request below Cognito effectively cancels the browser session
    // by setting the session cookie (cognito) to expire immediately.
    window.location.href = `${process.env.REACT_APP_AS_ENDPOINTS}/logout?client_id=${process.env.REACT_APP_CLIENT_ID}&logout_uri=${window.origin}`
  }

  showMenu = event => {
    this.setState({
      anchorEl: event.currentTarget,
      showMenu: true
    })
  }

  hideMenu = event => {
    this.setState({
      anchorEl: null,
      showMenu: false
    })
  }

  addRide = event => {
    this.props.addRide(event)
    this.hideMenu()
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" onClick={this.showMenu}>
              <MenuIcon />
            </IconButton>
            <Menu open={this.state.showMenu} anchorEl={this.state.anchorEl} onClose={this.hideMenu}>
              <MenuItem onClick={this.addRide}>Add ride</MenuItem>
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ride Sharing
            </Typography>
            <Button color='inherit' onClick={this.context?this.logout:this.login}>
              {this.context?'Logout':'Login'}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  userManager: PropTypes.object.isRequired,
  addRide: PropTypes.func.isRequired
}

export default withStyles(styles)(Header)
