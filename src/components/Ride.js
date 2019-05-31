import React, {useState} from 'react'
import axios from 'axios'
import {Button, Card, CardHeader, CardActions, IconButton, Collapse, Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {Delete ,ExpandMore, Edit} from '@material-ui/icons'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateRide, removeRide, notify} from '../actions'
import EditRideDialog from './EditRideDialog'

const styles = theme => ({
  card: {
    boxShadow: 'none',
    borderRadius: 'none',
    borderBottom: 'thin solid cornflowerblue'
  }
})

const RideComponent = props => {

  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleExpandClick = e => {
    setExpanded(!expanded)
  }

  const handleDeleteClick = e => {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${props.ride.id}`,
      method: 'delete',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      }
    }
    axios(config)
      .then(res => {
        props.removeRide(props.ride)
      })
      .catch(err => {
        props.notify(`cannot delete - ${err.response.data.message}`)
      })
  }

  const updateRide = ({from, to, when, contact}) => {
    const ride = {
      from: from?from:props.ride.from,
      to: to?to:props.ride.to,
      when: when?when:props.ride.when,
      contact: contact?contact:props.ride.contact,
      id: props.ride.id,
      sub: props.ride.sub
    }
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${props.ride.id}`,
      method: 'put',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
      data: ride
    }
    axios(config)
      .then(res => {
        props.updateRide(ride)
      })
      .catch(err => {
        props.notify(`cannot update - ${err.response.data.message}`)
      })
  }

  const isOwner = user => {
    if (user) {
      return user.profile.sub === props.ride.sub
    } else {
      return false
    }
  }

  const {classes} = props
  return (
    <Card className={classes.card}>
      <CardHeader
        title={`${props.ride.from} to ${props.ride.to}`}
        subheader={props.ride.when}/>
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
            disabled={!(isOwner(props.user))}
            onClick={e => setEditing(true)}>
            <Edit/>
          </IconButton>
          <IconButton
            disabled={!(isOwner(props.user))}
            id={`delete`}
            onClick={handleDeleteClick}>
            <Delete/>
          </IconButton>
            {Boolean(props.ride.contact) &&
              <Button href={props.ride.contact}>Contact</Button>
            }
          <EditRideDialog
            open={editing}
            operation='Update'
            ride={props.ride}
            handleClose={e => setEditing(false)}
            submitRide={updateRide}
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
  removeRide: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  updateRide: PropTypes.func.isRequired,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {
  removeRide,
  notify,
  updateRide
}

export const Ride = withStyles(styles)(RideComponent)


export default connect(mapStateToProps, mapDispatchToProps)(Ride)
