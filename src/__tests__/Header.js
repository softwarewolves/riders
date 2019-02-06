import React from 'react'
import {shallow} from 'enzyme'
import Header from '../components/Header'
import {UserManager} from 'oidc-client'

const mockSigninRedirect = jest.fn()
const mockSignoutRedirect = jest.fn()
jest.mock('oidc-client')
UserManager.mockImplementation(() => {
      return {
        signinRedirect: mockSigninRedirect,
        signoutRedirect: mockSignoutRedirect
      }
    })

describe('Header', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Header userManager={new UserManager()}/>)
  })
  it('shows login button if there is no context', () => {
    wrapper = wrapper.dive()
    expect(wrapper.find('WithStyles(Button)')).toExist()
    expect(wrapper.find('WithStyles(Button)').children()).toHaveText('Login')
    expect(wrapper.find('WithStyles(Button)').children()).not.toHaveText('Logout')
  })
  it('shows logout button if there is a context', () => {
    wrapper.setProps({context: {}})
    wrapper = wrapper.dive()
    expect(wrapper.find('WithStyles(Button)')).toExist()
    expect(wrapper.find('WithStyles(Button)').children()).not.toHaveText('Login')
    expect(wrapper.find('WithStyles(Button)').children()).toHaveText('Logout')
  })
  it('runs the login method if the login button is pressed', () => {
    wrapper = wrapper.dive()
    wrapper.find('WithStyles(Button)').simulate('click')
  })
})
