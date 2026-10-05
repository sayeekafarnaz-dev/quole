import {createApp} from './app.js';
const server=createApp();
const host=process.env.HOST || '127.0.0.1';
server.listen(Number(process.env.PORT || 4310),host,()=>console.log(`Quole listening on ${host}:${server.address().port}`));
