/// <reference types="vite/client" />

// 扩展 Vite 环境变量类型，声明我们自定义的变量
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
