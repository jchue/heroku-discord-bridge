import axios from 'axios';

require('dotenv').config();

const discordWebhookId = process.env.DISCORD_WEBHOOK_ID;
const discordWebhookToken = process.env.DISCORD_WEBHOOK_TOKEN;

class Relay {
  constructor(message = '') {
    this.message = message;
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value;
  }

  async send() {
    if (!this.message) {
      throw new SyntaxError('message is required');
    }

    try {
      const data = {
        content: this.message,
      };

      await axios.post(`https://discord.com/api/webhooks/${discordWebhookId}/${discordWebhookToken}`, data);
    } catch (error) {
      console.error(error);
    }
  }
}

export default Relay;
