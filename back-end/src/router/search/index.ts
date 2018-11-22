import * as Router from 'koa-router';
import * as searchCtrl from './search.ctrl';

const search: Router = new Router();

search.get('/:query', searchCtrl.search);
search.get('/instant/:query', searchCtrl.instantSearch);

export default search;