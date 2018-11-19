import { Context } from 'koa';
import * as router from 'koa-router';
import Database from '../../database';

export const event = async (ctx: Context) => {
    let sql = 'SELECT id, title, `desc`, className, allDay, start, end, link, attend FROM events_new WHERE id = "' + ctx.params.id + '"';

    await Database.query(sql)
    .then(results => {
        ctx.type = 'application/json';
        ctx.body = JSON.stringify(results);
    })
    .catch(error => {
        ctx.status = 500;
        ctx.body = 'Error';
    });
}