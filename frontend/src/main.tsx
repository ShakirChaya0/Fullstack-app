import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from './App.tsx'

const query = new QueryClient

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={query}>
    <App />
  </QueryClientProvider>
)
