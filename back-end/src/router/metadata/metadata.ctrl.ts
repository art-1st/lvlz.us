import { Context } from 'koa';
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
]);

const got = require('got');

export const md = async (ctx: Context) => {
    const { body: html, url } = await got(ctx.query.url)
    const metadata = await metascraper({ html, url })
    ctx.type = 'application/json';
    ctx.body = metadata;
}