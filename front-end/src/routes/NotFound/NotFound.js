import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import styles from './NotFound.module.scss';

class NotFound extends Component {
  render() {
    return (
      <div className={ styles.notFound }>
        <p className="message">404 Not Found. 페이지를 찾을 수 없습니다.</p>
      </div>
    )
  }
}
  
export default NotFound;