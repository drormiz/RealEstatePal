const metaEnv = import.meta.env;

export const env = {
  serverAddress: metaEnv.VITE_SERVER_ADDRESS,
  geminiKey: metaEnv.VITE_APP_GEMINI_API_KEY,
};
