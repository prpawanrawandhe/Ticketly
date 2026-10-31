import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null
  );
  const [access_token, setaccess_token] = useState(localStorage.getItem("access") || null)

  return (
    <AuthContext.Provider value={{ username, setUsername,access_token, setaccess_token }}>
      {children}
    </AuthContext.Provider>
  );
};