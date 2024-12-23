import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleChatMessage,
  isIncomingMessageRequest,
} from "../lib/mavenagi-whatsapp-integration";

const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[webhook] RECEIVED SOMETHING", JSON.stringify(req.body));

  // HANDLE MESSAGING
  const { body } = req;
  if (isIncomingMessageRequest(body)) {
    try {
      await handleChatMessage(body);
      res.status(200).send(`Message handled`);
    } catch (e) {
      res.status(500).end();
      logUnknownError("[webhook] Could not handle chat message", e);
    }
    return;
  } else {
    console.log("[webhook/handler] Could not parse IncomingChangeRequest.");
  }

  // HANDLE WEBHOOK VERIFICATION
  // (should only happen once, or whenever the facebook app's
  // whatsapp product's webhook URL config is modified).

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
