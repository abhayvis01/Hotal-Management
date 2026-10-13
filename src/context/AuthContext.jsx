import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('bluebird_user');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    // Mock Login Logic
    if (email === 'Admin@gmail.com' && password === '1234') {
      const user = { id: 'admin', email, name: 'Administrator', role: 'admin' };
      setCurrentUser(user);
      localStorage.setItem('bluebird_user', JSON.stringify(user));
      return true;
    } else {
      // Guest User Login (Deterministic ID by sanitized email so bookings always match)
      const sanitizedId = 'guest_' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      const displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const user = { id: sanitizedId, email: email.trim(), name: displayName || 'Guest User', role: 'guest' };
      setCurrentUser(user);
      localStorage.setItem('bluebird_user', JSON.stringify(user));
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bluebird_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
