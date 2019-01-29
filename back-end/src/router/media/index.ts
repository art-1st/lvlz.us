import * as Router from 'koa-router';
import * as mediaCtrl from './media.ctrl';

const media: Router = new Router();

media.get('/navertv', mediaCtrl.navertv);

export default media;