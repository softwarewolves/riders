import React from 'react'
import {withRouter} from 'react-router-dom'

class Callback extends React.Component {
  async componentDidMount() {
  //  await auth0Client.handleAuthentication();
    this.props.history.replace('/');
  }

  render() {
    return (
      <p>Logging in...</p>
    );
  }
}

export default withRouter(Callback);
