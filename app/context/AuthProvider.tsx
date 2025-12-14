// "use client";

// import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// type DecodedToken = {
//   userId?: string;
//   username?: string;
//   email?: string;
//   exp?: number; // seconds since epoch
//   [k: string]: any;
// };

// type AuthState = {
//   token: string | null;
//   user: DecodedToken | null;
//   isAuthenticated: boolean;
// };

// type AuthContextValue = AuthState & {
//   login: (token: string) => void;
//   logout: () => void;
//   getAuthHeaders: () => Record<string, string>;
// };

// const STORAGE_KEY = "token";
// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// function parseJwt(token: string): DecodedToken | null {
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) return null;
//     let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
//     while (payload.length % 4) payload += "=";
//     const decoded = atob(payload);
//     const json = decodeURIComponent(
//       decoded
//         .split("")
//         .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
//         .join("")
//     );
//     return JSON.parse(json) as DecodedToken;
//   } catch {
//     return null;
//   }
// }

// export function useAuthContextValueInitial(): {
//   state: AuthState;
//   login: (token: string) => void;
//   logout: () => void;
//   getAuthHeaders: () => Record<string, string>;
// } {
//   const [token, setToken] = useState<string | null>(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem(STORAGE_KEY);
//   });

//   const [user, setUser] = useState<DecodedToken | null>(() => {
//     if (!token) return null;
//     return parseJwt(token);
//   });

//   // schedule auto logout
//   useEffect(() => {
//     if (!token) return;
//     const decoded = parseJwt(token);
//     if (!decoded || !decoded.exp) return;

//     const nowMs = Date.now();
//     const expMs = decoded.exp * 1000;
//     const msLeft = expMs - nowMs;

//     if (msLeft <= 0) {
//       // already expired
//       localStorage.removeItem(STORAGE_KEY);
//       setToken(null);
//       setUser(null);
//       return;
//     }

//     const timer = window.setTimeout(() => {
//       // expire
//       localStorage.removeItem(STORAGE_KEY);
//       setToken(null);
//       setUser(null);
//       // Optionally: you could show a toast or redirect here
//     }, msLeft);

//     return () => clearTimeout(timer);
//   }, [token]);

//   // sync across tabs
//   useEffect(() => {
//     const onStorage = (e: StorageEvent) => {
//       if (e.key !== STORAGE_KEY) return;
//       const newToken = e.newValue;
//       setToken(newToken);
//       setUser(newToken ? parseJwt(newToken) : null);
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   const login = useCallback((newToken: string) => {
//     try {
//       localStorage.setItem(STORAGE_KEY, newToken);
//       setToken(newToken);
//       setUser(parseJwt(newToken));
//     } catch (err) {
//       console.error("Auth login error:", err);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem(STORAGE_KEY);
//     setToken(null);
//     setUser(null);
//     // optional: redirect here if you want
//     // window.location.href = "/sign-in";
//   }, []);

//   const getAuthHeaders = useCallback(() => {
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   }, [token]);

//   return { state: { token, user, isAuthenticated: !!token && !!user }, login, logout, getAuthHeaders };
// }

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const { state, login, logout, getAuthHeaders } = useAuthContextValueInitial();

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       token: state.token,
//       user: state.user,
//       isAuthenticated: state.isAuthenticated,
//       login,
//       logout,
//       getAuthHeaders,
//     }),
//     [state, login, logout, getAuthHeaders]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

// export default AuthProvider;




"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DecodedToken = {
  userId?: string;
  username?: string;
  email?: string;
  exp?: number; // seconds since epoch
  [k: string]: any;
};

type AuthState = {
  token: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
};

const STORAGE_KEY = "token";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";
    const decoded = atob(payload);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

export function useAuthContextValueInitial(): {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
} {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<DecodedToken | null>(() => {
    if (!token) return null;
    return parseJwt(token);
  });

  // schedule auto logout on token expiry
  useEffect(() => {
    if (!token) return;
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return;

    const nowMs = Date.now();
    const expMs = decoded.exp * 1000;
    const msLeft = expMs - nowMs;

    if (msLeft <= 0) {
      // already expired
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setToken(null);
      setUser(null);
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setToken(null);
      setUser(null);
    }, msLeft);

    return () => clearTimeout(timer);
  }, [token]);

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const newToken = e.newValue;
      setToken(newToken);
      setUser(newToken ? parseJwt(newToken) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((newToken: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, newToken);
    } catch (err) {
      console.error("Auth login localStorage error:", err);
    }
    setToken(newToken);
    setUser(parseJwt(newToken));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Auth logout localStorage error:", err);
    }
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      // optional redirect
      window.location.href = "/sign-in";
    }
  }, []);

  // <-- IMPORTANT: explicit return type and always-return Record<string,string>
  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [token]);

  return {
    state: { token, user, isAuthenticated: !!token && !!user },
    login,
    logout,
    getAuthHeaders,
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, login, logout, getAuthHeaders } = useAuthContextValueInitial();

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      login,
      logout,
      getAuthHeaders,
    }),
    [state, login, logout, getAuthHeaders]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
