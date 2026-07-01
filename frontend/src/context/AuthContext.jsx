import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Hardcoded MP credentials — replace with real backend auth later
// when backend/middleware/ is ready
const VALID_USERS = [
  { id: 'mp-001', username: 'mp@peoplespriority.in', password: 'mp@1234' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (username, password) => {
    const match = VALID_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (match) {
      const session = { id: match.id, username: match.username };
      setUser(session);
      localStorage.setItem('pp_user', JSON.stringify(session));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}