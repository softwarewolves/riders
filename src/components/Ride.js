import React, {Component} from 'react'
import axios from 'axios'
import {Card, CardHeader, CardActions, IconButton, Collapse, Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {Delete ,ExpandMore, Edit} from '@material-ui/icons'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {notify} from '../actions'

const styles = theme => ({
  card: {
    boxShadow: 'none',
    borderRadius: 'none',
    borderBottom: 'thick solid cornflowerblue'
  }
})

class RideComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  handleExpandClick = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  handleDeleteClick = e => {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
      url: `rides/${this.props.ride.id}`,
      method: 'delete',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    }
    axios(config)
      .then(res => {
      })
      .catch(err => {
        this.props.dispatch(notify(`cannot delete - ${err}`))
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
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <Typography variant='caption'>
              More
            </Typography>
            <ExpandMore/>
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded}>
          <CardActions>
            <IconButton disabled={this.props.disabled}>
              <Edit/>
            </IconButton>
            <IconButton disabled={this.props.disabled}
              id={`delete`}
              onClick={this.handleDeleteClick}
              aria-label="Delete">
              <Delete/>
            </IconButton>
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
  dispatch: PropTypes.func.isRequired
}

export const Ride = withStyles(styles)(RideComponent)

export default connect()(Ride)
