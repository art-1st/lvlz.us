import { Context } from 'koa';
import * as Router from 'koa-router';
import search from './search';
import calendar from './calendar';
import event from './event';
import geocode from './geocode';
import media from './media';

const router: Router = new Router();

router.use('/search', search.routes());
router.use('/calendar', calendar.routes());
router.use('/event', event.routes());
router.use('/geocode', geocode.routes());
router.use('/media', media.routes());

export default router;