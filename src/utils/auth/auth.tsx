import nookies from "nookies";
import React, { createContext, useContext, useEffect, useState } from "react";

import { firebaseClient } from "./firebaseClient";

const AuthContext = createContext<{ user: firebaseClient.User | null }>({
    user: null
});

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<firebaseClient.User | null>(null);

    useEffect(() => {
        return firebaseClient.auth().onIdTokenChanged(async (user) => {
            if (!user) {
                setUser(null);
                nookies.destroy(undefined, "token", { path: "/" });
                return;
            }

            const token = await user.getIdToken();
            setUser(user);
            nookies.set(undefined, "token", token, { path: "/" });
        });
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
