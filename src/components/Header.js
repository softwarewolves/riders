import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AuthenticatedUserContext from '../AuthenticatedUserContext'

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

  login = () => {
    this.props.userManager.signinRedirect()
  }

  logout = () => {
    this.props.userManager.signoutRedirect()
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ride Sharing
            </Typography>
            <Button color='inherit' onClick={this.props.context?this.login:this.logout}>
              {this.props.context?'Logout':'Login'}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.contextType = AuthenticatedUserContext

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  userManager: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
