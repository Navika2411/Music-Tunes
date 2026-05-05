'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

const AuthContext = createContext({
  user: null,
  status: 'loading',
  data: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    status,
    data: user ? {
      userName: user.displayName || user.email?.split('@')[0],
      email: user.email,
      imageUrl: user.photoURL || `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.email}`,
    } : null,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
