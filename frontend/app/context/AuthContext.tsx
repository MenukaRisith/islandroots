import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "~/types/domain";
import {
  fetchCurrentUserClient,
  loginClient,
  registerClient,
} from "~/utils/api.client";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (args: { email: string; password: string }) => Promise<void>;
  register: (args: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = "islandroots_auth_token_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider: wraps the app in root.tsx.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token from localStorage on first mount
  useEffect(() => {
    if (!isBrowser()) return;
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setTokenState(storedToken);
  }, []);

  // Whenever token changes from null -> value, fetch current user
  useEffect(() => {
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }

    // At this point token is truthy, so we can safely assert it's a string
    const authToken = token as string;
    let isActive = true;

    async function loadUser() {
      setLoading(true);
      try {
        const me = await fetchCurrentUserClient(authToken);
        if (!isActive) return;

        const userObj: User = {
          id: me.id,
          name: me.name,
          email: me.email,
          phone: me.phone,
          role: me.role,
          createdAt: "", // extend if backend returns createdAt
        };

        setUserState(userObj);
      } catch {
        if (!isActive) return;
        // token might be invalid
        setUserState(null);
        if (isBrowser()) {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        setTokenState(null);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      isActive = false;
    };
  }, [token]);

  const setUser = useCallback((value: User | null) => {
    setUserState(value);
  }, []);

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);
    if (!isBrowser()) return;

    if (value) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, value);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, []);

  const login = useCallback(
    async (args: { email: string; password: string }) => {
      const result = await loginClient(args);
      setToken(result.token);
      const userObj: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        createdAt: "",
      };
      setUser(userObj);
    },
    [setToken]
  );

  const register = useCallback(
    async (args: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      const result = await registerClient(args);
      setToken(result.token);
      const userObj: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        createdAt: "",
      };
      setUser(userObj);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setUserState(null);
    setToken(null);
  }, [setToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      setUser,
      setToken,
    }),
    [user, token, loading, login, register, logout, setUser, setToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
