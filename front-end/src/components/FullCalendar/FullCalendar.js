import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import history from '../../history';
import axios from 'axios';
// import { withLvlz } from '../../context/lvlz';

import { Calendar } from 'fullcalendar';
import 'fullcalendar/dist/locales/ko';

import './FullCalendar.scss';

const API_DOMAIN = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://api.lvlz.us';

class FullCalendar extends Component {
  // constructor(props) {
  //   super(props);

  // }

  state = {
    onLoad: false
  }

  componentDidMount() {
    this.Calendar = new Calendar(this.refs.fc, {
      theme: true,
      locale: 'ko',
      timeZone: 'UTC',
      defaultView: 'month',
      defaultDate: this.props.date,
      header: false,
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
      },
      eventSources: [
        {
          url: `${ API_DOMAIN }/calendar/schedule`
        },
        {
          url: `${ API_DOMAIN }/calendar/holiday`,
          color: 'transparent',
          borderColor: 'red',
          textColor: 'red',
          className: 'holiday'
        },
        {
          url: `${ API_DOMAIN }/calendar/anniversary`,
          color: '#FF5858',
          textColor: 'white'
        }
      ],
      loading: (isLoading, view) => {
        this.isLoading
        ? this.setState({ onLoad: false })
        : this.setState({ onLoad: true });
      },
      dateClick: (data) => {
        console.log('<< date clicked >>', data);
      },
      viewRender: (event) => {
        console.log('<< event clicked >>', event);
      },
      eventMouseover: (calEvent, jsEvent, view) => {
        // onMouseOver
      },
      eventClick: (calEvent, jsEvent, view) => {
        axios.get(`${ API_DOMAIN }/event/${ calEvent.event.id }`)
        .then((response) => { console.log(response) });
      }
    });

    this.Calendar.render();
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }

  gotoDate(date) {
    this.Calendar.gotoDate(date)
  }

  prev() {
    this.Calendar.prev();
  }

  next() {
    this.Calendar.next();
  }

  today() {
    this.Calendar.today();
  }

  changeViewWeek() {
    this.Calendar.changeView('agendaWeek');
  }

  changeViewMonth() {
    this.Calendar.changeView('month');
  }

  render() {
    return (
      <div ref="fc" data-onload={ this.state.onLoad } />
    )
  }
}
  
// export default withLvlz(({ state, actions }) => ({
//   nowDate: state.nowDate
// }))(FullCalendar);
export default FullCalendar;