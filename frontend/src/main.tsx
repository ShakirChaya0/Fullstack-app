import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from './App.tsx'
import { BrowserRouter } from 'react-router';

const query = new QueryClient

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={query}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
)
