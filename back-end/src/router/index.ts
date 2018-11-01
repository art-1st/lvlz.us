import { Context } from 'koa';
import * as Router from 'koa-router';
import search from './search';
import calendar from './calendar';
import event from './event';

const router: Router = new Router();

router.use('/search', search.routes());
router.use('/calendar', calendar.routes());
router.use('/event', event.routes());

export default router;