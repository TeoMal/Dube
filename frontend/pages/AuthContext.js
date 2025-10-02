import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    username: "",
  });

  const login = (username) => {
    setUser({ isLoggedIn: true, username });
  };

  const logout = () => {
    setUser({ isLoggedIn: false, username: "" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
