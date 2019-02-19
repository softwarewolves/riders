import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DialogTitle, DialogContent, DialogActions, Dialog, TextField, Button} from '@material-ui/core'

class EditRideDialog extends Component {

  constructor(props) {
    super(props)
    const ensure2Digits = number => {
      return ('0' + number).slice(-2)
    }
    const now = new Date(Date.now())
    this.tomorrow = `${1900 + now.getYear()}-${ensure2Digits(now.getMonth() + 1)}-${ensure2Digits(now.getDate() + 1)}T12:00`
    this.state = {
      when: this.tomorrow
    }
  }

  handleChange = ({target: {name, value}}) => {
    this.setState({
      [name]: value
    })
  }

  submitRide = event => {
    this.props.submitRide({
      from: this.state.from,
      to: this.state.to,
      when: this.state.when,
      contact: this.state.contact
    })
    this.props.handleClose()
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>{this.props.operation} Ride</DialogTitle>
        <DialogContent>
          <TextField
            name='from'
            onChange={this.handleChange}
            label="From"
            defaultValue={this.props.ride?this.props.ride.from:''}/>
          <TextField
            name='to'
            onChange={this.handleChange}
            defaultValue={this.props.ride?this.props.ride.to:''}
            label="To"/>
          <TextField
            name='when'
            onChange={this.handleChange}
            type='datetime-local'
            defaultValue={this.props.ride?this.props.ride.when:this.tomorrow}
            label="When"/>
          <TextField
            name='contact'
            onChange={this.handleChange}
            type='url'
            defaultValue={this.props.ride?this.props.ride.contact:''}
            label="Contact"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.submitRide} color="primary">
            {this.props.operation}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

EditRideDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  operation: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitRide: PropTypes.func.isRequired,
  ride: PropTypes.shape({
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  })
}

export default EditRideDialog
