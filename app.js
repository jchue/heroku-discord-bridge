import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { createHmac } from 'crypto';

require('dotenv').config();

const app = new Koa();
app.use(bodyParser());

const port = process.env.PORT || '3000';
const herokuSecret = process.env.HEROKU_SECRET;

app.use(async (ctx) => {
  if (ctx.request.method !== 'POST') {
    ctx.response.status = 400;
    return;
  }

  const signature = ctx.request.header['heroku-webhook-hmac-sha256'];
  const data = ctx.request.rawBody;
  const hmac = createHmac('sha256', herokuSecret).update(data).digest('base64');

  if (signature !== hmac) {
    ctx.response.status = 400;
    ctx.body = hmac;
    return;
  }

  ctx.response.status = 204;
});

app.listen(port);
