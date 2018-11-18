import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Sidebar, FullCalendar } from '../../components';
import { withLvlz } from '../../context/lvlz';
import queryString from 'query-string';

import styles from './Calendar.module.scss';

class Calendar extends Component {

  state = {
    Y: this.props.match.params.Y,
    M: Number(this.props.match.params.M) < 10 ? '0' + this.props.match.params.M : this.props.match.params.M,
    D: Number(this.props.match.params.D) < 10 ? '0' + this.props.match.params.D : this.props.match.params.D,
    QS: queryString.parse(this.props.location.search),
    calendarHeight: 0
  }

  componentDidMount() {
    this.setState({
      calendarHeight: this.refs.main.clientHeight
    });
    window.onresize = () => {
      this.setState({
        calendarHeight: this.refs.main.clientHeight
      });
    }
  }

  componentWillMount() {
    this.props.setFcDate(`${ this.state.Y }-${ this.state.M }-${ this.state.D }`);
  }

  render() {
    return (
      <>
        <Sidebar />
        <main className={ styles.main } ref="main">
          <FullCalendar date={`${ this.state.Y }-${ this.state.M }-${ this.state.D }`} calendarHeight={ this.state.calendarHeight } qs={ this.state.QS } ref={ref => this.fc = ref} />
        </main>
      </>
    )
  }
}
  
export default withLvlz(({ state, actions }) => ({
  fcDate: state.fcDate,
  setFcDate: actions.setFcDate,
}))(Calendar);