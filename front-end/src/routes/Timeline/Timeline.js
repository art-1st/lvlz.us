import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Sidebar } from '../../components';

import './Timeline.scss';

class Timeline extends Component {
  render() {
    return (
      <>
        <Sidebar />
        <main>
          Timeline
        </main>
      </>
    )
  }
}
  
export default Timeline;