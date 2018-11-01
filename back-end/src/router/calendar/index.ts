import * as Router from 'koa-router';
import * as calendarCtrl from './calendar.ctrl';

const calendar: Router = new Router();

calendar.get('/schedule', calendarCtrl.schedule);
calendar.get('/holiday', calendarCtrl.holiday);
calendar.get('/anniversary', calendarCtrl.anniversary);

export default calendar