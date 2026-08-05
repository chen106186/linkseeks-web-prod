/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly OUT_BACK_GATEWAY: string
  readonly OUT_NODE_ENV: string
  readonly OUT_SOCKET_URL: string
  readonly OUT_TERMINAL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
