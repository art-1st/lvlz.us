import * as dotenv from 'dotenv';
import Server from './server';

dotenv.config();

const server: Server = new Server();

server.listen(4000);
