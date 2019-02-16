import {safeContact} from '../helpers/sanitize'

describe('safeContact', () => {
  let url
  const checkSucceeds = url => {
    expect(safeContact(url)).toBe(url)
  }
  it('returns a URL starting with mailto:', () => {
    url = 'mailto:yo@johanpeeters.com'
    checkSucceeds(url)
  })
  it('returns a URL starting with http:', () => {
    url = 'https://johanpeeters.com'
    checkSucceeds(url)
  })
})
