import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from '../firebase';

const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly'
];

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getGoogleDriveAccessToken = async (forcePrompt: boolean = false): Promise<string> => {
  if (cachedAccessToken && !forcePrompt) {
    return cachedAccessToken;
  }

  if (isSigningIn) {
    throw new Error('Sign-in flow already in progress');
  }

  isSigningIn = true;
  try {
    const provider = new GoogleAuthProvider();
    DRIVE_SCOPES.forEach(scope => provider.addScope(scope));
    
    if (forcePrompt) {
      provider.setCustomParameters({ prompt: 'consent select_account' });
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Drive access token. Please ensure third-party popups are enabled.');
    }

    cachedAccessToken = credential.accessToken;
    return cachedAccessToken;
  } finally {
    isSigningIn = false;
  }
};

export const clearDriveToken = () => {
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  iconLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export const fetchDriveFiles = async (
  token: string, 
  folderId?: string, 
  searchQuery?: string
): Promise<DriveFileItem[]> => {
  let qParts = [
    "trashed = false",
    "(mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder')"
  ];

  if (folderId && folderId !== 'root') {
    qParts.push(`'${folderId}' in parents`);
  }

  if (searchQuery && searchQuery.trim()) {
    const cleanSearch = searchQuery.trim().replace(/'/g, "\\'");
    qParts.push(`name contains '${cleanSearch}'`);
  }

  const q = qParts.join(' and ');
  const fields = 'files(id, name, mimeType, thumbnailLink, webContentLink, iconLink, size, createdTime, modifiedTime)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=100&orderBy=folder,name`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      clearDriveToken();
      throw new Error('Google Drive authorization expired. Please reconnect.');
    }
    throw new Error(`Google Drive API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.files || [];
};

export const fetchDriveImageBase64 = async (token: string, fileId: string): Promise<{ base64: string; mimeType: string }> => {
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meta = await metaRes.json();
  const mimeType = meta.mimeType || 'image/jpeg';

  const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!contentRes.ok) {
    throw new Error(`Failed to fetch image binary from Google Drive (${contentRes.status})`);
  }

  const blob = await contentRes.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
