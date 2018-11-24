import { Context } from 'koa';
import Database from '../../database';

export const search = async (ctx: Context) => {
    let sql = 'SELECT id, title, `desc`, className, allDay, start, end, link, attend FROM events_new WHERE title LIKE "%' + ctx.params.query + '%"';

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

export const instantSearch = async (ctx: Context) => {
    let sql = 'SELECT title, className, start FROM events_new WHERE title LIKE "%' + ctx.params.query + '%"';

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