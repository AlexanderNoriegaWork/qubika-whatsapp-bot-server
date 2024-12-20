import axios from "axios";

const {
  MAVENAGI_APP_ID,
  MAVENAGI_AGENT_ID,
  MAVENAGI_APP_SECRET,
  MAVENAGI_ORGANIZATION_ID,
} = process.env;

const MAVENAGI_API_BASE_URL = `https://www.mavenagi-apis.com/v1/conversations/conversation-0/ask`;

export const ask = async (text: string) => {
  const url = `${MAVENAGI_API_BASE_URL}`;
  const data = {
    conversationMessageId: {
      referenceId: "test-id-2",
    },
    userId: {
      referenceId: "test-user-2",
    },
    text,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${MAVENAGI_APP_ID}:${MAVENAGI_APP_SECRET}`,
      "Content-Type": "application/json",
      "X-Organization-Id": MAVENAGI_ORGANIZATION_ID,
      "X-Agent-Id": MAVENAGI_AGENT_ID,
    },
  };
  console.log(
    "Try to POST to MAVEN AGI API",
    url,
    JSON.stringify(data),
    JSON.stringify(config),
  );
  const response = await axios.post(url, data, config);
  return response;
};
