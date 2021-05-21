import axios from 'axios';

require('dotenv').config();

const channelId = process.env.DISCORD_CHANNEL_ID;
const botToken = process.env.DISCORD_BOT_TOKEN;

function Relay() {
  this.webhookId = null;
  this.webhookToken = null;

  this.init = async (name) => {
    if (!name) {
      throw new SyntaxError('Must initialize with name');
    }

    const headers = {
      Authorization: `Bot ${botToken}`,
    };

    const config = {
      headers,
    };

    const data = {
      name,
    };

    // Create webhook
    try {
      const response = await axios.post(`https://discord.com/api/channels/${channelId}/webhooks`, data, config);

      this.webhookId = response.data.id;
      this.webhookToken = response.data.token;
    } catch (error) {
      console.error(error.response.data);
      throw new Error(error.response.data.message);
    }
  };

  this.destroy = async () => {
    const headers = {
      Authorization: `Bot ${botToken}`,
    };

    const config = {
      headers,
    };

    // Delete webhook
    try {
      await axios.delete(`https://discord.com/api/webhooks/${this.webhookId}`, config);
    } catch (error) {
      console.error(error.response.data);
      throw new Error(error.response.data.message);
    }
  };

  this.send = async (message) => {
    if (!message) {
      throw new SyntaxError('message is required');
    }

    try {
      const data = {
        content: message,
      };

      await axios.post(`https://discord.com/api/webhooks/${this.webhookId}/${this.webhookToken}`, data);
    } catch (error) {
      console.error(error.response.data);
      throw new Error(error.response.data.message);
    }
  };
}

export default Relay;
