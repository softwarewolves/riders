import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
import Ride from './components/Ride'
import Header from './components/Header'
import ErrorMessage from './components/ErrorMessage'
import {notify, resetRides} from './actions'

const listRidesConfig = {
  baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
  url: 'rides',
  method: 'get',
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY
  }
}

export class App extends Component {

  listRides = () =>
    axios(listRidesConfig)
      .then(
        (res) => {
          this.props.resetRides(res.data)
      })
      .catch(
        (err) => {
          this.props.notify(`cannot retrieve rides - ${err}`)
      })

  componentDidMount() {
    this.listRides()
  }

  render() {
    const rides = this.props.rides?
                    this.props.rides.filter(this.props.filter)
                      .map(ride =>
                            <Ride
                              ride={ride}
                              disabled={false}
                            />)
                    :undefined
    return (
      <div>
        <Route path='/' render={() =>
          <div>
              <Header
                addRide={this.openAddRideDialog}
              />
              <Grid container justify='center'>
                <Rides rides={rides}/>
              </Grid>
          </div>}
        />
      <ErrorMessage/>
      </div>
    )}
}

App.propTypes = {
  notify: PropTypes.func.isRequired,
  resetRides: PropTypes.func.isRequired,
  rides: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  rides: state.rides,
  filter: state.filter
})

const mapDispatchToProps = {
  notify,
  resetRides
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
