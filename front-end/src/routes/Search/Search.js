import React, { Component } from 'react';
import { Sidebar } from '../../components';
// import { Link } from 'react-router-dom';

import './Search.scss';

class Search extends Component {
  render() {
    return (
      <>
        <Sidebar />
        <main>Search</main>
      </>
    )
  }
}
  
export default Search;