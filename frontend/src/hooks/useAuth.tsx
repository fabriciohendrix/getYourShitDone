import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import api from "../api";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (
      storedToken &&
      typeof storedToken === "string" &&
      storedToken.length > 10
    ) {
      // Fetch authenticated user from backend
      api
        .get("auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            // Clear everything when detecting invalid token
            localStorage.clear();
            setUser(null);
          } else {
            setUser(null);
          }
        });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    // Does not automatically remove token/user on setUser(null)
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
