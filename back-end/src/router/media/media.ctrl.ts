import { Context } from 'koa';
import axios from 'axios';

// VPC 외부 인터넷 액세스 작업 진행해야 함.

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