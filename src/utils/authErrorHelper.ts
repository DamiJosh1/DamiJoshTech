/**
 * Formats Firebase Authentication errors with clear explanations and action steps
 */
export function formatFirebaseAuthError(err: any): string {
  if (!err) return 'Authentication failed. Please try again.';

  const code = err.code || '';
  const message = err.message || '';

  // Google sign in / popup specific error codes
  if (code === 'auth/operation-not-allowed') {
    return 'Google Sign-In is not yet enabled in your Firebase Console. Please go to Firebase Console > Authentication > Sign-in method, click Google, and switch it to "Enable".';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This web domain is not authorized in Firebase. Please add this domain or *.run.app to Firebase Console > Authentication > Settings > Authorized Domains.';
  }

  if (code === 'auth/popup-blocked') {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again, or click "Open in new tab".';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in was cancelled before completing.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Sign-in popup was superseded by another operation.';
  }

  if (code === 'auth/account-exists-with-different-credential') {
    return 'An account already exists with the same email address but different sign-in credentials. Sign in using the original method.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connection and try again.';
  }

  if (code === 'auth/invalid-api-key') {
    return 'Invalid Firebase API key. Please check your Firebase project configuration.';
  }

  return message || 'Authentication failed. Please check your network or try again.';
}
