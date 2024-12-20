namespace MavenAGI {
  type Capability = "MARKDOWN" | "FORMS" | "IMAGES";
  type ResponseLength = "MEDIUM";
  type DateString = string;
  type ConversationID = {
    referenceId: string;
    type: string;
    appId: string;
    organizationId: string;
    agentId: string;
  };
  type Message =
    | {
        type: "bot";
        createdAt: DateString;
        updatedAt: DateString;
        conversationMessageId: unknown;
        botMessageType: "BOT_RESPONSE";
        responses: unknown[];
        metadata: unknown;
      }
    | {
        type: "user";
        userId: unknown;
        text: string;
        userMessageType: "USER";
        createdAt: DateString;
        updatedAt: DateString;
        conversationMessageId: unknown;
        language: "en";
        attachments: unknown[];
      };
  type ResolutionStatus = "In progress";
  type Analysis = {
    userRequest: string;
    agentResponse: string;
    resolutionStatus: ResolutionStatus;
    category: string;
    sentiment: string;
  };
  namespace API {
    type Response = {
      responseConfig: {
        capabilities: Capability[];
        isCopilot: boolean;
        responseLength: ResponseLength;
      };
      createdAt: DateString;
      updatedAt: DateString;
      tags: string[];
      metadata: Record<any, any>;
      conversationId: ConversationID;
      messages: Message[];
      analysis: Analysis;
    };
  }
}
