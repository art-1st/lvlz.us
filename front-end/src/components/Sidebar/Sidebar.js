import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { GoCalendar } from 'react-icons/go';
import { MdHome, MdTimeline, MdSearch } from 'react-icons/md';

import styles from './Sidebar.module.scss';

class Sidebar extends Component {
  
  state = {
    current: this.props.menu
  }

  menus = [
    {
      url: "/",
      icon: MdHome,
      title: "홈",
      isActive: this.props.menu === "Home",
      isDisabled: true
    },
    {
      url: "/calendar",
      icon: GoCalendar,
      title: "캘린더",
      isActive: this.props.menu === "calendar"
    },
    {
      url: "/timeline",
      icon: MdTimeline,
      title: "타임라인",
      isActive: this.props.menu === "timeline",
      isDisabled: true
    },
    {
      url: "/search",
      icon: MdSearch,
      title: "검색",
      isActive: this.props.menu === "search"
    }
  ]

  render() {
    return (
      <header className={ styles.header }>
        <h1 className="title">
          LOGO
        </h1>
        <nav className={ styles.nav }>
          <ul>
            {
              this.menus.map((value, i) => {
                return (
                  <li
                    className={`nav-item ${ value.isActive ? 'is-active' : '' } ${ value.isDisabled ? 'is-disabled' : '' }`}
                    key={ i }
                  >
                    <Link to={ value.url }>
                      <value.icon className="item-ico" />
                      <span className="item-title">
                        { value.title }
                      </span>
                    </Link>
                  </li>
                );
              })
            }
          </ul>
        </nav>
      </header>
    )
  }
}
  
export default Sidebar;