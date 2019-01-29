import { Context } from 'koa';
import axios from 'axios';

export const navertv = async (ctx: Context) => {
    await axios.get('https://tv.naver.com/oembed', {
        params: {
            url: `https://tv.naver.com/v/${ ctx.query.v }`,
            format: 'json'
        }
    })
    .then(response => {
        ctx.type = 'text/plain';
        ctx.body = response.data.html;
    })
    .catch(error => {
        ctx.status = 500;
        ctx.body = 'Error';
    })
}