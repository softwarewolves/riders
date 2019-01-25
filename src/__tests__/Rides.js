import React from 'react'
import Rides from '../components/Rides'
import { createShallow } from '@material-ui/core/test-utils';


describe('Rides', () => {
  let wrapper
  let shallow
  const ride1 = {from: "Antwerp", to: "Leuven"}
  const ride2 = {from: 'a', to: 'b'}
  beforeEach(() => {
    shallow = createShallow()
    wrapper = shallow(<Rides rides={[]}/>)
  })
  it('has as many children as there are rides', () => {
    expect(wrapper.dive().children()).toHaveLength(0)
    wrapper.setProps({rides: [ride1, ride2]})
    expect(wrapper.dive().children()).toHaveLength(2)
  })
})
