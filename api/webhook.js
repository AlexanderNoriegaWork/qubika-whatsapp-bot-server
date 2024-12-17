import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).json(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.status(403).end();
  }
}

