import { Context } from 'koa';
import Database from '../../database';

export const event = async (ctx: Context) => {
    let sql = 'SELECT id, title, `desc`, className, allDay, start, end, place, address, tag, link, media, attend FROM events_new WHERE id = "' + ctx.params.id + '"';

    await Database.query(sql)
    .then(results => {
        if(JSON.parse(JSON.stringify(results)).length) {
            ctx.type = 'application/json';
            ctx.body = JSON.stringify(results);
        } else {
            ctx.status = 404;
            ctx.body = 'Not Found';
        };
    })
    .catch(error => {
        ctx.status = 500;
        ctx.body = 'Error';
    });
}