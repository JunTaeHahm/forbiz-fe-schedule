/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NODE_ENV: string;
  readonly VITE_APP_SERVER_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
