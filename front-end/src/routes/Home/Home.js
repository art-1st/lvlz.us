import React, { Component } from 'react';
import { Sidebar } from '../../components';
// import { Link, Redirect } from 'react-router-dom';
import { withLvlz } from '../../context/lvlz';

import './Home.scss';

class Home extends Component {

  render() {
    return (
      <>
        <Sidebar menu="home" />
        <main>
          Home
        </main>
      </>
    )
  }
}
  
export default withLvlz(({ state, actions }) => ({
  setFcDate: actions.setFcDate,
}))(Home);