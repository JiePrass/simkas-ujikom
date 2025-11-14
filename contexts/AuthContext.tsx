import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    fullName: string;
    email: string;
    profilePicture?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // load from storage
    useEffect(() => {
        (async () => {
            const storedToken = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");

            if (storedToken) setToken(storedToken);
            if (storedUser) setUser(JSON.parse(storedUser));
        })();
    }, []);

    const login = async (token: string, user: User) => {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
