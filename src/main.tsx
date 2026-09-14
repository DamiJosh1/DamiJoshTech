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

  const isIgnorableFirebaseError = (msg: string) => {
    return (
      msg.includes('Database is closing') ||
      msg.includes('closing/hidden') ||
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('the client is offline') ||
      msg.includes('code=unavailable')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason || '');
    if (isIgnorableFirebaseError(message)) {
      // Prevent browser error overlay from triggering on tab blur, offline state, or iframe reconnects
      event.preventDefault();
      console.warn('[Firebase] Handled transient offline/connection state gracefully.');
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    if (isIgnorableFirebaseError(message)) {
      event.preventDefault();
      console.warn('[Firebase] Handled transient offline/connection state gracefully.');
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
