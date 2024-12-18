import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const WHATSAPP_API_ACCESS_TOKEN = process.env.WHATSAPP_API_ACCESS_TOKEN;

const reply = async () => {
  const accessToken = WHATSAPP_API_ACCESS_TOKEN;
  const recipientId = '54111569322090'; // Replace with actual recipient ID
  const url = `https://graph.facebook.com/v21.0/540896029101739/messages`;
  const data = {
    messaging_product: 'whatsapp',
    to: recipientId,
    type: 'template',
    template: {
      name: 'hello_world',
      language: {
        code: 'en_US',
      },
    },
  };
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, data, config)
    console.log('Message sent successfully:', response.data);
  } catch (e) {
    console.error('Error sending message:', e.message);
  }
}

export default async function handler(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("[WEBHOOK] RECEIVED SOMETHING", JSON.stringify(req.body));
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text;
    console.log("[WEBHOOK] incomingMessage", incomingMessage);
    // await reply();
  } catch (e) {
    console.log("Could not log incoming message", e.message);
  }
  // check the mode and token sent are correct
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // hardcoded reply to a specific number
    res.status(403).end();
  }
}

// https://qubika-whatsapp-bot-server.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=qubika1234&hub.challenge=5678
