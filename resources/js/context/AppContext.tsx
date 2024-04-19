import React, { createContext, useContext, ReactNode } from "react";
import { TContact, TCustomField, TUser } from "../entities";
import { useLoggedInUser } from "../api/query/userQuery";

// Define the context type
interface IAppContext {
    loggedInUser: TUser | null;
    isRoleStats: boolean;
    isSUperAdmin: boolean;
}

// Create the context
const AppContext = createContext<IAppContext | undefined>(undefined);

// Define a custom provider component
interface AppContextProviderProps {
    children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
    const { user } = useLoggedInUser();

    return (
        <AppContext.Provider
            value={{
                loggedInUser: user ?? null,
                isRoleStats: user?.role == "stats",
                isSUperAdmin: user?.role == "superAdmin",
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

// Create a custom hook to access the context
export function useAppContextProvider() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useCallContext must be used within an CallProvider");
    }
    return context;
}
