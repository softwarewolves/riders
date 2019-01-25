import React from 'react'
import axios from 'axios'
import {shallow, mount} from 'enzyme'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import ConnectedRide, {Ride} from '../components/Ride'

jest.mock('axios')

let wrapper
const errorMsg = 'access denied'
const ride1 = {from: "Antwerp", to: "Leuven", id: "aaaaaa"}
const ride2 = {from: 'a', to: 'b', id: "bbbbbbb"}

axios.mockRejectedValue(errorMsg)

describe('Ride', () => {

  beforeEach(async () => {
    wrapper = await shallow(<Ride ride={ride1} dispatch={e => {}}/>)
  })

  it('start and endpoint can be set via props', () => {
    expect(wrapper.dive()).toContainExactlyOneMatchingElement('WithStyles(CardHeader)')
    expect(wrapper.dive().find({title: 'Antwerp to Leuven'})).toExist()
    expect(wrapper.dive().find({title: 'a to b'})).not.toExist()
    wrapper.setProps({ride: ride2})
    expect(wrapper.dive().find({title: 'Antwerp to Leuven'})).not.toExist()
    expect(wrapper.dive().find({title: 'a to b'})).toExist()
  })
  it('by default is not expanded', () => {
    expect(wrapper.dive()).toHaveState({expanded: false})
  })
  it('expands when the more button is clicked', () => {
    wrapper = wrapper.dive()
    wrapper.find('#more').simulate('click')
    expect(wrapper).toHaveState({expanded: true})
  })
  it('calls the API when the delete button is pressed', () => {
    wrapper.setProps({disabled: false})
    wrapper = wrapper.dive()
    wrapper.find('#delete').simulate('click')
    expect(axios).toHaveBeenCalled()
  })
})

describe('ConnectedRide', () => {

  const middlewares = []
  const store = configureStore(middlewares)()

  beforeEach(async () => {
    wrapper = await mount(
      <Provider store={store}>
        <ConnectedRide ride={ride1}/>
      </Provider>
    )
  })

  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.mockClear()
    store.clearActions()
  })

  it('notifies the store if a delete action returns an error', async () => {
    wrapper.setProps({disabled: false})
    await wrapper.find(`#delete`).filter('IconButton').simulate('click')
    const actions = await store.getActions()
    expect(actions).toEqual([{type: 'NOTIFY_ERROR', errorMessage: `cannot delete - ${errorMsg}`}])
  })
})
