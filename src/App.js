import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {connect} from 'react-redux'
import {withRouter, Route} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
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
    return (
      <div>
        <Route path='/' render={() =>
          <div>
              <Header
                addRide={this.openAddRideDialog}
              />
              <Grid container justify='center'>
                <Rides rides={this.props.rides.filter(this.props.filter)}/>
              </Grid>
            <ErrorMessage/>
          </div>}
        />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
