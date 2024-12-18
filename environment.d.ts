declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WHATSAPP_API_ACCESS_TOKEN: string;
    }
  }
}
