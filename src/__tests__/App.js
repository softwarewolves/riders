import React from 'react'
import axios from 'axios'
import {mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router'
import App from '../App'

jest.mock('axios')
const middlewares = []
const store = configureStore(middlewares)()

describe('App', () => {

  let wrapper
  const ride1 = {from: "Antwerp", to: "Leuven", id: 'aaaaaaaa'}
  const ride2 = {from: 'a', to: 'b', id: 'bbbbbbbb'}

  beforeAll(() => {
    axios.mockResolvedValue({data: [ride1, ride2]})
  })

  describe('when rides are retrieved', () => {

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <App/>
          </MemoryRouter>
        </Provider>
      )
    })

    afterEach(() => {
      axios.mockClear()
      store.clearActions()
    })

    it('retrieves rides when it mounts', () => {
      expect(axios).toHaveBeenCalled()
    })
    it('places the retrieved rides in the App state', () => {
      wrapper = wrapper.find('App')
      expect(wrapper.state('rides')).toContain(ride1)
      expect(wrapper.state('rides')).toContain(ride2)
    })
  })
  describe('when rides cannot be retrieved', () => {

    const errorMsg = 'no network'
    axios.mockReset()

    beforeEach(async () => {
      axios.mockRejectedValueOnce(errorMsg)
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <App/>
          </MemoryRouter>
        </Provider>
      )
    })

    afterEach(() => {
      axios.mockClear()
      store.clearActions()
    })

    it('notifies the store', async () => {
      const actions = await store.getActions()
      expect(actions).toEqual([{type: 'NOTIFY_ERROR', errorMessage: `cannot retrieve rides - ${errorMsg}`}])
    })
  })
})
