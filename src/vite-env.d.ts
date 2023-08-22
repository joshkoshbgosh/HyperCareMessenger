/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GQL_TOKEN: string;
  readonly VITE_GQL_SCOPE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
