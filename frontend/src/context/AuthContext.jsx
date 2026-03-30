import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

function setTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

    useEffect(() => {
        async function loadMe() {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await authApi.me();
                setUser(response.data);
            } catch {
                clearTokens();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadMe();
    }, []);

    async function login(email, password) {
        const response = await authApi.login({ email, password });
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);

        const meResponse = await authApi.me();
        setUser(meResponse.data);
    }

    async function register(payload) {
        await authApi.register(payload);
    }

    function logout() {
        clearTokens();
        setUser(null);
    }

    const value = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated,
            login,
            register,
            logout
        }),
        [user, isLoading, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
