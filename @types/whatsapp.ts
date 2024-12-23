type WhatsAppPhoneID = string;

type WhatsAppContact = {
  profile: {
    name: string;
  };
  wa_id: WhatsAppPhoneID;
};

type WhatsAppMessage = {
  from: WhatsAppPhoneID;
  id: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: "text";
};

type WhatsAppChange = {
  value: {
    messaging_product: "whatsapp";
    metadata: {
      display_phone_number: string;
      phone_number_id: WhatsAppPhoneID;
    };
    contacts: WhatsAppContact[];
    messages: WhatsAppMessage[];
  };
  field: "messages";
};

type WhatsAppEntry = {
  id: WhatsAppPhoneID;
  changes: WhatsAppChange[];
};

type WhatsAppRequest = {
  object: "whatsapp_business_account";
  entry: WhatsAppEntry[];
};

declare namespace WhatsApp {
  type IncomingMessageRequest = WhatsAppRequest & {
    __brand: "IncomingMessageRequest";
  };
}
