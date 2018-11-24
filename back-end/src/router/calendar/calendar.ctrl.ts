import { Context } from 'koa';
import * as _ from 'lodash';
import Database from '../../database';

let resultParser = (results) => {
    return _.forEach(JSON.parse(JSON.stringify(results)), (value) => {
        _.update(value, 'allDay', (n) => { return n ? true : false })
    });
}

export const schedule = async (ctx: Context) => {
    let sql = 'SELECT id, title, className, allDay, start, end FROM events_new WHERE (`start` BETWEEN "' + ctx.query.start + '" AND "' + ctx.query.end + '" OR `end` BETWEEN "' + ctx.query.start + '" AND "' + ctx.query.end + '")';
    
    await Database.query(sql)
    .then(results => {
        ctx.type = 'application/json';
        ctx.body = resultParser(results);
    })
    .catch(error => {
        ctx.status = 500;
        ctx.body = 'Error'
    });
}