/**
 * Formats Firebase Authentication errors with clear explanations and action steps
 */
export function formatFirebaseAuthError(err: any): string {
  if (!err) return 'Authentication failed. Please try again.';

  const code = err.code || '';
  const message = err.message || '';

  // Domain not authorized in Firebase Console
  if (code === 'auth/unauthorized-domain') {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
    return `Security domain approval needed: "${hostname}" is not yet authorized in Firebase. Please add "${hostname}" and "vercel.app" in Firebase Console > Authentication > Settings > Authorized domains.`;
  }

  // Provider not enabled in Firebase Console
  if (code === 'auth/operation-not-allowed') {
    return 'This sign-in method is not enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method, click your provider (Google or Email/Password), and toggle "Enable".';
  }

  if (code === 'auth/popup-blocked') {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in window was closed before completing.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Sign-in popup was cancelled by a new request.';
  }

  if (code === 'auth/account-exists-with-different-credential') {
    return 'An account already exists with this email using a different sign-in method.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connection and try again.';
  }

  if (code === 'auth/invalid-api-key') {
    return 'Invalid Firebase API key. Please check your Firebase configuration.';
  }

  return message || 'Authentication failed. Please try again.';
}

