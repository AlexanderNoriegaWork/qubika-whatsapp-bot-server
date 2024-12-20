import axios from "axios";
import { ask } from "./mavenagi";

const {
  WHATSAPP_API_ACCESS_TOKEN,
  WHATSAPP_API_BASE_URL,
  WHATSAPP_BOT_PHONE_NUMBER_ID,
} = process.env;

export const reply = async (message: WhatsAppMessage) => {
  const axiosResponse = await ask("What is qubika?");
  const magiResponse: MavenAGI.API.Response = axiosResponse.data;
  const botMessages = magiResponse.messages.filter((x) => x.type === "bot");
  const lastBotMessage = botMessages[botMessages.length - 1];
  console.log("[MAVEN API] Request successful:", JSON.stringify(magiResponse));
  console.log("[MAVEN API] Last bot message:", JSON.stringify(lastBotMessage));

  const accessToken = WHATSAPP_API_ACCESS_TOKEN;

  // HACK: The `.from.replace()` below is because the list of Allowed
  // Phone Numbers used during the facebook app's development has them
  // in a format (541115-...) that differs from the one in
  // the actual messages received from (at least some of) our
  // actual phones (54911-...).
  //
  // So this `.from.replace()` makes the incoming phone number data match
  // their respective entries on the Allowed Phone Numbers list.
  // (It only solves it for AR phones, obviously.)
  //
  // TODO: Either figure out a non-hacky normalization solution,
  // or remove this, when/if you upgrade to a full business app
  // that can phone any number, ie. isn't restricted by an Allowed Numbers list.
  //
  // (Already tried libphonenumber-js 3rd-party lib. Didn't cut it.)
  const recipientId: WhatsAppPhoneID = message.from.replace(/^54911/, "541115");
  const senderPhoneNumberId: WhatsAppPhoneID = WHATSAPP_BOT_PHONE_NUMBER_ID;
  const url = `${WHATSAPP_API_BASE_URL}/${senderPhoneNumberId}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: recipientId,
    type: "text",
    text: {
      preview_url: false,
      body: JSON.stringify(lastBotMessage.responses),
    },
    /*
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
    */
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
  const wppResponse = await axios.post(url, data, config);
  console.log(
    "WPP message sent successfully:",
    JSON.stringify(wppResponse.data),
  );
};
