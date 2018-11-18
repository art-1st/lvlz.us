import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { GoCalendar } from 'react-icons/go';
import { MdHome, MdTimeline, MdSearch } from 'react-icons/md';

import styles from './Sidebar.module.scss';

class Sidebar extends Component {
  
  state = {
    
  }

  render() {
    return (
      <header className={ styles.header }>
        <h1 className="title">
            LOGO
        </h1>
        <div className={ styles['instant-search']}>
            <div className="instant-search-inner">
                <input type="text"/>
                <button className="ico-search">
                    <MdSearch size={ 22 } />
                </button>
            </div>
        </div>
        <nav className={ styles.nav }>
            <ul>
                <li className="nav-item" data-item="home">
                    <Link to="/">
                        <MdHome className="item-ico" />
                        <span className="item-title">Home</span>
                    </Link>
                </li>
                <li className="nav-item" data-item="calendar">
                    <Link to="/calendar">
                        <GoCalendar className="item-ico" />
                        <span className="item-title">Calendar</span>
                    </Link>
                </li>
                <li className="nav-item" data-item="timeline">
                    <Link to="/timeline">
                        <MdTimeline className="item-ico" />
                        <span className="item-title">Timeline</span>
                    </Link>
                </li>
                <li className="nav-item" data-item="search">
                    <Link to="/search">
                        <MdSearch className="item-ico" />
                        <span className="item-title">Search</span>
                    </Link>
                </li>
            </ul>
        </nav>
      </header>
    )
  }
}
  
export default Sidebar;