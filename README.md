# Heroku-Discord Bridge

## Overview

This application serves as a webhook that posts a message in a specified Discord channel whenever certain actions are executed in Heroku (e.g., build initiated, application deployed, etc.). It's built using [Koa](https://koajs.com), a lightweight framework for Node.js.

Currently, it only supports notifications in a single Discord channel.

## Environment Variables

### DISCORD_BOT_NAME

(Optional) Specify a name for the bot sending the message. If not specified, defaults to "Heroku Notifier"

### DISCORD_MESSAGE_CONTENT

(Optional) Specify a static message to use. If not specified, defaults to "APP build STATUS initiated by EMAIL"

### DISCORD_BOT_TOKEN

The Discord bot's token

1. Navigate [Discord Developer Portal](https://discord.com/developers/applications).
1. Select the **New Application** button. Enter a unique name, then select the **Create** button.
1. Select **Bot** from the sidebar.
1. Select the **Add Bot** button. Then select the **Yes, do it! button**.
1. Under **Build-A-Bot**, under **Token**, select the **Copy** button.

### DISCORD_CHANNEL_ID

The ID of the Discord channel in which to post the messages. Can be found by referencing the channel's URL using the browser-based version of Discord.

### HEROKU_SECRET

This key is used by Heroku to sign requests and is generated by Heroku when a webhook is created. See the [Heroku Documentation](https://devcenter.heroku.com/articles/app-webhooks#receiving-webhooks) for more details. The bridge will check all requests using this shared secret.

1. In the [Heroku dashboard](https://dashboard.heroku.com/apps), open the app for which to receive messages.
1. Select **More** -> **View webhooks**.
1. Select the **Create Webhook** button.
1. Enter:
    - **Webhook Name (optional):** How the webhook will be referenced in the control panel
    - **Payload URL (https):** The URL where the bridge is hosted
    - **Secret (optional):** A random string that will be used to sign requests; automatically generated if not specified
1. Select the **Event Types** to subscribe. Then select the **Add Webhook** button.
1. The secret will be displayed on the subsequent screen. (Note that this will be the only time it will be displayed.)

Only one secret is supported, so if you would like to receive messages for multiple Heroku applications, you can specify the same secret when creating the webhook for each application.

## Deployment

```sh
npm run build
npm run start
```