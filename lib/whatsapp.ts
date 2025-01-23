import axios from "axios";
import { type AxiosResponse } from "axios";

const {
  WHATSAPP_API_ACCESS_TOKEN,
  WHATSAPP_API_BASE_URL,
  WHATSAPP_BOT_PHONE_NUMBER_ID,
} = process.env;

const LOG_CTX = "[lib/whatsapp]";

export const replyTo = async (
  recipientId: WhatsAppPhoneID,
  outgoing: string,
): Promise<AxiosResponse<any, any>> => {
  const accessToken = WHATSAPP_API_ACCESS_TOKEN;
  const senderPhoneNumberId: WhatsAppPhoneID = WHATSAPP_BOT_PHONE_NUMBER_ID;
  const url = `${WHATSAPP_API_BASE_URL}/${senderPhoneNumberId}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: recipientId,
    type: "text",
    text: {
      preview_url: false,
      body: outgoing,
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
    `${LOG_CTX} Trying to POST to CloudAPI`,
    url,
    JSON.stringify(data),
    JSON.stringify(config),
  );
  const wppResponse = await axios.post(url, data, config);
  console.log(
    `${LOG_CTX} Message sent successfully:`,
    JSON.stringify(wppResponse.data),
  );
  return wppResponse;
};
