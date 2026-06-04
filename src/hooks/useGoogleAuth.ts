import { useState, useEffect, useCallback } from 'react';

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const STORAGE_KEY = 'fico_google_user';

function parseJwt(token: string): GoogleUser | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as GoogleUser;
  } catch {
    return null;
  }
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as GoogleUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const handleCredential = useCallback((credential: string) => {
    const parsed = parseJwt(credential);
    if (parsed) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setUser(parsed);
    }
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    // Google One Tap sign out
    if ((window as unknown as Record<string, unknown>).google) {
      (window as unknown as { google: { accounts: { id: { disableAutoSelect: () => void } } } })
        .google.accounts.id.disableAutoSelect();
    }
  }, []);

  useEffect(() => {
    // GSI kütüphanesi yüklendikten sonra initialize et
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId) {
      console.warn('[Auth] VITE_GOOGLE_CLIENT_ID tanımlı değil.');
      setLoading(false);
      return;
    }

    const initGSI = () => {
      const g = (window as unknown as { google?: { accounts: { id: { initialize: (cfg: object) => void; renderButton: (el: HTMLElement, cfg: object) => void } } } }).google;
      if (!g) return;
      g.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: { credential: string }) => handleCredential(resp.credential),
        auto_select: true,
        cancel_on_tap_outside: false,
      });
      setLoading(false);
    };

    if ((window as unknown as { google?: unknown }).google) {
      initGSI();
    } else {
      const script = document.getElementById('gsi-script');
      if (script) {
        script.addEventListener('load', initGSI);
      } else {
        setLoading(false);
      }
    }
  }, [handleCredential]);

  return { user, loading, signOut, handleCredential };
}
