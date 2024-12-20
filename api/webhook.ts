import type { VercelRequest, VercelResponse } from "@vercel/node";
import { reply } from "../lib/whatsapp";

const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[WEBHOOK-TS] RECEIVED SOMETHING", JSON.stringify(req.body));

  // HANDLE MESSAGING
  try {
    const wppReq: WhatsAppRequest = req.body;
    const firstEntry = wppReq.entry[0];
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
