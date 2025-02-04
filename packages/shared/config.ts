import { z } from "zod";

const stringBool = (defaultValue: string) =>
  z
    .string()
    .default(defaultValue)
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true");

const allEnv = z.object({
  API_URL: z.string().url().default("http://localhost:3000"),
  DISABLE_SIGNUPS: stringBool("false"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),
  INFERENCE_TEXT_MODEL: z.string().default("gpt-3.5-turbo-0125"),
  INFERENCE_IMAGE_MODEL: z.string().default("gpt-4o-2024-05-13"),
  CRAWLER_HEADLESS_BROWSER: stringBool("true"),
  BROWSER_WEB_URL: z.string().url().optional(),
  BROWSER_WEBSOCKET_URL: z.string().url().optional(),
  BROWSER_CONNECT_ONDEMAND: stringBool("false"),
  CRAWLER_JOB_TIMEOUT_SEC: z.coerce.number().default(60),
  CRAWLER_NAVIGATE_TIMEOUT_SEC: z.coerce.number().default(30),
  CRAWLER_NUM_WORKERS: z.coerce.number().default(1),
  CRAWLER_DOWNLOAD_BANNER_IMAGE: stringBool("true"),
  CRAWLER_STORE_SCREENSHOT: stringBool("true"),
  CRAWLER_FULL_PAGE_SCREENSHOT: stringBool("false"),
  CRAWLER_FULL_PAGE_ARCHIVE: stringBool("false"),
  MEILI_ADDR: z.string().optional(),
  MEILI_MASTER_KEY: z.string().default(""),
  LOG_LEVEL: z.string().default("debug"),
  DEMO_MODE: stringBool("false"),
  DEMO_MODE_EMAIL: z.string().optional(),
  DEMO_MODE_PASSWORD: z.string().optional(),
  DATA_DIR: z.string().default(""),
  MAX_ASSET_SIZE_MB: z.coerce.number().default(4),
  INFERENCE_LANG: z.string().default("english"),
  // Build only flag
  SERVER_VERSION: z.string().optional(),
  DISABLE_NEW_RELEASE_CHECK: stringBool("false"),
});

const serverConfigSchema = allEnv.transform((val) => {
  return {
    apiUrl: val.API_URL,
    auth: {
      disableSignups: val.DISABLE_SIGNUPS,
    },
    inference: {
      openAIApiKey: val.OPENAI_API_KEY,
      openAIBaseUrl: val.OPENAI_BASE_URL,
      ollamaBaseUrl: val.OLLAMA_BASE_URL,
      textModel: val.INFERENCE_TEXT_MODEL,
      imageModel: val.INFERENCE_IMAGE_MODEL,
      inferredTagLang: val.INFERENCE_LANG,
    },
    crawler: {
      numWorkers: val.CRAWLER_NUM_WORKERS,
      headlessBrowser: val.CRAWLER_HEADLESS_BROWSER,
      browserWebUrl: val.BROWSER_WEB_URL,
      browserWebSocketUrl: val.BROWSER_WEBSOCKET_URL,
      browserConnectOnDemand: val.BROWSER_CONNECT_ONDEMAND,
      jobTimeoutSec: val.CRAWLER_JOB_TIMEOUT_SEC,
      navigateTimeoutSec: val.CRAWLER_NAVIGATE_TIMEOUT_SEC,
      downloadBannerImage: val.CRAWLER_DOWNLOAD_BANNER_IMAGE,
      storeScreenshot: val.CRAWLER_STORE_SCREENSHOT,
      fullPageScreenshot: val.CRAWLER_FULL_PAGE_SCREENSHOT,
      fullPageArchive: val.CRAWLER_FULL_PAGE_ARCHIVE,
    },
    meilisearch: val.MEILI_ADDR
      ? {
          address: val.MEILI_ADDR,
          key: val.MEILI_MASTER_KEY,
        }
      : undefined,
    logLevel: val.LOG_LEVEL,
    demoMode: val.DEMO_MODE
      ? {
          email: val.DEMO_MODE_EMAIL,
          password: val.DEMO_MODE_PASSWORD,
        }
      : undefined,
    dataDir: val.DATA_DIR,
    maxAssetSizeMb: val.MAX_ASSET_SIZE_MB,
    serverVersion: val.SERVER_VERSION,
    disableNewReleaseCheck: val.DISABLE_NEW_RELEASE_CHECK,
  };
});

const serverConfig = serverConfigSchema.parse(process.env);
// Always explicitly pick up stuff from server config to avoid accidentally leaking stuff
export const clientConfig = {
  demoMode: serverConfig.demoMode,
  auth: {
    disableSignups: serverConfig.auth.disableSignups,
  },
  serverVersion: serverConfig.serverVersion,
  disableNewReleaseCheck: serverConfig.disableNewReleaseCheck,
};
export type ClientConfig = typeof clientConfig;

export default serverConfig;
