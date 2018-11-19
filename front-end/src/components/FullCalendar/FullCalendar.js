import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import reactGA from 'react-ga';
import axios from 'axios';
import { withLvlz } from '../../context/lvlz';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import replaceAll from 'replaceall';

import { Calendar } from 'fullcalendar';
import 'fullcalendar/dist/locales/ko';

import './FullCalendar.scss';

class FullCalendar extends Component {

  API_DOMAIN = this.props.API_DOMAIN

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
          url: `//${ this.API_DOMAIN }/calendar/schedule`
        },
        {
          url: `//${ this.API_DOMAIN }/calendar/holiday`,
          color: 'transparent',
          borderColor: 'red',
          textColor: 'red',
          className: 'holiday'
        },
        {
          url: `//${ this.API_DOMAIN }/calendar/anniversary`,
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
          reactGA.pageview(`/calendar/${ dR }`);
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
        this.setState({
          eventData: { 
            nowLoading: true,
            title: calEvent.event.title,
            className: calEvent.event.classNames
          }
        });
        axios.get(`//${ this.API_DOMAIN }/event/${ calEvent.event.id }`)
        .then((response) => { 
          console.log(response.data[0]);
          this.setState({
            eventData: response.data[0]
          });
          window.history.replaceState({}, '', `${ document.location.pathname }?event=${response.data[0].id}`);
          reactGA.pageview(`${ document.location.pathname }?event=${response.data[0].id}`);
        });
      }
    });

    this.Calendar.render();

    if(this.props.queryString.event) {
      axios.get(`//${ this.API_DOMAIN }/event/${ this.props.queryString.event }`)
        .then((response) => { 
          let data = response.data[0]
          let startDate = data.start.substring(0, 10);
          this.Calendar.gotoDate(startDate);
          this.setState({
            date: startDate,
            eventData: data
          });
          window.history.replaceState({}, '', `/calendar/${ replaceAll('/0', '/', replaceAll('-', '/', startDate)) }?event=${response.data[0].id}`);
          reactGA.pageview(`/calendar/${ replaceAll('/0', '/', replaceAll('-', '/', startDate)) }?event=${response.data[0].id}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    window.history.replaceState({}, '', document.location.pathname);
    reactGA.pageview(document.location.pathname);
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
      <div className={`event-modal ${ data.className }`}>
        <div className="header">
          <h2>{ data.title }</h2>
        </div>
        {
          data.nowLoading &&
          'now loading...'
        }
      </div>
    </>
  )
}
  
export default withLvlz(({ state, actions }) => ({
  API_DOMAIN: state.API_DOMAIN
}))(FullCalendar);
// export default FullCalendar;