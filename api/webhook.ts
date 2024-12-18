import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const WHATSAPP_API_ACCESS_TOKEN = process.env.WHATSAPP_API_ACCESS_TOKEN;

const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};

const reply = async () => {
  const accessToken = WHATSAPP_API_ACCESS_TOKEN;
  const recipientId = "54111569322090"; // Replace with actual recipient ID
  const url = `https://graph.facebook.com/v21.0/540896029101739/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: recipientId,
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
  };
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.post(url, data, config);
    console.log("Message sent successfully:", response.data);
  } catch (e: unknown) {
    logUnknownError("[reply()] Error sending message:", e);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[WEBHOOK-TS] RECEIVED SOMETHING", JSON.stringify(req.body));

  // HANDLE MESSAGING
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text;
    console.log("[WEBHOOK-TS] incomingMessage", incomingMessage);
    try {
      await reply();
    } catch (e) {
      // Must return status 200, otherwise Meta will take it
      // as delivery failure, and retry sending the message.
      res.status(200).send(`Message received: ${incomingMessage}`);
    }
  } catch (e) {
    logUnknownError("[reply()] Could not log incoming message:", e);
  }

  // HANDLE WEBHOOK VERIFICATION (SHOULD ONLY HAPPEN ONCE EVER)

  const mode = req.query["hub.mode"];
  if (mode === "subscribe") {
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
      console.log("[WEBHOOK-TS] verified successfully!");
    } else {
      res.status(403).end();
      console.log("[WEBHOOK-TS] could not verify webhook token!");
    }
  } else {
    res.status(200).end();
    console.log("[handler()] Unknown request. Responding with empty 200.");
  }
}

// https://qubika-whatsapp-bot-server.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=qubika1234&hub.challenge=5678
