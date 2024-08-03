"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  user: string | null;
  userId: string | null;
  email: string | null;
  setToken: (token: string) => void;
  setUser: (user: string) => void;
  setUserId: (id: string) => void;
  setEmail: (email: string) => void;
  logout: () => void; // Add logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(localStorage.getItem("token"));
    setUserState(localStorage.getItem("user"));
    setUserIdState(localStorage.getItem("user_id"));
    setEmailState(localStorage.getItem("email"));
  }, []);

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setTokenState(token);
  };

  const setUser = (user: string) => {
    localStorage.setItem("user", user);
    setUserState(user);
  };

  const setUserId = (id: string) => {
    localStorage.setItem("user_id", id);
    setUserIdState(id);
  };

  const setEmail = (email: string) => {
    localStorage.setItem("email", email);
    setEmailState(email);
  };

  const logout = async () => {
    try {
      // Optional: Call the backend to invalidate the session
      await axios.post(
        "http://127.0.0.1:8000/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear user data and token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");

      setTokenState(null);
      setUserState(null);
      setUserIdState(null);
      setEmailState(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userId,
        email,
        setToken,
        setUser,
        setUserId,
        setEmail,
        logout, // Add logout to the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
