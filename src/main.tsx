import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Store from './Store.tsx';
import Login from './Login.tsx';
import SignUp from './SignUp.tsx';
import ForgotPassword from './ForgotPassword.tsx';
import ResetPassword from './ResetPassword.tsx';
import './index.css';

// Intercept harmless browser/IndexedDB tab-switching and transient Firestore offline errors
if (typeof window !== 'undefined') {
  // Ensure the custom favicon is dynamically applied to all favicon links in the document
  try {
    const faviconUrl = '/images/favicondami.ico?v=' + Date.now();
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    if (existingLinks.length > 0) {
      existingLinks.forEach(link => link.setAttribute('href', faviconUrl));
    } else {
      const link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
  } catch (e) {
    // Ignore DOM favicon replacement error
  }

  const isIgnorableExternalError = (msg: string, stack: string = '', filename: string = '') => {
    const combined = `${msg} ${stack} ${filename}`;
    return (
      msg.includes('Database is closing') ||
      msg.includes('closing/hidden') ||
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('the client is offline') ||
      msg.includes('code=unavailable') ||
      combined.includes('chrome-extension://') ||
      combined.includes('moz-extension://') ||
      combined.includes('safari-extension://') ||
      combined.includes('Failed to connect to MetaMask') ||
      combined.includes('inpage.js')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason || '');
    const stack = reason?.stack || '';
    if (isIgnorableExternalError(message, stack)) {
      // Prevent browser error overlay from triggering on tab blur, offline state, or browser extension injections
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    const stack = event.error?.stack || '';
    const filename = event.filename || '';
    if (isIgnorableExternalError(message, stack, filename)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
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
