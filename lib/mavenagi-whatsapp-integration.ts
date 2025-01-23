import { ask } from "./mavenagi";
import { replyTo } from "./whatsapp";

export const isIncomingMessageRequest = (
  x: any,
): x is WhatsApp.IncomingMessageRequest => {
  try {
    return (
      typeof x.entry[0].changes[0].value.messages[0].text.body === "string"
    );
  } catch (e) {
    return false;
  }
};

const LOG_CTX = "[lib/mavenagi-whatsapp-integration]" as const;

export const handleChatMessage = async (
  wppReq: WhatsApp.IncomingMessageRequest,
) => {
  const firstEntry = wppReq.entry[0];
  const firstMessage = firstEntry.changes[0].value.messages[0];
  console.log(`${LOG_CTX} incomingMessage`, firstMessage.text);
  const recipientId: WhatsAppPhoneID = firstMessage.from.replace(
    /^54911/,
    "541115",
  );
  const axiosResponse = await ask(
    firstMessage.text.body,
    recipientId,
    recipientId,
  );
  console.log(`${LOG_CTX} got a raw response`, axiosResponse.data);
  const magiResponse: MavenAGI.API.Response = axiosResponse.data;
  const botMessages = magiResponse.messages.filter((x) => x.type === "bot");
  const lastBotMessage = botMessages[botMessages.length - 1];
  const lastBotMessageText =
    lastBotMessage !== undefined
      ? lastBotMessage.responses.reduce((acc, x) => {
          return x.type === "text" ? acc + x.text : acc;
        }, "")
      : "";
  console.log(
    `${LOG_CTX} MavenAGI request successful:`,
    JSON.stringify(magiResponse),
  );
  console.log(`${LOG_CTX} MavenAGI bot messages:`, JSON.stringify(botMessages));
  console.log(
    `${LOG_CTX} MavenAGI last bot message:`,
    JSON.stringify(lastBotMessage),
  );
  return await replyTo(recipientId, lastBotMessageText);
};
