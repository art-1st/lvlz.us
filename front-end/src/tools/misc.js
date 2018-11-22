import replaceAll from 'replaceall';

const YYYYMMDDHyphenToSlash = (date) => {
    return replaceAll('-', '/', date);
}

const YYYYMMDDSlashToHyphen = (date) => {
    return replaceAll('/', '-', date);
}

const YYYMMDDtoYYYYMD = (date) => {
    let S;

    if(date.indexOf('-') > -1) {
        S = '-';
    } else if(date.indexOf('/') > -1) {
        S = '/';
    } else {
        return console.error('format is not compatible');
    }

    if(date.length === 10) {
        let YYYY = Number(date.substring(0, 4));
        let M = Number(date.substring(5, 7))
        let D = Number(date.substring(8, 10));

        return `${ YYYY }${ S }${ M }${ S }${ D }`;
    } else {
        return console.error('format is not compatible');
    }
}

export {
    YYYYMMDDHyphenToSlash,
    YYYYMMDDSlashToHyphen,
    YYYMMDDtoYYYYMD
};