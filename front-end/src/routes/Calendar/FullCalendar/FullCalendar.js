import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withLvlz } from '../../../context/lvlz';
import reactGA from 'react-ga';
import axios from 'axios';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

import EventModal from './EventModal';
import { Calendar } from 'fullcalendar';
import { YYYYMD, YYYY, M } from '../../../tools/misc';

import { FaAngleLeft, FaAngleDoubleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

import './FullCalendar.scss';

const EVENT_HOLIDAY = require('../../../assets/data/holiday.json');
const EVENT_ANNIVERSARY = require('../../../assets/data/anniversary.json');

class FullCalendar extends Component {
  PREV_URI = `/calendar/${ YYYYMD(this.props.date, '/') }`

  state = {
    onLoad: false,
    enableYearCalModal: false,
    yearCalData: Number(YYYY(this.props.date)),
    date: this.props.date,
    eventData: false
  }

  componentDidMount() {
    const { API_DOMAIN } = this.props;
    this.Calendar = new Calendar(this.refs.fc, {
      theme: true,
      locale: 'en',
      timeZone: 'UTC+09:00',
      defaultView: 'month',
      defaultDate: this.props.date,
      header: false,
      nowIndicator: true,
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit'
      },
      dayPopoverFormat: {
        day: 'numeric'
      },
      eventSources: [
        {
          url: `//${ API_DOMAIN }/calendar/schedule`
        },
        {
          events: EVENT_HOLIDAY,
          color: 'transparent',
          borderColor: 'red',
          textColor: 'red',
          className: 'c-holiday'
        },
        {
          events: EVENT_ANNIVERSARY,
          color: '#FF5858',
          textColor: 'white',
          className: 'c-anniv'
        }
      ],
      eventLimit: isMobile ? false : true,
      loading: (isLoaded, view) => {
        isLoaded
        ? this.setState({ onLoad: false })
        : this.setState({ onLoad: true });
      },
      datesRender: (info) => {
        if(this.state.onLoad) {
          let d = new Date(info.view.currentStart);
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
        axios.get(`//${ API_DOMAIN }/event/${ calEvent.event.id }`)
        .then(response => { 
          let data = response.data[0];
          this.setState({ eventData: data });

          this.PREV_URI = document.location.pathname;
          let NEXT_URI = `${ this.PREV_URI }/event/${ data.id }`

          window.history.replaceState({}, '', NEXT_URI);
          reactGA.pageview(NEXT_URI);
        });
      }
    });

    this.Calendar.render();

    if(this.props.eventId) {
      axios.get(`//${ API_DOMAIN }/event/${ this.props.eventId }`)
      .then(response => { 
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

  componentWillReceiveProps(nextProps) {
    if(this.props.calendarHeight !== nextProps.calendarHeight) {
      let m = isMobile ? 70 : 120;
      this.Calendar.setOption('height', nextProps.calendarHeight - m);
    }
  }

  gotoDate = (date) => {
    this.setState({ enableYearCalModal: false });
    this.Calendar.gotoDate(date);
  }

  navPrev = () => { this.Calendar.prev(); }
  navNext = () => { this.Calendar.next(); }
  navToday = () => { this.Calendar.today(); }
  // changeViewWeek() { this.Calendar.changeView('agendaWeek'); }
  // changeViewMonth() { this.Calendar.changeView('month'); }

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
    const { navPrev, navNext, navToday, toggleYearCalModal, navYearCal, clearEvent, renderYearCalMonths } = this;
    const { API_DOMAIN } = this.props;

    return (
      <>
        {
          this.state.eventData &&
          <EventModal data={ this.state.eventData } clearEvent={ clearEvent } API_DOMAIN={ API_DOMAIN } />
        }
        <div className="header">
          <button className="btn-nav nav-prev" onClick={ navPrev } title="이전 달">
            <FaAngleLeft size={ 16 } />
          </button>
          <button className="btn-today" onClick={ navToday }>오늘</button>
          <button className="btn-nav nav-next" onClick={ navNext } title="다음 달">
            <FaAngleRight size={ 16 } />
          </button>
          <h2 className="date">
            <button className="btn-date" onClick={ toggleYearCalModal }>
              <span>{`${ YYYY(this.state.date) }년`}</span>
              <strong>{`${ M(this.state.date) }월`}</strong>
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
                  <button className="btn-nav nav-prev" onClick={() => { navYearCal('prev') }}>
                    <FaAngleDoubleLeft size={ 20 } />
                  </button>
                  <strong className="yearcal-year">{ this.state.yearCalData }년</strong>
                  <button className="btn-nav nav-next" onClick={() => { navYearCal('next') }}>
                    <FaAngleDoubleRight size={ 20 } />
                  </button>
                </div>
                <div className="yearcal-modal-content">
                  <ul>
                    { renderYearCalMonths() }
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

  renderYearCalMonths = () => {
    let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return months.map(month => {
      return (
        <li key={ month }>
          <a
            href={`/calendar/${ this.state.yearCalData }/${ month }/1`}
            onClick={
              (e) => {
                e.preventDefault();

                let date = moment(`${ this.state.yearCalData }-${ month }-1`, 'YYYY-M-D').format('YYYY-MM-DD');
                this.gotoDate(date);
              }
            }
          >
            { month }
          </a>
        </li>
      )
    });
  }
}
  
export default withLvlz(({ state /*, actions */ }) => ({
  API_DOMAIN: state.API_DOMAIN
}))(FullCalendar);