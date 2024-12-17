import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("WEBHOOK RECEIVED SOMETHING", JSON.stringify(req.body));
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text;
    console.log("incomingMessage", incomingMessage);
  } catch (e) {
    console.log("Could not log incoming message", e.message);
  }
  // check the mode and token sent are correct
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.status(403).end();
  }
}

// https://qubika-whatsapp-bot-server.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=qubika1234&hub.challenge=5678
