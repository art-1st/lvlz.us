import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import { withLvlz } from '../../context/lvlz';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { Calendar } from 'fullcalendar';
import 'fullcalendar/dist/locales/ko';

import './FullCalendar.scss';

const API_DOMAIN = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://api.lvlz.us';

class FullCalendar extends Component {
  state = {
    onLoad: false,
    date: this.props.date,
    eventData: false
  }

  componentDidMount() {
    this.Calendar = new Calendar(this.refs.fc, {
      theme: true,
      locale: 'ko',
      timeZone: 'UTC+09:00',
      defaultView: 'month',
      defaultDate: this.props.date,
      header: false,
      nowIndicator: true,
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
      eventLimit: true,
      loading: (isLoaded, view) => {
        isLoaded
        ? this.setState({ onLoad: false })
        : this.setState({ onLoad: true });
      },
      datesRender: (info) => {
        if(this.state.onLoad) {
          let d = new Date(info.view.dateProfile.currentRange.start);
          let dD = `${ d.getUTCFullYear() }-${ d.getUTCMonth() + 1 }-${ d.getUTCDate() }`;
          let dR = `${ d.getUTCFullYear() }/${ d.getUTCMonth() + 1 }/${ d.getUTCDate() }`;

          this.setState({ date: dD });
          window.history.replaceState({}, '', `/calendar/${ dR }`);
        }
      },
      // dateClick: (data) => {
      //   console.log('<< date clicked >>', data);
      // },
      // viewRender: (event) => {
      //   console.log('<< event clicked >>', event);
      // },
      eventMouseover: (calEvent, jsEvent, view) => {
        // onMouseOver
      },
      eventClick: (calEvent, jsEvent, view) => {
        axios.get(`${ API_DOMAIN }/event/${ calEvent.event.id }`)
        .then((response) => { 
          console.log(response.data[0]);
          this.setState({
            eventData: response.data[0]
          });
        });
      }
    });

    this.Calendar.render();
  }

  componentWillUnmount() {
    
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.calendarHeight !== nextProps.calendarHeight) {
      this.Calendar.setOption('height', nextProps.calendarHeight - 120);
    }
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

  clearEvent = () => {
    this.setState({
      eventData: false
    });
  }

  render() {
    return (
      <>
        {
          this.state.eventData && <EventModal data={ this.state.eventData } clearEvent={ this.clearEvent } />
        }
        <div className="header">
          <button className="btn-nav" onClick={ this.prev.bind(this) }>
            <FaAngleLeft size={ 16 } />
          </button>
          <button className="btn-today" onClick={ this.today.bind(this) }>오늘</button>
          <button className="btn-nav" onClick={ this.next.bind(this) }>
            <FaAngleRight size={ 16 } />
          </button>
          <h2>
            <span>{`${ this.state.date.split('-')[0] }년`}</span>
            <strong>{`${ parseFloat(this.state.date.split('-')[1]) }월`}</strong>
          </h2>
        </div>
        <div ref="fc" />
      </>
    )
  }
}

const EventModal = ({ data, clearEvent }) => {
  return (
    <>
      <div className="dimmer" onClick={ clearEvent }></div>
      <div className="event-modal">
        { data.title }
      </div>
    </>
  )
}
  
// export default withLvlz(({ state, actions }) => ({
//   nowDate: state.nowDate
// }))(FullCalendar);
export default FullCalendar;