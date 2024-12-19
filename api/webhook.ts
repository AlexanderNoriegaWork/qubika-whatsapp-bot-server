import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const { WHATSAPP_API_ACCESS_TOKEN, WHATSAPP_API_BASE_URL } = process.env;

const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};

type ReplyArgs = {
  RecipientID: `${number}`;
};

type WhatsAppID = string;

const reply = async () => {
  const accessToken = WHATSAPP_API_ACCESS_TOKEN;
  const recipientId: WhatsAppID = "54111569322090"; // TODO: Dehardcode
  // const url = `https://graph.facebook.com/v21.0/540896029101739/messages`;
  const senderPhoneNumberId: WhatsAppID = `540896029101739`;
  const url = `${WHATSAPP_API_BASE_URL}/${senderPhoneNumberId}/messages`;
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
  const response = await axios.post(url, data, config);
  console.log("Message sent successfully:", response.data);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[WEBHOOK-TS] RECEIVED SOMETHING", JSON.stringify(req.body));

  // HANDLE MESSAGING
  try {
    const incomingMessage = req.body.entry[0].changes[0].value.messages[0].text;
    console.log("[WEBHOOK-TS] incomingMessage", incomingMessage);
    try {
      await reply();
      // Must return status 200, otherwise Meta will take it
      // as delivery failure, and retry sending the message.
      res.status(200).send(`Message received: ${incomingMessage}`);
      return;
    } catch (e) {
      res.status(500).end();
      logUnknownError("Could not reply():", e);
      return;
    }
  } catch (e) {
    // Could not parse an incomingMessage.
    // Do nothing, as this could be another type of
    // interaction (user status update, or something).
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