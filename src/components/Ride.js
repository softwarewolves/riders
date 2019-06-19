import React, {useState} from 'react'
import axios from 'axios'
import {Button, Card, CardHeader, CardActions, IconButton, Collapse, Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {Delete ,ExpandMore, Edit} from '@material-ui/icons'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {refresh, notify} from '../actions'
import EditRideDialog from './EditRideDialog'

const styles = theme => ({
  card: {
    boxShadow: 'none',
    borderRadius: 'none',
    borderBottom: 'thin solid cornflowerblue'
  }
})

const RideComponent = ({ride, classes, refresh, notify, user}) => {

  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleExpandClick = e => {
    setExpanded(!expanded)
  }

  const handleDeleteClick = e => {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${ride.id}`,
      method: 'delete',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      }
    }
    axios(config)
      .then(res => {
        refresh()
      })
      .catch(err => {
        notify(`cannot delete - ${err.response.data.message}`)
      })
  }

  const handleSubmit = ({from, to, when, contact}) => {
    const updatedRide = {
      from: from?from:ride.from,
      to: to?to:ride.to,
      when: when?when:ride.when,
      contact: contact?contact:ride.contact,
      id: ride.id,
      sub: ride.sub
    }
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${updatedRide.id}`,
      method: 'put',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
      data: updatedRide
    }
    axios(config)
      .then(res => {
        refresh()
      })
      .catch(err => {
        notify(`cannot update - ${err.response.data.message}`)
      })
  }

  const isOwner = user => {
    if (user) {
      return user.profile.sub === ride.sub
    } else {
      return false
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        title={`${ride.from} to ${ride.to}`}
        subheader={ride.when}/>
      <CardActions>
        <IconButton
          id="more"
          onClick={handleExpandClick}
        >
          <Typography variant='caption'>
            More
          </Typography>
          <ExpandMore/>
        </IconButton>
      </CardActions>
      <Collapse in={expanded}>
        <CardActions>
          <IconButton
            disabled={!(isOwner(user))}
            onClick={e => setEditing(true)}>
            <Edit/>
          </IconButton>
          <IconButton
            disabled={!(isOwner(user))}
            id={`delete`}
            onClick={handleDeleteClick}>
            <Delete/>
          </IconButton>
            {Boolean(ride.contact) &&
              <Button href={ride.contact}>Contact</Button>
            }
          <EditRideDialog
            open={editing}
            operation='Update'
            ride={ride}
            handleClose={e => setEditing(false)}
            submitRide={handleSubmit}
          />
        </CardActions>
      </Collapse>
    </Card>
  )
}

RideComponent.propTypes = {
  ride: PropTypes.shape({
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {
  refresh,
  notify
}

export const Ride = withStyles(styles)(RideComponent)


export default connect(mapStateToProps, mapDispatchToProps)(Ride)
