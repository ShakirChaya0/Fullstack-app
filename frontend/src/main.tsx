import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from './App.tsx'
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { ToastContainer } from "react-toastify"

const query = new QueryClient

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={query}>
        <App />
        <ToastContainer />
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
)
