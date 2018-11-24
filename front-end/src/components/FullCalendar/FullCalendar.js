import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import reactGA from 'react-ga';
import axios from 'axios';
import moment from 'moment';
import { NaverMap, Marker } from 'react-naver-maps';
import { withLvlz } from '../../context/lvlz';
import {
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaRegClock,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaLink
} from 'react-icons/fa';
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
  IoMdInformationCircleOutline,
  IoMdPlay
} from 'react-icons/io';

import { YYYYMMDDHyphenToSlash, YYYMMDDtoYYYYMD } from '../../tools/misc';
import { Calendar } from 'fullcalendar';
import 'fullcalendar/dist/locales/ko';

import './FullCalendar.scss';

const EVENT_HOLIDAY = require('../../assets/data/holiday.json');
const EVENT_ANNIVERSARY = require('../../assets/data/anniversary.json');

class FullCalendar extends Component {

  API_DOMAIN = this.props.API_DOMAIN
  PREV_URI = `/calendar/${ YYYMMDDtoYYYYMD(YYYYMMDDHyphenToSlash(this.props.date)) }`

  state = {
    onLoad: false,
    enableYearCalModal: false,
    yearCalData: parseFloat(this.props.date.substring(0, 4)),
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
          events: EVENT_HOLIDAY,
          color: 'transparent',
          borderColor: 'red',
          textColor: 'red',
          className: 'holiday'
        },
        {
          events: EVENT_ANNIVERSARY,
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
          enableYearCalModal: false,
          eventData: { 
            nowLoading: true,
            title: calEvent.event.title,
            className: calEvent.event.classNames.join(' ')
          }
        });
        // console.log(this.naverMapRef);
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
        return <Redirect to="/calendar" />;
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

  gotoDate = (date) => {
    this.setState({ enableYearCalModal: false })
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

  toggleYearCalModal = () => {
    this.setState((prevState) => {
      return {
        enableYearCalModal: !prevState.enableYearCalModal
      }
    });
  }

  navYearCal = (o) => {
    let nextYear = o === 'prev' ? this.state.yearCalData - 1 : this.state.yearCalData + 1;
    this.setState({
      yearCalData: nextYear
    });
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
          this.state.eventData && <EventModal data={ this.state.eventData } clearEvent={ this.clearEvent } API_DOMAIN={ this.API_DOMAIN } />
        }
        <div className="header">
          <button className="btn-nav nav-prev" onClick={ this.prev.bind(this) } title="이전 달">
            <FaAngleLeft size={ 16 } />
          </button>
          <button className="btn-today" onClick={ this.today.bind(this) }>오늘</button>
          <button className="btn-nav nav-next" onClick={ this.next.bind(this) } title="다음 달">
            <FaAngleRight size={ 16 } />
          </button>
          <h2 className="date">
            <button className="btn-date" onClick={ this.toggleYearCalModal }>
              <span>{`${ this.state.date.split('-')[0] }년`}</span>
              <strong>{`${ parseFloat(this.state.date.split('-')[1]) }월`}</strong>
              {
                this.state.enableYearCalModal ?
                <IoMdArrowDropup size={ 20 } />
                :
                <IoMdArrowDropdown size={ 20 } />
              }
            </button>
            {
              this.state.enableYearCalModal &&
              <div className="yearcal-modal">
                <div className="yearcal-modal-header">
                  <button className="btn-nav nav-prev" onClick={() => { this.navYearCal('prev') }}>
                    <FaAngleDoubleLeft size={ 20 } />
                  </button>
                  <strong className="yearcal-year">{ this.state.yearCalData }년</strong>
                  <button className="btn-nav nav-next" onClick={() => { this.navYearCal('next') }}>
                    <FaAngleDoubleRight size={ 20 } />
                  </button>
                </div>
                <div className="yearcal-modal-content">
                  <ul>
                    <li><a href={`/calendar/${this.state.yearCalData}/1/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-01-01`) } }>1</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/2/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-02-01`) } }>2</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/3/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-03-01`) } }>3</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/4/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-04-01`) } }>4</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/5/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-05-01`) } }>5</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/6/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-06-01`) } }>6</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/7/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-07-01`) } }>7</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/8/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-08-01`) } }>8</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/9/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-09-01`) } }>9</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/10/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-10-01`) } }>10</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/11/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-11-01`) } }>11</a></li>
                    <li><a href={`/calendar/${this.state.yearCalData}/12/1`} onClick={(e) => { e.preventDefault(); this.gotoDate(`${this.state.yearCalData}-01-01`) } }>12</a></li>
                  </ul>
                </div>
              </div>
            }
          </h2>
        </div>
        <div ref="fc" />
      </>
    )
  }
}

class EventModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coords: {
        lat: 37.3595316,
        lng: 127.1052133
      }
    }
  }

  componentDidMount() {
    if(this.props.data.address) {
      this.getCoords(this.props.data.address);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data.address) {
      this.getCoords(nextProps.data.address);
    }
  }

  getCoords = async (address) => {
    await axios.get(`//${ this.props.API_DOMAIN }/geocode/${ address }`)
    .then(response => {
      this.setState({
        coords: {
          lat: response.data.addresses[0].y,
          lng: response.data.addresses[0].x
        }
      })
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    const { data, clearEvent } = this.props;

    return (
      <>
        <div className="dimmer" onClick={ clearEvent }></div>
        <div className={`event-modal ${ data.className }`}>
          <div className="header">
            <h2 className="title">
              { data.title }
            </h2>
          </div>
          {
            data.address &&
            <div className="map-area">
              <NaverMap
                style={{
                  width: '100%',
                  height: '480px'
                }}
                defaultCenter={ this.state.coords }
                center={ this.state.coords }
                defaultZoom={ 12 }
              >
                <Marker
                  position={ this.state.coords }
                />
              </NaverMap>
              <data className="overlay">
                <FaMapMarkedAlt size={ 40 } />
                <h3 className="place">{ data.place }</h3>
                <address className="address">{ data.address }</address>
              </data>
            </div>
          }
          <div className="content">
            { data.nowLoading && <div className="loading-dimmer" /> }
            <ul>
              <li className={`item item-time ${ data.allDay ? 'is-allday' : '' }`}>
                <h3 className="item-name">
                  <FaRegClock />
                  <span>
                    {
                      data.allDay ?
                      '날짜'
                      :
                      '시작'
                    }
                  </span>
                </h3>
                <p className="item-data">
                  {
                    data.allDay ?
                    moment.utc(data.start).format('M월 D일')
                    :
                    moment.utc(data.start).format('M월 D일 HH시 mm분')
                  }
                </p>
              </li>
              {
                !data.allDay &&
                <li className="item item-time">
                  <h3 className="item-name">
                    <FaRegClock />
                    <span>종료</span>
                  </h3>
                  <p className="item-data">{ moment.utc(data.end).format('M월 D일 HH시 mm분') }</p>
                </li>
              }
              {
                data.desc &&
                <li className="item item-desc">
                  <h3 className="item-name">
                    <IoMdInformationCircleOutline size={ 24 } />
                    <span>내용</span>
                  </h3>
                  <span className="item-data">{ data.desc }</span>
                </li>
              }
              {
                !data.address && data.place &&
                <li className="item">
                  <h3 className="item-name">
                    <FaMapMarkerAlt />
                    <span>장소</span>
                  </h3>
                  <span className="item-data">{ data.place }</span>
                </li>
              }
              {
                data.link &&
                <li className="item item-link">
                  <h3 className="item-name">
                    <FaLink />
                    <span>링크</span>
                  </h3>
                  <div className="item-data">
                    {
                      data.link.split(',').map((data, key) => {
                        return (
                          <div key={ key }>
                            <a href={ data } rel="noopener noreferrer" target="_blank">{ data }</a>
                          </div>
                        )
                      })
                    }
                  </div>
                </li>
              }
              {
                data.media &&
                <li className="item item-media">
                  <h3 className="item-name">
                    <IoMdPlay />
                    <span>영상</span>
                  </h3>
                  <div className="item-data">
                    {
                      data.media.split(',').map((data, key) => {
                        return (
                          <div key={ key }>
                            { data }
                          </div>
                        )
                      })
                    }
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      </>
    )
  }
}
  
export default withLvlz(({ state, actions }) => ({
  API_DOMAIN: state.API_DOMAIN
}))(FullCalendar);
// export default FullCalendar;