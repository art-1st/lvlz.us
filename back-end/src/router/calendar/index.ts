import * as Router from 'koa-router';
import * as calendarCtrl from './calendar.ctrl';

const calendar: Router = new Router();

calendar.get('/schedule', calendarCtrl.schedule);

export default calendar