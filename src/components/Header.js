import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RideSharingMenu from './RideSharingMenu'
import {} from '../actions'

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

const Header = props => {

  const isLoggedIn = () => (
    Boolean(props.user)
  )
  const login = () => {}
  const logout = () => {}
  const {classes} = props
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <RideSharingMenu/>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Ride Sharing
          </Typography>
          <Button color='inherit' onClick={isLoggedIn()?logout:login}>
            {isLoggedIn()?'Logout':'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header))
