import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { GoCalendar } from 'react-icons/go';
import { MdHome, MdTimeline, MdSearch } from 'react-icons/md';
import { IoIosMail, IoMdMenu } from 'react-icons/io';

import styles from './Sidebar.module.scss';

class Sidebar extends Component {
  
  state = {
    current: this.props.menu,
    isExpanded: false
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
      isActive: this.props.menu === "search",
      isDisabled: true
    }
  ]

  render() {
    return (
      <header className={`${ styles.header } ${ this.state.isExpanded ? styles['is-expanded'] : '' }`}>
        <h1 className="title">
          러블리즈 팬덤<br />
          스케줄 캘린더
        </h1>
        <nav className={ styles.nav }>
          <div className="hb-menu">
            <button onClick={() => { this.setState((prevState) => { return { isExpanded: !prevState.isExpanded } }) }} title="메뉴">
              <IoMdMenu size={ 32 } color="#555" />
            </button>
          </div>
          <ul>
            {
              this.menus.map((value, key) => {
                return (
                  <li
                    className={`nav-item${ value.isActive ? ' is-active' : '' }${ value.isDisabled ? ' is-disabled' : '' }`}
                    key={ key }
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
            <li className="nav-item">
              <a href="mailto:admin@art1st.me?subject=[스케줄 제보] ">
                <IoIosMail className="item-ico" />
                <span className="item-title">스케줄 제보</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="mailto:admin@art1st.me?subject=[개선/버그 피드백] ">
                <IoIosMail className="item-ico" />
                <span className="item-title">개선/버그 피드백</span>
              </a>
            </li>
          </ul>
          <strong className="nav-feedback-email">Email: admin@art1st.me</strong>
        </nav>
      </header>
    )
  }
}
  
export default Sidebar;