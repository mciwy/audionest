import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        console.log('[AuthContext] getMe response:', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          console.log('[AuthContext] Not authorized');
        } else {
          console.error('[AuthContext] getMe error:', err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
