import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'sonner'; // 👈 Import kiya Toaster

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster richColors position="top-center" closeButton duration={3000} />
  </StrictMode>
);
