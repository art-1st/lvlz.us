import { Context } from 'koa';
import axios from 'axios';

export const geocode = async (ctx: Context) => {
    ctx.type = 'application/json';
    ctx.body = '[{ "test": "good?" }]';
    // await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
    //     params: {
    //         query: ctx.params.query
    //     },
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //         'X-NCP-APIGW-API-KEY-ID': process.env.NCP_AI_CLIENT_ID,
    //         'X-NCP-APIGW-API-KEY': process.env.NCP_AI_CLIENT_SECRET
    //     }
    // })
    // .then(response => {
    //     ctx.type = 'application/json';
    //     ctx.body = JSON.stringify(response.data);
    // })
    // .catch(error => {
    //     ctx.status = 500;
    //     ctx.body = 'Error';
    // });
}