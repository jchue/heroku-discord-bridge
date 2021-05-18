import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Koa from 'koa';

require('dotenv').config();

const app = new Koa();
const port = process.env.PORT || '3000';

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(port);
