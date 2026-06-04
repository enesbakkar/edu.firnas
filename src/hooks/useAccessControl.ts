import { useState, useEffect, useCallback } from 'react';
import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { GoogleUser } from './useGoogleAuth';

export type AccessStatus = 'loading' | 'approved' | 'pending' | 'rejected';

/**
 * Google Sign-In sonrası Firestore'daki erişim durumunu kontrol eder.
 *
 * Koleksiyon yapısı:
 *   users/{email} → { status: 'pending'|'approved'|'rejected', name, picture, requestedAt, reviewedAt }
 */
export function useAccessControl(user: GoogleUser | null) {
  const [status, setStatus] = useState<AccessStatus>('loading');

  const checkAccess = useCallback(async (u: GoogleUser) => {
    setStatus('loading');
    try {
      const ref  = doc(db, 'users', u.email);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setStatus(data.status as AccessStatus);
      } else {
        // İlk kez — "pending" olarak kaydet
        await setDoc(ref, {
          email:       u.email,
          name:        u.name,
          picture:     u.picture,
          sub:         u.sub,
          status:      'pending',
          requestedAt: serverTimestamp(),
        });
        setStatus('pending');
      }
    } catch (err) {
      console.error('[AccessControl] Firestore hatası:', err);
      setStatus('pending'); // hata durumunda beklet
    }
  }, []);

  useEffect(() => {
    if (user) {
      void checkAccess(user);
    } else {
      setStatus('loading');
    }
  }, [user, checkAccess]);

  return { status };
}
