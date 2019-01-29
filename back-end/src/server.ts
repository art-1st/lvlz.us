import * as Koa from 'koa';
import * as serverless from 'serverless-http';
import router from './router';

const cors = require('@koa/cors');

export default class Server {
  app: Koa;

  constructor() {
    this.app = new Koa();
    this.middleware();
  }

  middleware(): void {
    const { app } = this;
    app.use(cors({
          origin: "https://lovelyzin.us"
        }))
       .use(router.routes())
       .use(router.allowedMethods());
  }

  listen(port: number): void {
    const { app } = this;
    app.listen(port);
    console.log('Server is running on Port', port);
  }

  serverless(): any {
    const { app } = this;
    return serverless(app);
  }
}