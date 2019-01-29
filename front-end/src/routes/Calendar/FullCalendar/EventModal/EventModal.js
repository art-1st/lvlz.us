import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

import { NaverTV, VLive } from '../../../../components'
import { NaverMap, Marker } from 'react-naver-maps';
import ReactPlayer from 'react-player';

import { FaRegClock, FaMapMarkerAlt, FaMapMarkedAlt, FaLink } from 'react-icons/fa';
import { IoIosArrowDown, IoMdInformationCircleOutline, IoMdPlay } from 'react-icons/io'
// import { isMobile } from 'react-device-detect';

class EventModal extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        coords: {
          lat: 37.564477417231146,
          lng: 126.9112866799823
        }
      }
    }
  
    ReactPlayerConf = {
      youtube: {
        playerVars: {
          enablejsapi: 1,
          controls: 1,
          showinfo: 1,
          origin: `${ document.location.protocol }//${ document.location.hostname }`
        }
      }
    }
  
    componentDidMount() {
      // if(this.props.data.address) {
      //   this.getCoords(this.props.data.address);
      // }
    }
  
    componentWillReceiveProps(nextProps) {
      if(nextProps.data.address) {
        this.getCoords(nextProps.data.address);
      }
    }

    componentWillUnmount() {
      this.setState({
        coords: {
          lat: 37.564477417231146,
          lng: 126.9112866799823
        }
      });
    }
  
    getCoords = async (address) => {
      await axios.get(`//${ this.props.API_DOMAIN }/geocode/naver`, {
        params: {
          query: address
        }
      })
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

    getNaverTvIframe = async (id) => {
      await axios.get(`//${ this.props.API_DOMAIN }/media/navertv`, {
        params: {
          v: id
        }
      })
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        console.log(error);
      })
    }
  
    render() {
      const { data, clearEvent, API_DOMAIN } = this.props;
  
      return (
        <>
          <div className="dimmer" onClick={ clearEvent }></div>
          <div className={`event-modal ${ data.className }`}>
            <div className="header">
              <h2 className="title">
                { data.title }
              </h2>
              <button className="close-modal" onClick={ clearEvent }>
                <IoIosArrowDown size={ 32 } />
              </button>
            </div>
            {
              data.address &&
              <div className="map-area">
                <NaverMap
                  style={{
                    width: '100%'
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
              {
                data.nowLoading &&
                <div className="loading-dimmer" />
              }
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
                  <li className="item item-place">
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
                            <div className="link-container" key={ key }>
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
                        data.media.split(',').map((mediaData, key) => {
                          if(mediaData.indexOf('youtube.com/') > -1) {
                            return (
                              <div className="video-container video-youtube" key={ key }>
                                <ReactPlayer className="video-container" width="100%" height="100%" config={ this.ReactPlayerConf } url={ mediaData } />
                              </div>
                            );
                          } else if(mediaData.indexOf('tv.naver.com/') > -1) {
                            let id = mediaData.split('/v/')[1];
                            return (
                              <NaverTV videoId={ id } width="480" height="270" API_DOMAIN={ API_DOMAIN } key={ key } />
                            )
                          } else if(mediaData.indexOf('vlive.tv/') > -1) {
                            let id = mediaData.split('/video/')[1];
                            return (
                              <VLive videoId={ id } width="480" height="270" key={ key } />
                            )
                          } else {
                            return (
                              <a href={ mediaData } rel="noopener noreferrer" target="_blank" className="video-container video-unknown is-not-supported" key={ key }>
                                사이트에서 시청하기
                              </a>
                            );
                          }
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

  export default EventModal;