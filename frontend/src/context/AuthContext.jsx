import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, try to fetch the current user
  useEffect(() => {
    const token = localStorage.getItem("localfix_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("localfix_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem("localfix_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const registerCustomer = async (data) => {
    const res = await authApi.registerCustomer(data);
    localStorage.setItem("localfix_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const registerWorker = async (data) => {
    const res = await authApi.registerWorker(data);
    localStorage.setItem("localfix_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("localfix_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerCustomer, registerWorker, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};