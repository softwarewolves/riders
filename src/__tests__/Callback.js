import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import {MemoryRouter} from 'react-router'
import Callback from '../components/Callback'

const errorMsg = 'invalid'

describe('Callback', () => {

  const middlewares = []
  const store = configureStore(middlewares)()

  beforeEach(async () => {
    await mount(
      <Provider store={store}>
        <MemoryRouter>
          <Callback  userManager={{
              signinRedirectCallback: (location) => {
                return new Promise((resolve, reject) => {
                  reject(new Error(errorMsg))
                })
              },
              clearStaleState: jest.fn()
            }}
            history={{
              replace: (url) => {}
            }}
          />
          </MemoryRouter>
      </Provider>
    )
  })

  afterEach(() => {
    store.clearActions()
  })


  it('notifies the store if the user fails to log in', async () => {
    const actions = await store.getActions()
    expect(actions).toEqual([{type: 'NOTIFY_ERROR', errorMessage: `Login failed - Error: ${errorMsg}`}])
  })
})
