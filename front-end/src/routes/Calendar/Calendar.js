import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Sidebar, FullCalendar } from '../../components';
import { withLvlz } from '../../context/lvlz';

import styles from './Calendar.module.scss';

class Calendar extends Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    Y: this.props.match.params.Y,
    M: Number(this.props.match.params.M) < 10 ? `0${ this.props.match.params.M }` : this.props.match.params.M,
    D: Number(this.props.match.params.D) < 10 ? `0${ this.props.match.params.D }` : this.props.match.params.D
  }

  componentWillMount() {
    this.props.setFcDate(`${ this.state.Y }-${ this.state.M }-${ this.state.D }`);
  }

  componentDidMount() {
    console.log(this.fc);
  }

  render() {
    return (
      <>
        <Sidebar />
        <main className={ styles.main }>
          <div className="header">
            <button onClick={() => { this.fc.prev() } }>prev</button>
            <button onClick={() => { this.fc.today() } }>today</button>
            <button onClick={() => { this.fc.next() } }>next</button>
            <button onClick={() => { 
              let date = window.prompt('ex. 2018-10-10');
              this.fc.gotoDate(date);
            }}>goto</button>
            <button onClick={() => { this.fc.changeViewWeek() } }>week view</button>
            <button onClick={() => { this.fc.changeViewMonth() } }>month view</button>            
          </div>
          <FullCalendar date={`${this.state.Y}-${this.state.M}-${this.state.D}`} ref={ref => this.fc = ref} />
        </main>
      </>
    )
  }
}
  
export default withLvlz(({ state, actions }) => ({
  fcDate: state.fcDate,
  setFcDate: actions.setFcDate,
}))(Calendar);