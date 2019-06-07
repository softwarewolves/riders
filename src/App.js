import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import Rides from './components/Rides'
import Ride from './components/Ride'
import Header from './components/Header'
import ErrorMessage from './components/ErrorMessage'
import {notify, resetRides, refreshing} from './actions'

const listRidesConfig = {
  baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
  url: 'rides',
  method: 'get',
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY
  }
}

export const App = ({resetRides, notify, refreshing, fresh, rides, filter}) => {

  useEffect(
    () => {
      if (!fresh) {
        const listRides = () =>
          axios(listRidesConfig)
            .then(
              (res) => {
                resetRides(res.data)
            })
            .catch(
              (err) => {
                notify(`cannot retrieve rides - ${err}`)
            })
        refreshing()
        listRides()
      }
    },
    [fresh, resetRides, notify, refreshing]
  )

  const rideList = rides?
                    rides.filter(filter)
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
            <Header/>
            <Grid container justify='center'>
              <Rides rides={rideList}/>
            </Grid>
        </div>}
      />
    <ErrorMessage/>
    </div>
  )
}

App.propTypes = {
  notify: PropTypes.func.isRequired,
  resetRides: PropTypes.func.isRequired,
  refreshing: PropTypes.func.isRequired,
  rides: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  fresh: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  fresh: state.fresh,
  rides: state.rides,
  filter: state.filter
})

const mapDispatchToProps = {
  notify,
  resetRides,
  refreshing
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
