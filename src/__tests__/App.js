import React from 'react'
import axios from 'axios'
import {mount, shallow} from 'enzyme'
import configureStore from 'redux-mock-store'
import {Provider} from 'react-redux'
import ConnectedApp, {App} from '../App'

jest.mock('axios')

const ride1 = {from: "Antwerp", to: "Leuven"}
const ride2 = {from: 'a', to: 'b'}

let wrapper

describe('App component', () => {

  beforeEach(async () => {
    axios.mockResolvedValueOnce({data: [ride1, ride2]})
    wrapper = await shallow(
        <App dispatch={e => {}}/>
    )
  })

  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.mockClear()
  })

  it('retrieves rides when it mounts', () => {
    expect(axios).toHaveBeenCalled()
  })
  it('places the retrieved rides in the App state', () => {
    expect(wrapper.state('rides')).toContain(ride1)
    expect(wrapper.state('rides')).toContain(ride2)
  })
  it('has a connected ErrorMessage child', () => {
    const errMsgContainer = wrapper.find('Connect(ErrorMessage)')
    expect(errMsgContainer).toExist()
  })
})

describe('App container', () => {

  const middlewares = []
  const store = configureStore(middlewares)()
  const errorMsg = 'no network'

  axios.mockReset()

  beforeEach(async () => {
    axios.mockRejectedValueOnce(errorMsg)
    wrapper = await mount(
      <Provider store={store}>
        <ConnectedApp/>
      </Provider>
    )
  })

  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.mockClear()
  })

  it('notifies the store when rides cannot be retrieved', async () => {
    const actions = await store.getActions()
    expect(actions).toEqual([{type: 'NOTIFY_ERROR', errorMessage: `cannot retrieve rides - ${errorMsg}`}])
  })
})
