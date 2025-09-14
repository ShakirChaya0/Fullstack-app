/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_PRODUCTS_URL: string
  readonly VITE_NEW_PRODUCTS_URL: string
  readonly VITE_NEW_PRICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}