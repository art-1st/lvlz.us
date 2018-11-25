import * as Router from 'koa-router';
import * as geocodeCtrl from './geocode.ctrl';

const geocode: Router = new Router();

geocode.get('/naver', geocodeCtrl.naver);

export default geocode;