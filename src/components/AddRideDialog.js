import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DialogTitle, DialogContent, DialogActions, Dialog, TextField, Button} from '@material-ui/core'

class AddRideDialog extends Component {

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
    console.log(`changing ${name} to ${value}`)
    this.setState({
      [name]: value
    })
  }

  safeContact = contact => {
    let url
    try {
      url = new URL(this.state.contact)
    } catch(err) {
      return null
    }
    const protocol = url.protocol
    if (protocol === 'mailto:' || protocol === 'http:' || protocol === 'https:') {
      return contact
    } else {
      return null
    }
  }

  addRide = event => {
    this.props.addRide({
      from: this.state.from,
      to: this.state.to,
      when: this.state.when,
      contact: this.safeContact(this.state.contact)
    })
    this.props.handleClose()
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>Add Ride</DialogTitle>
        <DialogContent>
          <TextField name='from' onChange={this.handleChange} label="From"/>
          <TextField name='to' onChange={this.handleChange} label="To"/>
          <TextField name='when' onChange={this.handleChange} type='datetime-local' defaultValue={this.tomorrow} label="When"/>
          <TextField name='contact' onChange={this.handleChange} type='url' label="Contact"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.addRide} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

AddRideDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  addRide: PropTypes.func.isRequired
}

export default AddRideDialog
