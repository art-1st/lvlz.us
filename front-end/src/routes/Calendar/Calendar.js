import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Sidebar } from '../../components';
import FullCalendar from './FullCalendar';
import { withLvlz } from '../../context/lvlz';

import { zeroPad } from '../../tools/misc';

import styles from './Calendar.module.scss';

class Calendar extends Component {

  state = {
    Y: this.props.match.params.Y,
    M: zeroPad(this.props.match.params.M, 2),
    D: zeroPad(this.props.match.params.D, 2),
    eventId: this.props.match.params.id,
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
        <Sidebar menu="calendar" />
        <main className={ styles.main } ref="main">
          <FullCalendar date={`${ this.state.Y }-${ this.state.M }-${ this.state.D }`} calendarHeight={ this.state.calendarHeight } eventId={ this.state.eventId } />
        </main>
      </>
    )
  }
}
  
export default withLvlz(({ state, actions }) => ({
  fcDate: state.fcDate,
  setFcDate: actions.setFcDate,
}))(Calendar);