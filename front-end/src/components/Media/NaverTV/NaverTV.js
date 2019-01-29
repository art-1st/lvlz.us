import React, { Component } from 'react';
import axios from 'axios';

import styles from './NaverTV.module.scss';

class NaverTV extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframe: ''
        }
    }

    componentWillMount() {
        axios.get(`//${ this.props.API_DOMAIN }/media/navertv`, {
            params: {
                v: this.props.videoId
            }
        })
        .then(response => {
            this.setState({
                iframe: response.data
            })
        })
        .catch(error => {
            console.error(error);
        })
    }

    render() {
        return (
            <div className={`video-container video-navertv ${ styles._ }`} dangerouslySetInnerHTML={{ __html: this.state.iframe }}>
            </div>
        )
    }
}

export default NaverTV;