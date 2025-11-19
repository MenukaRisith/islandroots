import { useMemo } from "react";
import { useAuthContext } from "~/context/AuthContext";

export function useAuth() {
  const { user, token, loading, login, register, logout, setUser, setToken } =
    useAuthContext();

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "ADMIN";

  return useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      setUser,
      setToken,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      setUser,
      setToken,
    ]
  );
}
