import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {DialogTitle, DialogContent, DialogActions, Dialog, TextField, Button} from '@material-ui/core'

const EditRideDialog = ({open, operation, handleClose, submitRide, ride}) => {

  const ensure2Digits = number => {
    return ('0' + number).slice(-2)
  }
  const now = new Date(Date.now())
  const tomorrow = `${1900 + now.getYear()}-${ensure2Digits(now.getMonth() + 1)}-${ensure2Digits(now.getDate() + 1)}T12:00`

  const [values, setValues] = useState({when: tomorrow})

  const handleChange = ({target: {name, value}}) => {
    setValues(values => ({...values, [name]: value}))
  }

  const handleSubmit = event => {
    submitRide(values)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{operation} Ride</DialogTitle>
      <DialogContent>
        <TextField
          name='from'
          onChange={handleChange}
          label="From"
          defaultValue={ride?ride.from:''}/>
        <TextField
          name='to'
          onChange={handleChange}
          defaultValue={ride?ride.to:''}
          label="To"/>
        <TextField
          name='when'
          onChange={handleChange}
          type='datetime-local'
          defaultValue={ride?ride.when:tomorrow}
          label="When"/>
        <TextField
          name='contact'
          onChange={handleChange}
          type='url'
          defaultValue={ride?ride.contact:''}
          label="Contact"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {operation}
        </Button>
      </DialogActions>
    </Dialog>
  )
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
