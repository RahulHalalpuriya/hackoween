import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('kisanai_token') || '');
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elderlyMode, setElderlyMode] = useState(() => localStorage.getItem('kisanai_elderly') === 'true');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentFarmer();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setFarmer(null);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (elderlyMode) {
      document.body.classList.add('elderly-mode');
      localStorage.setItem('kisanai_elderly', 'true');
    } else {
      document.body.classList.remove('elderly-mode');
      localStorage.setItem('kisanai_elderly', 'false');
    }
  }, [elderlyMode]);

  async function fetchCurrentFarmer() {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setFarmer(res.data.farmer);
      }
    } catch (err) {
      console.warn('Failed to fetch farmer profile, logging out:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(phone, password = 'demo') {
    try {
      const res = await axios.post('/api/auth/login', { phone, password });
      if (res.data.success) {
        localStorage.setItem('kisanai_token', res.data.token);
        setToken(res.data.token);
        setFarmer(res.data.farmer);
        return res.data;
      }
      throw new Error(res.data.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    }
  }

  async function register(registrationData) {
    try {
      const res = await axios.post('/api/auth/register', registrationData);
      if (res.data.success) {
        localStorage.setItem('kisanai_token', res.data.token);
        setToken(res.data.token);
        setFarmer(res.data.farmer);
        return res.data;
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  }

  async function updateProfile(profileData) {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      if (res.data.success) {
        setFarmer(res.data.farmer);
        return res.data;
      }
      throw new Error(res.data.message || 'Failed to update details');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update details';
      throw new Error(msg);
    }
  }

  async function updatePreferences(prefs) {
    const res = await axios.put('/api/auth/preferences', prefs);
    if (res.data.success) {
      setFarmer(res.data.farmer);
    }
    return res.data;
  }

  async function setEmergencyOverride(override) {
    const res = await axios.post('/api/agent/override', { override });
    if (res.data.success) {
      setFarmer(prev => ({ ...prev, emergencyOverride: override }));
    }
    return res.data;
  }

  function logout() {
    localStorage.removeItem('kisanai_token');
    setToken('');
    setFarmer(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        farmer,
        loading,
        elderlyMode,
        setElderlyMode,
        login,
        register,
        updateProfile,
        logout,
        updatePreferences,
        setEmergencyOverride,
        refreshFarmer: fetchCurrentFarmer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
