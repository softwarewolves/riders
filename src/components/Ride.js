import React, {Component} from 'react'
import axios from 'axios'
import {Button, Card, CardHeader, CardActions, IconButton, Collapse, Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {Delete ,ExpandMore, Edit} from '@material-ui/icons'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {update, remove, notify} from '../actions'
import EditRideDialog from './EditRideDialog'

const styles = theme => ({
  card: {
    boxShadow: 'none',
    borderRadius: 'none',
    borderBottom: 'thin solid cornflowerblue'
  }
})

class RideComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      editing: false
    }
  }

  handleExpandClick = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  handleDeleteClick = e => {
    console.log('deleting')
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${this.props.ride.id}`,
      method: 'delete',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      }
    }
    axios(config)
      .then(res => {
        console.log('delete succeeded')
        this.props.remove(this.props.ride)
      })
      .catch(err => {
        console.log('delete failed')
        this.props.notify(`cannot delete - ${err.response.data.message}`)
      })
  }

  updateRide = ({from, to, when, contact}) => {
    const ride = {
      from: from?from:this.props.ride.from,
      to: to?to:this.props.ride.to,
      when: when?when:this.props.ride.when,
      contact: contact?contact:this.props.ride.contact,
      id: this.props.ride.id,
      sub: this.props.ride.sub
    }
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${this.props.ride.id}`,
      method: 'put',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
      data: ride
    }
    axios(config)
      .then(res => {
        this.props.update(ride)
      })
      .catch(err => {
        this.props.notify(`cannot delete - ${err.response.data.message}`)
      })
  }

  render() {
    const {classes} = this.props
    return (
      <Card className={classes.card}>
        <CardHeader
          title={`${this.props.ride.from} to ${this.props.ride.to}`}
          subheader={this.props.ride.when}/>
        <CardActions>
          <IconButton
            id="more"
            onClick={this.handleExpandClick}
          >
            <Typography variant='caption'>
              More
            </Typography>
            <ExpandMore/>
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded}>
          <CardActions>
            <IconButton
              disabled={!(this.context && this.context.profile && this.context.profile.sub === this.props.ride.sub)}
              onClick={e => this.setState({
                editing: true
              })}>
              <Edit/>
            </IconButton>
            <IconButton
              disabled={!(this.context && this.context.profile && this.context.profile.sub === this.props.ride.sub)}
              id={`delete`}
              onClick={this.handleDeleteClick}>
              <Delete/>
            </IconButton>
              <Button href={this.props.ride.contact}>Contact</Button>
            <EditRideDialog
              open={this.state.editing}
              operation='Update'
              ride={this.props.ride}
              handleClose={e => this.setState({
                editing: false
              })}
              submitRide={this.updateRide}
            />
          </CardActions>
        </Collapse>
      </Card>
    )}
  }

RideComponent.propTypes = {
  ride: PropTypes.shape({
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  remove,
  notify,
  update
}

export const Ride = withStyles(styles)(RideComponent)


export default connect(null, mapDispatchToProps)(Ride)
