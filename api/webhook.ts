import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const {
  WHATSAPP_API_ACCESS_TOKEN,
  WHATSAPP_API_BASE_URL,
  WHATSAPP_BOT_PHONE_NUMBER_ID,
} = process.env;

const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};

const reply = async (message: WhatsAppMessage) => {
  const accessToken = WHATSAPP_API_ACCESS_TOKEN;
  const recipientId: WhatsAppPhoneID = message.from.replace(/^54911/, "541115");
  const senderPhoneNumberId: WhatsAppPhoneID = WHATSAPP_BOT_PHONE_NUMBER_ID;
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
  console.log(
    "Try to POST to CloudAPI",
    url,
    JSON.stringify(data),
    JSON.stringify(config),
  );
  const response = await axios.post(url, data, config);
  console.log("Message sent successfully:", response.data);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[WEBHOOK-TS] RECEIVED SOMETHING", JSON.stringify(req.body));

  // HANDLE MESSAGING
  try {
    const wppReq: WhatsAppRequest = req.body;
    const firstEntry = wppReq.entry[0];
    // const incomingMessage = wppReq.entry[0].changes[0].value.messages[0].text;
    const firstMessage = firstEntry.changes[0].value.messages[0];
    const incomingMessage = firstMessage.text;
    console.log("[WEBHOOK-TS] incomingMessage", incomingMessage);
    try {
      await reply(firstMessage);
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
