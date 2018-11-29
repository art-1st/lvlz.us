import * as Router from 'koa-router';
import * as metadataCtrl from './metadata.ctrl';

const metadata: Router = new Router();

metadata.get('/', metadataCtrl.md);

export default metadata;