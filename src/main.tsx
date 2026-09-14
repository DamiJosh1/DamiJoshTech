import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Store from './Store.tsx';
import Login from './Login.tsx';
import SignUp from './SignUp.tsx';
import ForgotPassword from './ForgotPassword.tsx';
import ResetPassword from './ResetPassword.tsx';
import './index.css';

// Intercept harmless browser/IndexedDB tab-switching error "Database is closing/hidden"
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason || '');
    if (message.includes('Database is closing') || message.includes('closing/hidden')) {
      // Prevent browser error overlay from triggering on tab blur or iframe visibility change
      event.preventDefault();
      console.warn('[Firebase Auth] Handled transient IndexedDB visibility change state gracefully.');
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    if (message.includes('Database is closing') || message.includes('closing/hidden')) {
      event.preventDefault();
      console.warn('[Firebase Auth] Handled transient error gracefully:', message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Store />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
