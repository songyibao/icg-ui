import { config as loadEnv } from 'dotenv'
import { generateService } from '@umijs/openapi'

// 按 Vite 习惯顺序加载多套 .env 文件
const mode = process.env.MODE || process.env.NODE_ENV || 'development'
loadEnv() // .env
loadEnv({ path: `.env.local`, override: true })
loadEnv({ path: `.env.${mode}`, override: true })
loadEnv({ path: `.env.${mode}.local`, override: true })

// 优先 OPENAPI_SCHEMA_URL；否则由 VITE_API_BASE_URL 推导；最后回退默认值
const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
const DEFAULT_SCHEMA_PATH = '/api/v2/api-docs?group=%E9%BB%98%E8%AE%A4%E5%88%86%E7%BB%84'
const schemaPath = process.env.OPENAPI_SCHEMA_URL || `${VITE_API_BASE_URL}${DEFAULT_SCHEMA_PATH}`

generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath,
  serversPath: './src',
})
