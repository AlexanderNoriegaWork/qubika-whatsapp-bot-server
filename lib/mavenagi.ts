import axios from "axios";

const {
  MAVENAGI_APP_ID,
  MAVENAGI_AGENT_ID,
  MAVENAGI_APP_SECRET,
  MAVENAGI_ORGANIZATION_ID,
  MAVENAGI_API_BASE_URL,
} = process.env;

const LOG_CTX = "[lib/mavenagi]";

export const ask = async (text: string) => {
  const url = `${MAVENAGI_API_BASE_URL}/conversations/conversation-5/ask`;
  const data = {
    conversationMessageId: {
      referenceId: new Date().toISOString(),
    },
    userId: {
      referenceId: "test-user-2",
    },
    text,
  };
  const config = {
    headers: {
      Authorization: `Basic ${Buffer.from(`${MAVENAGI_APP_ID}:${MAVENAGI_APP_SECRET}`).toString("base64")}`,
      "Content-Type": "application/json",
      "X-Organization-Id": MAVENAGI_ORGANIZATION_ID,
      "X-Agent-Id": MAVENAGI_AGENT_ID,
    },
  };
  try {
    console.log(
      `${LOG_CTX}[ask] Try to POST to MAVEN AGI API`,
      url,
      JSON.stringify(data),
      JSON.stringify(config),
    );
    const response = await axios.post(url, data, config);
    return response;
  } catch (e) {
    console.log("Could not POST to MAVEN AGI API", JSON.stringify(e));
    throw e;
  }
};

export const postDocument = async (content: string) => {
  const url = `${MAVENAGI_API_BASE_URL}/knowledge/qubika-help-center-v2/document`;
  const data = {
    knowledgeDocumentId: {
      referenceId: "qubika-website-v2",
    },
    contentType: "MARKDOWN",
    content,
    title: "Qubika website",
  };
  const config = {
    headers: {
      Authorization: `Basic ${Buffer.from(`${MAVENAGI_APP_ID}:${MAVENAGI_APP_SECRET}`).toString("base64")}`,
      "Content-Type": "application/json",
      "X-Organization-Id": MAVENAGI_ORGANIZATION_ID,
      "X-Agent-Id": MAVENAGI_AGENT_ID,
    },
  };
  try {
    console.log(
      `${LOG_CTX}[postDocument] Try to POST to MAVEN AGI API`,
      url,
      JSON.stringify(data).slice(0, 500),
      JSON.stringify(config),
    );
    const response = await axios.post(url, data, config);
    return response;
  } catch (e) {
    console.log("Could not POST to MAVEN AGI API", JSON.stringify(e));
    throw e;
  }
};
