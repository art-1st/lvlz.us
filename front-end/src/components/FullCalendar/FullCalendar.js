import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import reactGA from 'react-ga';
import axios from 'axios';
import { withLvlz } from '../../context/lvlz';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { MdTv } from 'react-icons/md';

import { YYYYMMDDHyphenToSlash, YYYMMDDtoYYYYMD } from '../../tools/misc';
import { Calendar } from 'fullcalendar';
import 'fullcalendar/dist/locales/ko';

import './FullCalendar.scss';

class FullCalendar extends Component {

  API_DOMAIN = this.props.API_DOMAIN
  PREV_URI = `/calendar/${ YYYMMDDtoYYYYMD(YYYYMMDDHyphenToSlash(this.props.date)) }`

  state = {
    onLoad: false,
    date: this.props.date,
    eventData: false
  }

  componentDidMount() {
    this.Calendar = new Calendar(this.refs.fc, {
      theme: true,
      // locale: 'ko',
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
      // eventMouseover: (calEvent, jsEvent, view) => {
      //   console.log('<< event mouseover >>', calEvent);
      // },
      eventClick: (calEvent, jsEvent, view) => {
        this.setState({
          eventData: { 
            nowLoading: true,
            title: calEvent.event.title,
            className: calEvent.event.classNames.join(' ')
          }
        });
        axios.get(`//${ this.API_DOMAIN }/event/${ calEvent.event.id }`)
        .then((response) => { 
          let data = response.data[0]
          this.setState({ eventData: data });

          this.PREV_URI = document.location.pathname;
          let NEXT_URI = `${this.PREV_URI}/event/${data.id}`

          window.history.replaceState({}, '', NEXT_URI);
          reactGA.pageview(NEXT_URI);
        });
      }
    });

    this.Calendar.render();

    if(this.props.eventId) {
      axios.get(`//${ this.API_DOMAIN }/event/${ this.props.eventId }`)
      .then((response) => { 
        let data = response.data[0];
        let startDate = data.start.substring(0, 10);
        this.Calendar.gotoDate(startDate);
        this.setState({ eventData: data });
      })
      .catch((error) => {
        return <Redirect to="/error" />;
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
    window.history.replaceState({}, '', this.PREV_URI);
    reactGA.pageview(this.PREV_URI);
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
          <h2 className="date">
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
  const classParser = (aClass) => {
    let data = {};

    switch(aClass) {
      case 'c-tv':
        data = {
          icon: MdTv,
          text: '방송'
        }
        break;
      case 'c-vlive':
        data = {
          icon: MdTv,
          text: 'V LIVE'
        }
        break;
      default:
        data = false
    }

    return data ?
    (
      <>
        <data.icon />
        <strong>{ data.text }</strong>
      </>
    )
    :
    (
      <></>
    )
  }

  return (
    <>
      <div className="dimmer" onClick={ clearEvent }></div>
      <div className={`event-modal ${ data.className }`}>
        <div className="header">
          <h2 className="title">
            { data.title }
          </h2>
          <div className="category">
            { classParser(data.className) }
          </div>
        </div>
        {
          data.address &&
          <div className="maps">
            <data className="overlay">
              <h3 className="place">{ data.place }</h3>
              <address className="address">{ data.address }</address>
            </data>
          </div>
        }
        <div className="content">
          { data.nowLoading && <div className="loading-dimmer" /> }
          <ul>
            <li className="item">
              <strong className="item-name">시작</strong>
              <span className="item-data">{ data.start }</span>
            </li>
            <li className="item">
              <strong className="item-name">종료</strong>
              <span className="item-data">{ data.end }</span>
            </li>
            {
              data.desc &&
              <li className="item">
                <strong className="item-name">내용</strong>
                <span className="item-data">{ data.desc }</span>
              </li>
            }
            {
              !data.address && data.place &&
              <li className="item">
                <strong className="item-name">장소</strong>
                <span className="item-data">{ data.place }</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </>
  )
}
  
export default withLvlz(({ state, actions }) => ({
  API_DOMAIN: state.API_DOMAIN
}))(FullCalendar);
// export default FullCalendar;