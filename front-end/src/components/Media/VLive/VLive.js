import React from 'react';

import styles from './VLive.module.scss';

const VLive = ({ videoId, width, height }) => {
    return (
        <div className={`video-container video-vlive ${ styles._ }`}>
            <iframe
                src={ `https://www.vlive.tv/embed/${ videoId }` }
                title="V Live"
                frameBorder="no"
                scrolling="no"
                width={ width }
                height={ height }
                allowFullScreen
            />
        </div>
    )
}

export default VLive;