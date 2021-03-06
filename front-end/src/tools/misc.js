import moment from 'moment';

const YYYYMMDD = (_date, _delimeter) => {
    let date = new Date(_date);
    let delimeter = _delimeter || '-';

    return moment(date).format(`YYYY${ delimeter }MM${ delimeter }DD`)
}

const YYYYMD = (_date, _delimeter) => {
    let date = new Date(_date);
    let delimeter = _delimeter || '-';

    return moment(date).format(`YYYY${ delimeter }M${ delimeter }D`)
}

const YYYY = (_date) => {
    return moment(_date, "YYYY-MM-D").format("YYYY");
}

const M = (_date) => {
    return moment(_date, "YYYY-MM-D").format("M");
}

const zeroPad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export {
    YYYYMMDD,
    YYYYMD,
    YYYY,
    M,
    zeroPad
};