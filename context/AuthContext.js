// --- REQUIRED FIX FOR AUTHENTICATION LOOP ---

import React, { createContext, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Now stores user data including farmerId
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null);

  const apiClient = useMemo(() => {
    // ... (Axios instance setup remains the same)
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  // FIX 1: Ensure farmerId is stored
  const login = (userData, jwt) => {
    setToken(jwt);
    setUser({ 
        username: userData.username, 
        farmerId: userData.farmerId, // <-- CRUCIAL: Stored for plot/schedule lookups
        isLoggedIn: true 
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // FIX 2: Define isAuthenticated based on the user object, not just the token.
  // We check if the 'user' object exists AND if it contains a 'farmerId'.
  const isAuthenticated = !!user && !!user.farmerId;
  
  const value = {
    user,
    login,
    logout,
    apiClient,
    isAuthenticated, // <-- Uses the new, robust check
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
