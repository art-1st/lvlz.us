import { Context } from 'koa';
import axios from 'axios';

export const geocode = async (ctx: Context) => {
    let CLIENT_ID = process.env.NCP_AI_CLIENT_ID;
    let CLIENT_SECRET = process.env.NCP_AI_CLIENT_SECRET;
    let QUERY = decodeURI(ctx.params.query);
    
    await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
        params: {
            query: QUERY
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
            'X-NCP-APIGW-API-KEY': CLIENT_SECRET
        }
    })
    .then(response => {
        ctx.type = 'application/json';
        ctx.body = JSON.stringify(response);
    })
    .catch(error => {
        ctx.status = 500;
        ctx.body = 'Error';
    });
}