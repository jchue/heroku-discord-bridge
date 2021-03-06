import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { createHmac } from 'crypto';
import Relay from './relay';

require('dotenv').config();

const app = new Koa();
app.use(bodyParser());

const port = process.env.PORT || '3000';
const herokuSecret = process.env.HEROKU_SECRET;
const name = process.env.DISCORD_BOT_NAME || 'Heroku Notifier';

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
  }
});

app.use(async (ctx) => {
  // Only accept POST requests
  if (ctx.request.method !== 'POST') {
    ctx.response.status = 400;
    return;
  }

  // Check signature
  const signature = ctx.request.header['heroku-webhook-hmac-sha256'];
  const data = ctx.request.rawBody;
  const hmac = createHmac('sha256', herokuSecret).update(data).digest('base64');

  if (signature !== hmac) {
    ctx.response.status = 400;
    console.error(`Error: Incorrect signature. Expected ${hmac} but received ${signature}.`);
    return;
  }

  const appName = ctx.request.body.data.app.name;
  const buildStatus = ctx.request.body.data.status;
  const actor = ctx.request.body.actor.email;

  // Relay message
  const relay = new Relay();
  const message = process.env.DISCORD_MESSAGE_CONTENT || `${appName} build ${buildStatus} initiated by ${actor}`;

  await relay.init(name);
  await relay.send(message);
  await relay.destroy();

  ctx.response.status = 204;
});

app.listen(port);
