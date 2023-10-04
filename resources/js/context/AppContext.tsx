import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { TContact, TUser } from "../entities";
import { useContactsAll } from "../api/query/contactsQuery";
import { useLoggedInUser } from "../api/query/userQuery";

// Define the context type
interface IAppContext {
    contacts: TContact[];
    isContactsLoading: boolean;
    refetchContacts: any;
    loggedInUser: TUser;
}

// Create the context
const AppContext = createContext<IAppContext | undefined>(undefined);

// Define a custom provider component
interface AppContextProviderProps {
    children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
    const {
        contacts,
        isLoading: isContactsLoading,
        refetch: refetchContacts,
    } = useContactsAll("All");

    const { user } = useLoggedInUser();
    return (
        <AppContext.Provider
            value={{
                contacts: contacts ?? [],
                isContactsLoading,
                refetchContacts,
                loggedInUser: user,
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
