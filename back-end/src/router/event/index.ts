import * as Router from 'koa-router';
import * as eventCtrl from './event.ctrl';

const event: Router = new Router();

event.get('/:id', eventCtrl.event);

export default event;