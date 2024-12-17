import { v4 as uuidv4 } from 'uuid';
import * as axios from 'axios';

const reply = async () => {
  const accessToken = 'EAARdOZAn9v8YBO5GcJ0ZAcPoniEY4czyvjpZCEu5v7j14Fn19ZBVdPgpoW32KhiSTGEKEIdRYR8pZAsxTTIqKYdP4I7lMsZAmcJKwQDt65ZBToqd3szvJIAzaINSayuLaBllhg5PWO4SbKYgpB00bZCf9ZAvrOIiGu6tZAaktoD7zH0wDbOqHDHo78p8o9zZA8QJNWU2lQgYZC5NH4wrZBwf4zryQc0UyT2zZAL7mLZBzAZD'; 
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
  axios.post(url, data, config)
    .then(response => {
      console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
}

export default async function handler(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("[WEBHOOK] RECEIVED SOMETHING", JSON.stringify(req.body));
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text;
    console.log("[WEBHOOK] incomingMessage", incomingMessage);
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
    reply();
    res.status(403).end();
  }
}

// https://qubika-whatsapp-bot-server.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=qubika1234&hub.challenge=5678
